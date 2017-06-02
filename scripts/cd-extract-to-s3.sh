#!/bin/bash

set -e

# To Do: make the environment part of the tag too?
ENVIRONMENT="dev"

S3_QUEUE_DIR="${PWD}/queue"
mkdir -p ${S3_QUEUE_DIR}

PROJECT_DIR='project'
SERVICES_DIR='services'

echo "Build Tag: ${BUILD_TAG}"

# The tag should be in the format ${PROJECT}/${SERVICE}/${VERSION}(/${FUNCTION})?
buildSplit=(${BUILD_TAG//\// })
PROJECT=${buildSplit[0]}
SERVICE=${buildSplit[1]}
VERSION=${buildSplit[2]}
FUNCTION=${buildSplit[3]} #Optional

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
# PACKAGE_COMMAND="aws cloudformation package --template-file sam.yml --output-template-file output.yml --s3-bucket my-micro-dev-s3src-qu6nac7w0ump --s3-prefix package/${PROJECT}/${ENVIRONMENT}/${SERVICE}/${VERSION}"
#
# eval "${PACKAGE_COMMAND}"
