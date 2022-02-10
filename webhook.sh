#!/bin/bash

set -eo pipefail
IFS=$'\n\t'

# This script set url $2 to token TG API $1
TOKEN="$1"
URL="$2"

if [ -z "$TOKEN" ]
then
  echo "Token is not provided!"
  exit 1
fi

if [ -z "$URL" ]
then
  echo "URL is not provided!"
  exit 1
fi

DATA="{\"url\": \"$URL\"}"

echo "Data: $DATA"

curl -v -X "POST" "https://api.telegram.org/bot$TOKEN/setWebhook" \
    -d "$DATA" \
    -H "Content-Type: application/json; charset=utf-8"
