# NestJS task manager CRUD
Code result from course [Nest.Js from Zero to Hero](https://www.udemy.com/course/nestjs-zero-to-hero/)

## Description
Course + a few of my own additions to make some thing more "production-like" dev environment:
- Dockerized app
- Dockerized dependencies (postgre + pgadmin) + docker-compose to run everything
- Using [Nest.Js config module](https://github.com/nestjs/config)

## Installation
As this is set to work with docker, you'll need to do a normal intall first, then run the containers.
```bash
$ npm install
```

## Running the app
As the app is configured along some containers for DB, I use docker-compose to spin everything up.
```bash
docker-compose up
```
All the environment values for the containers are set on their respective `.env` files.
_NOTE: you'll need to copy the sample files into their own .env files_

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
