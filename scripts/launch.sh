#!/bin/bash

ROOT="$( dirname $(echo $0))/.."
if [ "`echo "$ROOT" | cut -c1`" != "/" ];
then
        ROOT="$(pwd)/$ROOT"
fi

if [ "x$ROOT" = "x" ];
then
        echo ""
        echo "Shell variable \$ROOT is not set. Please set variable like"
        echo "    ROOT=\"path to the repository trunk\" "
        echo ""
        exit 1
fi

export PATH=$PATH:${ROOT}/scripts/google_appengine

echo "We are starting the GAE, and the webpage will be http://localhost:8080"

dev_appserver.py $ROOT
