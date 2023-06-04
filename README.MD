# C8y-Admin

## Description

This is the admin interface for data exporting and sharing solution based on [Cumulocity](https://cumulocity.com/guides/concepts/introduction/)
The solution consists of three services: c8y-admin(this), [c8y-data-service](https://github.com/martenka/c8y-data-service) and [c8y-core-service](https://github.com/martenka/c8y-core-service)


## Installation

```bash
$ yarn install
```

## Running all services

To run the whole solution, git clone this service,  [c8y-data-service](https://github.com/martenka/c8y-data-service) and [c8y-admin](https://github.com/martenka/c8y-admin),  
fill out necessary ENV variables and run the commands below. Dependencies (mongo, min.io, rabbitmq) will be run through  
docker, services will run on the host machine.
For that Node.js V18 or greater should be used (lower may work but have not been tested with).  
You can use [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) for easier Node.js version switching

The order of starting the services should be:
1. docker dependencies
2. c8y-data-service
3. c8y-core-service **Important:** For first run make sure data-service is running before starting core-service, otherwise the default user
   is not synced to data-service.
4. c8y-admin

## Running this service

### ENV variables
Cumulocity account (that works with its API) is necessary for the solution to work.  
Please contact the author on getting the credentials if necessary for testing purposes

In this service no env variables should be changed out of the box. However if admin-interface doesn't reach c8y-core-service, then make sure  
that REACT_APP_DOMAIN is using the port where c8y-core-service is running at

## Commands
```bash
# Service in watch mode OR
$ yarn start:dev

# Production mode
$ yarn build && yarn start:prod
```

## License

[MIT license](LICENSE.md).
