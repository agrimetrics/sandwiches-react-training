#!/bin/sh

git diff --quiet HEAD
CHANGES=$?
if [ "$CHANGES" -ne 0 ]; then
  echo "\033[31mWorking tree not clean! Stash (or revert) remaining changes then retry push.\033[0m"
  git diff --shortstat HEAD
  exit 2
fi

npm run test:eslint && npm run test
SUCCESS=$?

exit $SUCCESS
