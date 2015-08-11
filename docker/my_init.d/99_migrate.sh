#!/bin/sh
setuser www-data /bin/sh -c "cd /var/www/current && NODE_ENV=production ./node_modules/.bin/knex migrate:latest && NODE_ENV=production node results.js && /bin/true"
