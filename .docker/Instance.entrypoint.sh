#!/bin/bash

cat /config/core.sh >> /tmp/.env
cat /config/plugin.sh >> /tmp/.env
source /tmp/.env

node index.js