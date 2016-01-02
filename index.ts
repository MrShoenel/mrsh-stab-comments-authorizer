/// <reference path="./typings/express/express.d.ts" />
import Express = require('express');

// We load the OAuth-client-secret from the environment and immediately
// end the application if it doesn't exist.
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID || null;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || null;
if (OAUTH_CLIENT_ID === null || OAUTH_CLIENT_SECRET === null) {
	process.exit(1);
}


var app: Express.Express = Express();

import route_auth = require('./routes/authorize');
import route_states = require('./routes/states');
import route_check = require('./routes/checkToken');

route_states.configure(app);
route_auth.configure(app, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET);
route_check.configure(app, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET);

app.listen(process.env.PORT || 80);
