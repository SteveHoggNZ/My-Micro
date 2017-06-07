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
      --bucket)
      bucket="$2"
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

if [[ ! -z $bucket ]]; then
  SVC_BUCKET=$bucket
fi

if [[ -z $SVC_ENVIRONMENT ]] || [[ -z $SVC_BUCKET ]]; then
  echo
  echo "Error: environment and bucket must be set"
  echo
  echo "Usage: npm run build -- --env dev|test|prod --bucket bucket"
  echo
  echo "Alternatively, you can set the SVC_ENVIRONMENT and SVC_BUCKET environment variables"
  exit 2
else
  echo "Deploy Direct: ${SVC_PROJECT}-${SVC_SERVICE}-${SVC_ENVIRONMENT}"
  echo
  aws cloudformation package --template-file sam.yml \
    --output-template-file sam-out.yml \
    --s3-bucket ${SVC_BUCKET} \
    --s3-prefix package/${SVC_PROJECT}/${SVC_SERVICE}/${SVC_VERSION}/${SVC_ENVIRONMENT}
fi
