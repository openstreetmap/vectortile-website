FROM node:24 AS styles

ENV TZ=UTC
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /app

# Install these from the official releases as building sprites and fonts is complex
# The version here must match the version in package.json
RUN curl -SL --remote-time --output sprites.tar.gz https://github.com/versatiles-org/versatiles-style/releases/download/v5.13.0/sprites.tar.gz \
    && mkdir -p _versatiles/shortbread/sprites \
    && mkdir -p release/shortbread/sprites \
    && tar -C _versatiles/shortbread/sprites -xzf sprites.tar.gz \
    && tar -C release/shortbread/sprites -xzf sprites.tar.gz \
    && find _versatiles/shortbread/sprites -type f -print0 | xargs -0 touch --reference sprites.tar.gz \
    && find release/shortbread/sprites -type f -print0 | xargs -0 touch --reference sprites.tar.gz \
    && rm -f sprites.tar.gz
RUN curl -SL --remote-time --output fonts.tar.gz https://github.com/versatiles-org/versatiles-fonts/releases/download/v2.1.0/fonts.tar.gz \
    && mkdir -p _versatiles/shortbread/fonts \
    && mkdir -p release/shortbread/fonts \
    && tar -C _versatiles/shortbread/fonts -xzf fonts.tar.gz \
    && tar -C release/shortbread/fonts -xzf fonts.tar.gz \
    && find _versatiles/shortbread/fonts -type f -print0 | xargs -0 touch --reference fonts.tar.gz \
    && find release/shortbread/fonts -type f -print0 | xargs -0 touch --reference fonts.tar.gz \
    && rm -f fonts.tar.gz

COPY *.ts package.json package-lock.json /app/
RUN npm install
RUN npm run build-versatiles

# Build the SVWD style
WORKDIR /app

RUN apt-get -q update && apt-get install -yqq curl git && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/SomeoneElseOSM/SomeoneElse-vector-web-display.git
RUN git -C /app/SomeoneElse-vector-web-display checkout 25cd96ee0a887354ca3bd5c1a1824853afdf4220

RUN mkdir -p /app/release/svwd/sprites
RUN cp /app/SomeoneElse-vector-web-display/resources/svwd03sprite{@2x.json,@2x.png,.json,.png} /app/release/svwd/sprites

RUN npm run build-svwd /app/SomeoneElse-vector-web-display/resources/svwd03_style.json
RUN cp svwd03style.json /app/release/svwd/svwd03style.json

# Precompress assets
RUN find /app/release/ -type f -size +512c \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.xml" -o -name "*.json" -o -name "*.svg" -o -name "*.ttf" -o -name "*.woff2" -o -name "*.woff" -o -name "*.eot" -o -name "*.otf" -o -name "*.pbf" \) -print0 | xargs -0 -P4 --no-run-if-empty gzip -9k --force --no-name

FROM ghcr.io/nginx/nginx-unprivileged:stable AS webserver

RUN echo "absolute_redirect off;" >/etc/nginx/conf.d/no-absolute_redirect.conf
RUN echo "gzip_static on; gzip_proxied any;" >/etc/nginx/conf.d/gzip_static.conf
COPY default.conf /etc/nginx/conf.d/

COPY demo /usr/share/nginx/html/demo
COPY --from=styles /app/release /usr/share/nginx/html/styles

RUN nginx -t

EXPOSE 8080
