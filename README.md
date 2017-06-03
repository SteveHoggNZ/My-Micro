# my-repo

my-micro contains my experiment with AWS Lambda, Micro Services and Continuous Delivery via git tag triggers

## To Do

* Pass role by reference: Role: 'arn:aws:iam::798269391015:role/lambda_basic_execution'
* Figure out how SAM works with API Gateway stages e.g. prod etc
* Fix cli bug with nested stack uri: https://github.com/aws/aws-cli/pull/2360
* Initial delivery setup
  * Deploy from local
  * Requirements - Reduce these further?
    * lambda has stackname prefix
    * buildspec.yml - file exists
    * package.json - project defined
    * sam.yml - TemplateURL set to ./ for pipeline

# Setup

```
PROJECT='my-micro'; ENVIRONMENT='dev'; aws cloudformation deploy --template-file services/cd-infrastructure/cf.yml --stack-name my-micro-dev --parameter-overrides ProjectNameParameter=${PROJECT}-${ENVIRONMENT} --capabilities CAPABILITY_IAM
```

## Infrastructure Names

At the time of writing, !ImportValue for Policies in SAM definitions were not working, so absolute naming was required and CAPABILITY_NAMED_IAM.

```
- !ImportValue 'my-micro-dev-LambdaBasicExecutionPolicy'
- !ImportValue 'my-micro-dev-LambdaCodeBuildPolicy'
```


## Create Infrastructure

```
PROJECT='my-cd'
ENVIRONMENT='dev'

aws cloudformation create-stack \
  --stack-name ${PROJECT}-${ENVIRONMENT} \
  --template-body file://my-cd/services/cd-infrastructure/cf.yml \
  --parameters ParameterKey=ProjectNameParameter,ParameterValue=${PROJECT} \
               ParameterKey=EnvironmentParameter,ParameterValue=${ENVIRONMENT} \
               ParameterKey=SvcUrlParameter,ParameterValue=https://github.com/SteveHoggNZ/my-micro.git \
  --capabilities CAPABILITY_NAMED_IAM \
  --tags Key=project,Value=${PROJECT} Key=environment,Value=${ENVIRONMENT}
```

## Update Infrastructure

```
PROJECT='my-cd'
ENVIRONMENT='dev'

aws cloudformation deploy \
  --stack-name ${PROJECT}-${ENVIRONMENT} \
  --template-file my-cd/services/cd-infrastructure/cf.yml \
  --parameter-overrides ProjectNameParameter=${PROJECT} \
                        EnvironmentParameter=${ENVIRONMENT} \
                        SvcUrlParameter=https://github.com/SteveHoggNZ/my-micro.git \
  --capabilities CAPABILITY_NAMED_IAM
```

# Process - To Do

```
PROJECT='my-micro'
ENVIRONMENT='dev'
SERVICE='cd-vcs-hook'
VERSION='1.0.0'

aws cloudformation package \
 --template-file sam.yml \
 --output-template-file sam-out.yaml \
 --s3-bucket h4-tmp \
 --s3-prefix extract/${PROJECT}/${SERVICE}/${VERSION}/${ENVIRONMENT}
```

```
PROJECT='my-micro'
ENVIRONMENT='dev'
SERVICE='cd-vcs-hook'
VERSION='1.0.0'

aws cloudformation deploy \
  --template-file /Users/steve/Work/H4/Experiments/my-micro/services/cd-vcs-hook/sam-out.yaml \
  --stack-name ${PROJECT}-${ENVIRONMENT}-${SERVICE} \
  --parameter-overrides ProjectNameParameter=${PROJECT} EnvironmentParameter=${ENVIRONMENT} \
  --capabilities CAPABILITY_IAM
```


# Useful Information

## Fn::GetParam

http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-parameter-override-functions.html

You can get values from JSON files stored in a CodePipeline artifact using Fn::GetParam

## Pipelines

Creating a pipeline in the console then describing it is the easiest option to see what needs to be defined in the CloudFormation YAML template i.e.

`aws codepipeline get-pipeline --name <name>`


## CloudFormation Deploy Permissions

When running a pipeline that tries to do a SAM CloudFormation deploy via CodeBuild e.g. ...

```
aws cloudformation deploy --template-file sam-out.yml --stack-name ${PROJECT}-${SERVICE}-${ENVIRONMENT} --parameter-overrides ProjectNameParameter=${PROJECT} ServiceNameParameter=${SERVICE} EnvironmentParameter=${ENVIRONMENT}
```

... the deploy stage failed with:

```
15:41:16
Waiting for changeset to be created..
15:41:16
15:41:16
'Status'
```

i.e. no useful error message. This is due to insufficient permissions for the role I assigned to CodeBuild (confirmed by allowing the role to do everything):

https://github.com/awslabs/serverless-application-model/issues/58

For that reason, I started using a CloudFormation deploy step using sam-out.yml (see the SAM pipelines in common/pipeliness)
