# Welcome to the auth0-spa-demo frontend CDK TypeScript project

This subdirectory contains code to deploy this project - the auth0 spa demo - into the dpa-ID infrastructure.
Note that the deployment as such is not related to building the actual docker container or to the current state of
the actual application sources. Instead the deployment scripts are parameterized with a variables that select
a _particular_ docker container for deployment by providing the requested image tag.

Effectively this project will obtain the docker image to be deployed from the existing repository for the auth0 spa demo.
The creator of the image must make sure that image tags created from this project will not collide with image tags
from the dpa-ID frontend repository. In particular, avoid pushing the latest tag.

## Prerequisites

To execute this script locally you need to have cdk installed.

``npm install -g aws-cdk``

Also make sure that your exposed AWS identity is capable of performing the
required administrative actions, e.g.

``export AWS_PROFILE=dpaid``
``export AWS_REGION=eu-central-1``

## Configuration

Configuration is supplied in files within the config folder. There is one configuration file
per stage. Currently, the following stages are known.

* demo

Note that the configuration includes various constants that are used to "lookup" existing resources in the
environment using their arns or ids. These resource values must only be changed, if the infrastructure used
is changed or updated. Likewise, changes or updates to the overall infrastructure may impact deployments
performed using this cdk project.

## Deployment

You need to provide a stage for which the deployment should be executed.
Currently only the stage "demo" is supported.

``export STAGE=demo``

You need to provide the TAG in the ECR registry that you want to deploy.

``export IMAGE_TAG=0966fb9``

You can define an optional identifier. If supplied, the identifier must not
exceed 8 characters and must only include url safe characters.

``export IDENTIFIER=mytest``

The application can then be deployed using

``cdk deploy dpa-id-auth0-spa-demo-<identifier>`` e.g.
``cdk deploy dpa-id-auth0-spa-demo-mytest``

## Destroy a setup

Note that you will need to supply the environment variables as shown above.

``cdk destroy dpa-id-auth0-spa-demo-<identifier>``


## Basic cdk related commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
