#!/usr/bin/env bash

# Deploy develop branch on github pages
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD) \
&& git checkout gh-pages \
&& git merge develop \
&& npm run build \
&& mv build/* ./ \
&& git commit \
&& git push github gh-pages \
&& checkout $CURRENT_BRANCH
