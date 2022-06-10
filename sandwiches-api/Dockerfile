FROM node:lts-buster-slim as base
WORKDIR /opt
ARG GITHUB_PACKAGES_TOKEN
RUN npm config set '//npm.pkg.github.com/:_authToken' $GITHUB_PACKAGES_TOKEN
RUN npm config set '@agrimetrics:registry' 'https://npm.pkg.github.com/'

# optional: pre-install/cache any heavy deps in this layer to save time on rebuilds...
# RUN npm install drafter --no-save

COPY package.json package-lock.json tsconfig.json ./

FROM base AS dependencies
RUN npm config set unsafe-perm true && npm ci
RUN rm ~/.npmrc
COPY swagger.yaml ./

FROM dependencies AS test
COPY . .
RUN npm run test:eslint
RUN npm run test

FROM dependencies AS pre-production
ADD app ./app
RUN npm run compile
RUN npm prune --production
RUN find . -type d -regex ".*/app/.*__tests__" | xargs rm -rf

FROM node:lts-buster-slim AS production

COPY --from=pre-production /opt/node_modules node_modules
COPY --from=pre-production /opt/dist .
COPY --from=pre-production /opt/app/config ./app/config
COPY --from=pre-production /opt/swagger.yaml .

RUN addgroup --gid 2000 app && adduser --disabled-password --gid 2000 --uid 2000 api
USER api

ARG VERSION
ENV VERSION $VERSION

ENV NODE_CONFIG_DIR ./app/config
CMD ["node", "./app/server.js"]
