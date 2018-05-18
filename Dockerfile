FROM timbru31/node-alpine-git

EXPOSE 80

# Create server directory
RUN mkdir server

COPY ./config.json /server/
COPY ./index.js /server/
COPY ./package.json /server/
COPY ./yarn.lock /server/

# Instal server dependencies
WORKDIR /server/
RUN yarn


# Create content
RUN git clone https://github.com/girlsjs/www.git


# Install hexo for content
WORKDIR /server/www/pl/
RUN yarn


# Create theme
WORKDIR /server/www/pl/themes/
RUN git clone https://github.com/girlsjs/www-theme.git


# initial build
WORKDIR /server/www/pl/
RUN yarn hexo generate --config=_prod-config.yml


# run!
WORKDIR /server/
CMD node ./index.js
