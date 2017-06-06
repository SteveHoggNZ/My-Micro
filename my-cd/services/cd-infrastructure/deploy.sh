#!/bin/bash

set -x

aws cloudformation update-stack --stack-name my-cd-dev --template-body file://cf.yml --parameters ParameterKey=SvcUrlParameter,ParameterValue=https://github.com/SteveHoggNZ/my-repo.git ParameterKey=ProjectNameParameter,ParameterValue=my-cd --capabilities CAPABILITY_NAMED_IAM
