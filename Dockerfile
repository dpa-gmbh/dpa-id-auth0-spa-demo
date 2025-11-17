FROM node:24.11.1-alpine as build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./


ARG VITE_AUTH0_CLIENT_ID
ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID

ARG VITE_AUTH0_DOMAIN
ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN

RUN npm run build

FROM public.ecr.aws/nginx/nginx:stable-alpine
ENV STAGE local

#
# Install jq
#
RUN apk add jq
RUN apk add sudo
RUN apk add --no-cache aws-cli
RUN apk add --no-cache bash

COPY default.conf /tmp/default.template
COPY gzip.conf /etc/nginx/conf.d/gzip.conf
COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN  chmod +x /usr/bin/entrypoint.sh
ADD stageconfigs/*.conf /usr/share/nginx/stageconfigs/
RUN envsubst '$STAGE' < /tmp/default.template > /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
ENTRYPOINT /usr/bin/entrypoint.sh
