# my-repo

my-micro contains my experiment with AWS Lambda, Micro Services and Continuous Delivery via git tag triggers

## To Do

* Pass role by reference: Role: 'arn:aws:iam::798269391015:role/lambda_basic_execution'
* Figure out how SAM works with API Gateway stages e.g. prod etc

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
  --parameters ParameterKey=ProjectNameParameter,ParameterValue=${PROJECT}-${ENVIRONMENT} \
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
  --parameter-overrides ProjectNameParameter=${PROJECT}-${ENVIRONMENT} \
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
 --output-template-file output.yaml \
 --s3-bucket h4-tmp \
 --s3-prefix extract/${PROJECT}/${ENVIRONMENT}/${SERVICE}/${VERSION}
```

```
PROJECT='my-micro'
ENVIRONMENT='dev'
SERVICE='cd-vcs-hook'
VERSION='1.0.0'

aws cloudformation deploy \
  --template-file /Users/steve/Work/H4/Experiments/my-micro/services/cd-vcs-hook/output.yaml \
  --stack-name ${PROJECT}-${ENVIRONMENT}-${SERVICE} \
  --parameter-overrides ProjectNameParameter=${PROJECT} EnvironmentParameter=${ENVIRONMENT} \
  --capabilities CAPABILITY_IAM
```
