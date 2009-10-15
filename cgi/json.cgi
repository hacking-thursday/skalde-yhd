#!/bin/bash

if [[ $REQUEST_METHOD == "GET" ]]
then 
	./sql_webapi

elif [[ $REQUEST_METHOD == "POST" ]]
then
	echo "Content-type: text/plain"
	echo ""
	echo $QUERY_STRING

elif [[ $REQUEST_METHOD == "DELETE" ]]
then
	echo "Content-type: text/plain"
	echo ""
	echo "DELETE"
else
	echo "Content-type: text/plain"
	echo ""
fi
