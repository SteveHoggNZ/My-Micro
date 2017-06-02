#!/bin/bash

set -e

S3_QUEUE_DIR="${PWD}/queue"
mkdir -p ${S3_QUEUE_DIR}

PROJECT_DIR='project'
SERVICES_DIR='services'

echo "Processing Build Tag: ${BUILD_TAG}"

aws --version

# The tag should be in the format ${PROJECT}/${SERVICE}/${VERSION}(/${ENVIRONMENT})?
buildSplit=(${BUILD_TAG//\// })
PROJECT=${buildSplit[0]}
SERVICE=${buildSplit[1]}
VERSION=${buildSplit[2]}
ENVIRONMENT=${buildSplit[3]}

if [[ -z $PROJECT ]]; then
  echo "Error: PROJECT not set in tag"
  exit 2
fi

if [[ -z $SERVICE ]]; then
  echo "Error: SERVICE not set in tag"
  exit 2
fi

if [[ -z $VERSION ]]; then
  echo "Error: VERSION not set in tag"
  exit 2
fi

if [[ -z $ENVIRONMENT ]]; then
  echo "Error: ENVIRONMENT not set in tag"
  exit 2
fi

if [[ $ENVIRONMENT != 'dev' ]] && [[ $ENVIRONMENT != 'prod' ]]; then
  echo "Error: ENVIRONMENT value ${ENVIRONMENT} must be either dev or prod"
  exit 2
fi

SERVICE_DIR="${PROJECT}/${SERVICES_DIR}/${SERVICE}"
cp .eslintrc "${SERVICE_DIR}"
cp -pR "${PROJECT}/${PROJECT_DIR}" "${SERVICE_DIR}"

cd "${SERVICE_DIR}"

CHECK_SERVICE=$(node -p "require('./package.json').name")
CHECK_VERSION=$(node -p "require('./package.json').version")

# if [[ "${SERVICE}" != "${CHECK_SERVICE}" ]]; then
#   echo "Package service ${CHECK_SERVICE} does not match tag service ${SERVICE}"
#   exit 2
# fi
#
# if [[ "${VERSION}" != "${CHECK_VERSION}" ]]; then
#   echo "Package version ${CHECK_VERSION} does not match tag version ${VERSION}"
#   exit 2
# fi
#
EXTRACT_COMMANDS='zip -r ${S3_QUEUE_DIR}/${PROJECT}-${SERVICE}.zip .'

echo "=== Running Extract ==="

eval "${EXTRACT_COMMANDS}"

# echo "=== Running Package ==="
#
# PACKAGE_COMMAND="aws cloudformation package --template-file sam.yml --output-template-file output.yml --s3-bucket my-micro-dev-s3src-qu6nac7w0ump --s3-prefix package/${PROJECT}/${SERVICE}/${VERSION}/${ENVIRONMENT}"
#
# eval "${PACKAGE_COMMAND}"
