# sls-multi-offline

Tool that allows you to run multiple serverless api or db instance under for local development purposes

This repo is inspired from [sls-multi-gateways](https://github.com/edis/sls-multi-gateways)

sls-multi-gateways is a tool that allows you to run multiple api gateways under one domain for local development purposes.

[Here is a walkthrough article on medium](https://medium.com/@edisgonuler/run-multiple-serverless-applications-d8b38ef04f37)

## Getting started

### Installation

sls-multi-offline needs to be installed globally using the following command:

```bash
npm install -g sls-multi-offline
```

### Config

After installing sls-multi-offline, cd into your project directory

```bash
cd [project-directory]
```

Create a offline config file

```bash
touch offline.yml
```

Inside your sls-multi-offline config file add the services you would like to run

```yaml
port: [port the proxy will run on - (optional: default is 3000)]
stage: [stage the proxy will run on - (optional: default is dev)]
services:
  - name: [name of the service]
    path: [proxy path to the service]
    source: [path to the serverless.yml file belong to that service]
    stripBasePath: [whether the srvPath will be passed on to the proxy]
    type: [api or db]
  - name: [name of the service 2]
    path: [proxy path to the service 2]
    source: [path to the serverless.yml file belong to that service]
    stripBasePath: [whether the srvPath will be passed on to the proxy]
    type: [api or db]
```

Exemple :

```yaml
port: 3100
services:
  - name: users
    path: users
    source: ./sample/users
    type: api
  - name: posts
    path: posts
    source: ./sample/posts
    type: api
  - name: db
    path: db
    source: ./sample/db
    type: db
```

All paths by default are mapped to `localhost:[port]/[srvPath]`. To remove `path` , set `stripBasePath` to `true`.

### Usage

To run sls-multi-offline, execute the following cmd in the directory with the config file

```bash
sls-multi-offline
```

## For contributors

Debug :

```bash
npm run dev
```

create a post :

```bash
curl -X POST -H "Content-Type:application/json" http://localhost:3100/dev/create-post --data '{ "text": "Learn Serverless" }'
```

create a user :

```bash
curl -X POST -H "Content-Type:application/json" http://localhost:3101/dev/create-user --data '{ "text": "Learn Serverless" }'
```
