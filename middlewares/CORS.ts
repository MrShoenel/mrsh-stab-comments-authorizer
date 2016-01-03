/// <reference path="../typings/express/express.d.ts" />
import Express = require('express');


/**
 * A CORS middleware that sets appropriate headers when requesting
 * cross-domain.
 */
export function configure(expressApp: Express.Express) {
	expressApp.use((req: Express.Request, res: Express.Response, next: () => any) => {
		if (req.header('origin')) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'GET, POST');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			res.header('Content-Type', 'application/json; charset=utf-8');
		}
		next();
	});
};