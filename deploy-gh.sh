#!/usr/bin/env bash

# Deploy develop branch on github pages
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD) \
&& git checkout gh-pages \
&& git merge develop \
&& npm run build \
&& rm -rf static \
&& mv build/* ./ \
&& git add static/* index.html favicon.ico asset-manifest.json logo192.png logo512.png manifest.json robots.txt \
&& git commit -m "updated github pages" \
&& git push github gh-pages \
&& checkout $CURRENT_BRANCH
