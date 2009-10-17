#!/bin/bash

if [[ $REQUEST_METHOD == "GET" ]]
then 
	echo "Content-type: text/plain"
	echo ""
	/bin/ls /tmp
fi
