FROM node:12.18.3-alpine3.10 as base
ENV NODE_ENV=production

EXPOSE 3000
ENV PORT 3000

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production \
    && npm cache clean --force
ENV PATH=/app/node_modules/.bin:$PATH

RUN apk add --no-cache tini
# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install --only=development \
    && npm cache clean --force
USER node
CMD [ "nest", "start", "--watch" ]

FROM dev as test
ENV NODE_ENV=development
RUN npm test

FROM test as pre-prod
RUN rm -rf ./tests && rm -rf ./node_modules

FROM base as prod
COPY --from=pre-prod /app /app
HEALTHCHECK CMD curl http://127.0.0.1/ || exit 1
USER node
