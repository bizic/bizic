#!/bin/bash
set -e

if [[ -z $1 ]]; then
  echo "Enter package name: "
  read -r PACKAGE
else
  PACKAGE=$1
fi

if [[ -z $2 ]]; then
  echo "Enter new version: "
  read -r VERSION
else
  VERSION=$2
fi

if [[ -n $3 ]]; then
  RELEASE_TAG=$3
fi

read -p "Releasing $PACKAGE $VERSION - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Releasing $PACKAGE $VERSION ..."

  # test & build
  npm run test
  npm run build

  cd packages/$PACKAGE
  VERSION=$(npm version "$VERSION" | tail -1)
  VERSION=${VERSION//"v"/""}
  if [[ -z $RELEASE_TAG ]]; then
    npm publish
  else
    npm publish --tag "$RELEASE_TAG"
  fi
  cd ../../

  # commit
  git add -A
  git commit -m "chore($PACKAGE): release v$VERSION"

  # tag
  git tag auk-$PACKAGE@$VERSION

  # push
  git push --tags
  git push
fi
