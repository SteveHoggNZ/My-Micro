# my-micro
My experiment with AWS Lambda, Micro Services and Continuous Delivery via git tag triggers

# Setup

```
PROJECT='my-micro'; ENVIRONMENT='dev'; aws cloudformation deploy --template-file services/cd-infrastructure/cf.yml --stack-name my-micro-dev --parameter-overrides ProjectNameParameter=${PROJECT}-${ENVIRONMENT} --capabilities CAPABILITY_IAM
```

## Create Infrastructure

```
PROJECT='my-micro' \
ENVIRONMENT='dev' \

aws cloudformation create-stack \
  --stack-name ${PROJECT}-${ENVIRONMENT} \
  --template-body file://services/cd-infrastructure/cf.yml \
  --parameters ParameterKey=ProjectNameParameter,ParameterValue=${PROJECT}-${ENVIRONMENT} \
               ParameterKey=SvcUrlParameter,ParameterValue=https://github.com/SteveHoggNZ/my-micro.git \
  --capabilities CAPABILITY_IAM \
  --tags Key=project,Value=${PROJECT} Key=environment,Value=${ENVIRONMENT}
```

## Update Infrastructure

```
PROJECT='my-micro' \
ENVIRONMENT='dev' \

aws cloudformation deploy \
  --stack-name ${PROJECT}-${ENVIRONMENT} \
  --template-file services/cd-infrastructure/cf.yml \
  --parameter-overrides ProjectNameParameter=${PROJECT}-${ENVIRONMENT} \
                        SvcUrlParameter=https://github.com/SteveHoggNZ/my-micro.git \
  --capabilities CAPABILITY_IAM
```
