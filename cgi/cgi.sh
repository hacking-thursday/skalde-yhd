#!/bin/bash
echo "Content-type: text/plain"
echo ""
echo $SERVER_SOFTWARE
echo $GATEWAY_INTERFACE
echo $SERVER_PROTOCOL
echo $SERVER_PORT
echo $REQUEST_METHOD
echo $PATH_INFO
echo $PATH_TRANSLATED
echo $SCRIPT_NAME
echo $QUERY_STRING
echo $REMOTE_HOST
echo $REMOTE_ADDR
echo $AUTH_TYPE
echo $REMOTE_USER
echo $REMOTE_IDENT
echo $CONTENT_TYPE
echo $CONTENT_LENGTH
echo $HTTP_ACCEPT
echo $HTTP_USER_AGENT

