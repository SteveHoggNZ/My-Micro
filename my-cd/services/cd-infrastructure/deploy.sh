#!/bin/bash

SVC_ENVIRONMENT=dev

set -x

aws cloudformation update-stack --stack-name my-cd-${SVC_ENVIRONMENT} \
  --template-body file://cf.yml \
  --parameters ParameterKey=SvcUrlParameter,ParameterValue=https://github.com/SteveHoggNZ/my-repo.git \
              ParameterKey=ProjectNameParameter,ParameterValue=my-cd \
              ParameterKey=EnvironmentParameter,ParameterValue=${SVC_ENVIRONMENT} \
  --capabilities CAPABILITY_NAMED_IAM
