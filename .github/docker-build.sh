#!/bin/sh

# Argument 1: URL of the docker registry to publish the docker image to.
REGISTRY=$1

docker login -u $JFROG_WRITER_SA_USERNAME -p $JFROG_WRITER_SA_PASSWORD $REGISTRY

# Move to the package folder and copy the user's .npmrc file.
cd $PACKAGE_PATH

# Get the package name and package version from the package.json file.
PACKAGE_NAME=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | sed 's/@.*\///g' | tr -d '[[:space:]]')
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

# Build, tag and push the docker image.
docker build -t "metric/$PACKAGE_NAME" .
docker tag "metric/$PACKAGE_NAME" $REGISTRY/$PACKAGE_NAME:$PACKAGE_VERSION
docker push $REGISTRY/$PACKAGE_NAME:$PACKAGE_VERSION