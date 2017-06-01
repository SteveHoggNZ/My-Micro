#!/bin/bash

set -e

PROJECT=$(grep ^name: project/config.yml | cut -d ' ' -f 2)

S3_QUEUE_DIR="${PWD}/queue"

mkdir -p ${S3_QUEUE_DIR}

SERVICES_DIR='services'

echo ${BUILD_TAG}

# The tag should be in the format ${PROJECT}/${SERVICE}/${VERSION}(/${FUNCTION})?
buildSplit=(${BUILD_TAG//\// })
PROJECT=${buildSplit[0]}
SERVICE=${buildSplit[1]}
VERSION=${buildSplit[2]}
FUNCTION=${buildSplit[3]} #Optional

echo "project: ${PROJECT}"
echo "service: ${SERVICE}"
echo "version: ${VERSION}"
echo "function: ${FUNCTION}"

# cd "${SERVICES_DIR}/${SERVICE}"
#
# CHECK_SERVICE=$(node -p "require('./package.json').name")
# CHECK_VERSION=$(node -p "require('./package.json').version")
#
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
# EXTRACT_COMMANDS='cp ../../.eslintrc . && cp -R ../../project . && zip -r ${S3_QUEUE_DIR}/${PROJECT}-${SERVICE}.zip .'
# # EXTRACT_COMMANDS='cp ../../.eslintrc . && cp -R ../../project . && mkdir -p ${S3_QUEUE_DIR}/${SERVICE}/ && zip -r ${S3_QUEUE_DIR}/${SERVICE}.zip .'
#
# echo "=== Running Extract ==="
#
# eval "${EXTRACT_COMMANDS}"
