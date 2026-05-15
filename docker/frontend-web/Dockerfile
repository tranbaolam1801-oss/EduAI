FROM nginx:1.27-alpine

COPY docker/frontend-web/default.conf /etc/nginx/conf.d/default.conf
COPY frontend/web/ /usr/share/nginx/html/

EXPOSE 80
