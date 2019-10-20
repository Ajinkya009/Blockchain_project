'use strict';

const logger          =   require('morgan');
const cookieParser    =   require('cookie-parser');
const bodyParser      =   require('body-parser');
const session         =   require('express-session');
const redis 		  =   require('redis');
const redisStore 	  =   require('connect-redis')(session);
const cors 			  =	  require('cors');
const keys            =   require('./keys');

module.exports = function(app){

	// use morgan to log requests to the console
	app.use(logger('dev'));

	// use body parser so we can get info from POST and/or URL parameters
	app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
	app.use(bodyParser.json({limit: '50mb'}));
    app.use(cookieParser());
    if(process.env.NODE_ENV!="ci"){
        const client = redis.createClient(keys.redisUrl);
        app.use(session({
            secret: 'RANDOMSECRETHERE',
            // create new redis store.
            store: new redisStore({ host: 'redis', port: 6379, client: client, ttl:5}),
            saveUninitialized: false,
            resave: false
        }));
    }
	
	app.use(cors());
}
