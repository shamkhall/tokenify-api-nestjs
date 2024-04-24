# Authentication and Authorization System with NestJS and JWT

## Beside access token you can also use refresh token to get new tokens

## 1. Getting started

### 1.1 Requirements

Before starting, make sure you have at least those components on your workstation:

- An up-to-date release of [NodeJS](https://nodejs.org/) such as 20.x and NPM
- A database such as PostgreSQL. You may use the provided `docker-compose.yml` file.

### 1.2 Project configuration

Start by cloning this project on your workstation in Github.

``` sh
git clone https://github.com/shamkhall/tokenify-api-nestjs
```

The next thing will be to install all the dependencies of the project.

```sh
cd ./tokenify-api-nestjs
npm install
```

### 1.3 Launch and discover

You are now ready to launch the NestJS application using the command below.

You can now head to `http://localhost:3000/docs` and see your API Swagger docs.

## 3. Default NPM commands

The NPM commands below are already included with this template and can be used to quickly run, build and test your project.

```sh
# Start the application using the transpiled NodeJS
npm run start

# Run the application using "ts-node"
npm run dev

# Transpile the TypeScript files
npm run build

# Run the project' functional tests
npm run test

# Lint the project files using TSLint
npm run lint
```
