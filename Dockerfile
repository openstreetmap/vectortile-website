# https://github.com/nginxinc/docker-nginx-unprivileged
FROM node:22 AS versatiles

WORKDIR /app
ADD . /app/
RUN npm install

RUN npm run build
