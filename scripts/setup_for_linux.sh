#!/bin/bash

GAE_PKG_URL="http://googleappengine.googlecode.com/files/google_appengine_1.2.7.zip"
GAE_FILENAME=$(basename $GAE_PKG_URL)
GAE_DIR="google_appengine"

echo $GAE_FILENAME

test -f $GAE_FILENAME || wget --continue $GAE_PKG_URL
unzip $GAE_FILENAME

