#!/bin/bash

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
  echo "Error: environment must be set"
  echo
  echo "Usage: npm run tag:release -- --env dev|test|prod"
  echo
  echo "Alternatively, you can set the SVC_ENVIRONMENT environment variables"
  exit 2
fi

echo
echo -n "The current package version is ${SVC_VERSION}, do you want to increment the patch level? [y/N]:"
read patch
echo

if [[ $patch == y ]] || [[ $patch == Y ]]; then
  npm version patch >/dev/null
  SVC_VERSION=$(node -p "require('./package.json').version")
fi

tag=${SVC_PROJECT}/${SVC_SERVICE}/${SVC_VERSION}/${SVC_ENVIRONMENT}

echo "New tag: ${tag}"
echo

echo "The following files have not been committed yet:"
echo "================================================"
git status .
echo "================================================"
echo

echo -n "Would you like to tag this release as ${tag} and push the tag to master? [y/N]:"
read push

if [[ $push == y ]] || [[ $push == Y ]]; then
  echo
  echo "Tagging release and pushing to master"
  git tag $tag && git push origin $tag
  echo
else
  echo
  echo "Skipping release"
  echo
fi
