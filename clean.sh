#!/bin/bash

if [ -f "./package-lock.json" ]; then
    rm ./package-lock.json
fi

if [ -d "./node_modules" ]; then
    rm -rf ./node_modules
fi
