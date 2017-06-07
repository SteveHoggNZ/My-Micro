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
echo -n "The current package version is ${SVC_VERSION}, do you want to increment the patch level? [y/N]: "
read patch
echo

if [[ $patch == y ]] || [[ $patch == Y ]]; then
  npm version patch >/dev/null
  git add package.json
  git commit -m "release (${SVC_SERVICE}): increment version number"
  SVC_VERSION=$(node -p "require('./package.json').version")
fi

tag=${SVC_PROJECT}/${SVC_SERVICE}/${SVC_VERSION}/${SVC_ENVIRONMENT}

echo "New tag: ${tag}"
echo

statusLog="$(git status .)"

if [[ "$(echo "${statusLog}" | egrep -c 'modified:|deleted:')" != "0" ]]; then
  echo "The following files under this directory have not been committed yet:"
  echo "================================================"
  echo "{$statusLog}"
  echo "================================================"
  echo

  echo -n "Please confirm you would like to proceed without commiting the files above: [y/N]: "
  read confirm
  echo

  if [[ $confirm != y ]] && [[ $confirm != Y ]]; then
    echo
    echo "Warning: Skipping release due to uncommited files"
    echo
    exit 0
  fi
fi

commitLog="$(git log --grep \(${SVC_SERVICE}\) -n 5)"
commit1="$(echo "$commitLog" | head -n 1 | sed 's/^commit //')"

echo "The following recent commits have been made for ${SVC_SERVICE}"
echo "================================================"
echo "{$commitLog}"
echo "================================================"
echo
echo -n "Which commit would you like to use? [$commit1]: "
read commit
echo

if [[ $commit == "" ]]; then
  commit="$commit1"
fi

if [[ $commit == "" ]]; then
  echo "Error: no commit specified"
  exit 2
fi

echo -n "Please confirm the release action: tag commit ${commit} with ${tag} and push the tag to master? [y/N]: "
read push

if [[ $push == y ]] || [[ $push == Y ]]; then
  echo
  echo "Tagging release and pushing to master"
  git tag $tag && git push origin $tag
  echo
else
  echo
  echo "Warning: Skipping release"
  echo
  exit 0
fi
