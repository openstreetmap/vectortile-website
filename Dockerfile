FROM node:22 AS versatiles

WORKDIR /app

# Install these from the official releases as building sprites and fonts is complex
# The version here must match the version in package.json
ADD https://github.com/versatiles-org/versatiles-style/releases/download/v5.6.0/sprites.tar.gz sprites.tar.gz
RUN mkdir -p _versatiles/shortbread/sprites && tar -C _versatiles/shortbread/sprites -xzf sprites.tar.gz && rm -f sprites.tar.gz

ADD https://github.com/versatiles-org/versatiles-fonts/releases/download/v2.0.0/fonts.tar.gz fonts.tar.gz
RUN mkdir -p _versatiles/shortbread/fonts && tar -C _versatiles/shortbread/fonts -xzf fonts.tar.gz && rm -f fonts.tar.gz

COPY *.ts package.json package-lock.json /app/
RUN npm install
RUN npm run build


FROM ghcr.io/nginxinc/nginx-unprivileged:stable-alpine AS webserver

RUN echo "absolute_redirect off;" >/etc/nginx/conf.d/no-absolute_redirect.conf
RUN echo "gzip_static on; gzip_proxied any;" >/etc/nginx/conf.d/gzip_static.conf

COPY demo /usr/share/nginx/html/demo
COPY --from=versatiles /app/_versatiles /usr/share/nginx/html/demo

RUN nginx -t

EXPOSE 8080