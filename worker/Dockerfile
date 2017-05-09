# This image serves the dependencies like tesseract and ocrmypdf and the ocr worker for the nextcloud ocr app.
# docker build --build-arg LANGUAGES="tesseract-ocr-deu" -t <your username>/ocr .
# docker run -e "CALLBACK_API_ADDRESS=http://localhost/nextcloud/apps/ocr/status" -e "NODE_ENV=production" --name ocr -v /path/to/data/directory/of/nextcloud:/home/node/data:ro -v /path/to/output/directory:/home/node/output -d <your username>/ocr
# TODO: worker adjustments: use directories, api callback
# TODO: add administration section to configure the languages that are available
#
FROM ubuntu:16.10

LABEL maintainer="janiskoehr@icloud.com" description="This image serves the dependencies like tesseract and ocrmypdf and the ocr worker for the nextcloud ocr app." vendor="Janis Koehr"
ARG LANGUAGES="tesseract-ocr-eng tesseract-ocr-fra tesseract-ocr-spa tesseract-ocr-deu"

# Nodejs
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    xz-utils \
    ca-certificates \
    gnupg2 \
    dirmngr

RUN groupadd --gid 1000 node \
    && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

# gpg keys listed at https://github.com/nodejs/node#release-team
RUN set -ex \
    && for key in \
        9554F04D7259F04124DE6B476D5A82AC7E37093B \
        94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
        FD3A5288F042B6850C66B31F09FE44734EB7990E \
        71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
        DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
        B9AE9905FFD7803F25714661B63B535A4C206CA9 \
        C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
        56730D5401028683275BD23C23EFEFE93C4CFFFE \
    ; do \
        gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key" || \
        gpg --keyserver pgp.mit.edu --recv-keys "$key" || \
        gpg --keyserver keyserver.pgp.com --recv-keys "$key" ; \
    done

ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 6.10.3

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
    && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
    && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
    && grep " node-v$NODE_VERSION-linux-x64.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
    && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
    && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Tesseract / languages and ocrmypdf deps installation
RUN apt-get install -y --no-install-recommends \
    tesseract-ocr \
    $LANGUAGES \
    ocrmypdf

# Clean up
RUN apt-get autoremove -y \
    && apt-get autoclean -y

# Create working directory and linked dirs for input and output
RUN mkdir -p /home/node/worker \
    && mkdir /home/node/data \
    && mkdir /home/node/output

# Workdir
WORKDIR /home/node/worker

# Bundle worker src
COPY . /home/node/worker

# Install worker dependencies
RUN npm install

# Build worker javascript files and delete src afterwards
RUN npm run build \
    && rm -r src/ package.json tsconfig.app.json tsconfig.json

USER node

CMD ["node","/home/node/worker/dist/main.js"]