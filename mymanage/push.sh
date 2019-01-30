#! /bin/bash
npm run build

ssh root@114.55.136.5 "rm -rf /var/www/website_manage/*"
scp -r dist/* root@114.55.136.5:/var/www/website_manage/
scp static/favicon.ico root@114.55.136.5:/var/www/website_manage/