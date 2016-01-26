#!/bin/bash

node data_processing/main-scrape-app-ids.js;
node data_processing/main-scrape-app-details.js;
node data_processing/main-process-app-icons.js;
node data_processing/main-generate-web-save-colors.js;