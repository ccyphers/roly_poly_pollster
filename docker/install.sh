#!/bin/sh

rt_check() {
  if [ "$1" != "0" ] ; then
    exit $1
  fi
}


set -xv
export NODE_ENV=production
echo "export NODE_ENV=production" >> /etc/profile

cp /build/conf/nginx.conf /etc/nginx/
cp -R /build/conf/sites-enabled /etc/nginx/

mkdir /var/www
chown www-data /var/www
npm install -g bower
rt_check $?

setuser www-data /bin/sh -c "git config --global url.\"https://\".insteadOf git://"
rt_check $?

setuser www-data /bin/sh -c "git clone https://github.com/ccyphers/roly_poly_pollster /var/www/current && cp /build/knexfile.js /var/www/current && cd /var/www/current && mkdir node_modules && npm install"
rt_check $?

setuser www-data /bin/sh -c "cd /var/www/current && bower install"
rt_check $?

cp /build/my_init.d/* /etc/my_init.d/
ln -s /var/www/current/ui /var/www/pollster
rm -f /etc/service/nginx/down
rm -rf /build
