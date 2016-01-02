/// <reference path="../typings/express/express.d.ts" />

import StateResource = require('../modules/StateResource');
import Express = require('express');

export function configure(expressApp: Express.Express) {
	/**
	 * This route should be used to retrieve an unguessable state which
	 * will be valid for ten minutes.
	 */
	expressApp.get('/state', (req: Express.Request, res: Express.Response) => {
		res.end(StateResource.getState());
	});
};