[![Build Status](https://travis-ci.org/Ajinkya009/Project_matic.svg?branch=master)](https://travis-ci.org/Ajinkya009/Project_matic)

# Blockchain Project

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purpose. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Following things are required in order to run the code in development mode:

```
1) Node.js
2) MongodB
3) Redis
```

### Running server in development mode

After mongodb and redis server are up and running, run following commands:

```
1) npm install
2) npm start dev-server
```

Once the server starts:

```
1) It will notify user that it has started fetching and uploding data to database.
2) It will fetch transaction data of 12000 blocks and upload it to mongodb.
3) After the data is successfully uploaded, it will notify the user.
4) After the notification is displayed on the console, user can query transaction data of a particular user using following API:
    POST http://localhost:3000/api/user/getTransactions 
    request body: {userHash:"0x...."}
    response: {transactions: [{from:"", to:"", hash:"", blockNumber:""}]}
```


## Running the tests
```
npm run test
```

## Deployment in production mode

```
docker-compose build
docker-compose up
```
Once the server starts, it will follow same steps mentioned in the above section.

## Built With

* [Node.js](https://nodejs.org) - Server
* [MongodB](https://www.mongodb.com/) - Database
* [Redis](https://redis.io/) - Cache
* [Jest](https://jestjs.io/) - Test framework
* [Docker](https://www.docker.com/) - Container Platform
