#!/bin/bash

# Deploy directly to CloudFormation, bypassing the deployment pipeline

SVC_PROJECT=$(node -p "require('./package.json').project")
SVC_SERVICE=$(node -p "require('./package.json').name")
SVC_VERSION=$(node -p "require('./package.json').version")

while [[ $# -gt 1 ]]; do
  key="$1"

  case $key in
      --env|--environment)
      environment="$2"
      shift
      ;;
      *)
      # unknown option
      ;;
  esac
  shift
done

if [[ ! -z $environment ]]; then
  SVC_ENVIRONMENT=$environment
fi

if [[ -z $SVC_ENVIRONMENT ]]; then
  echo
  echo "Error: SVC_ENVIRONMENT was not set"
  echo
  echo "Usage: npm run deploy:direct -- --env dev|test|prod --bucket bucket"
  echo
  echo "Alternatively, you can set the SVC_ENVIRONMENT environment variable"
  exit 2
else
  echo "Deploy Direct: ${SVC_PROJECT}-${SVC_SERVICE}-${SVC_ENVIRONMENT}"
  echo
  aws cloudformation deploy --template-file sam-out.yml \
    --stack-name ${SVC_PROJECT}-${SVC_SERVICE}-${SVC_ENVIRONMENT} \
    --parameter-overrides ProjectNameParameter=${SVC_PROJECT} \
                          ServiceNameParameter=${SVC_SERVICE} \
                          VersionParameter=${SVC_VERSION} \
                          EnvironmentParameter=${SVC_ENVIRONMENT} \
    --capabilities CAPABILITY_IAM
  fi
