FROM node:24 AS versatiles

ENV TZ=UTC
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /app

# Install these from the official releases as building sprites and fonts is complex
# The version here must match the version in package.json
RUN curl -SL --remote-time --output sprites.tar.gz https://github.com/versatiles-org/versatiles-style/releases/download/v5.7.0/sprites.tar.gz \
    && mkdir -p _versatiles/shortbread/sprites \
    && tar -C _versatiles/shortbread/sprites -xzf sprites.tar.gz \
    && find _versatiles/shortbread/sprites -type f -print0 | xargs -0 touch --reference sprites.tar.gz \
    && rm -f sprites.tar.gz
RUN curl -SL --remote-time --output fonts.tar.gz https://github.com/versatiles-org/versatiles-fonts/releases/download/v2.0.0/fonts.tar.gz \
    && mkdir -p _versatiles/shortbread/fonts \
    && tar -C _versatiles/shortbread/fonts -xzf fonts.tar.gz \
    && find _versatiles/shortbread/fonts -type f -print0 | xargs -0 touch --reference fonts.tar.gz \
    && rm -f fonts.tar.gz

COPY *.ts package.json package-lock.json /app/
RUN npm install
RUN npm run build


FROM ghcr.io/nginxinc/nginx-unprivileged:stable-alpine AS webserver

RUN echo "absolute_redirect off;" >/etc/nginx/conf.d/no-absolute_redirect.conf
RUN echo "gzip_static on; gzip_proxied any;" >/etc/nginx/conf.d/gzip_static.conf
RUN sed -i -e '/^    location \/ {/a \        add_header '\''Access-Control-Allow-Origin'\'' '\''*'\'' always;' /etc/nginx/conf.d/default.conf

COPY demo /usr/share/nginx/html/demo
COPY --from=versatiles /app/_versatiles /usr/share/nginx/html/demo

RUN nginx -t

EXPOSE 8080
