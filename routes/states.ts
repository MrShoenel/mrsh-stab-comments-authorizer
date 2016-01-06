/// <reference path="../typings/express/express.d.ts" />

import StateResource = require('../modules/StateResource');
import Express = require('express');

export function configure(expressApp: Express.Express) {
	/**
	 * This route should be used to retrieve an unguessable state which
	 * will be valid for ten minutes.
	 * If the request contains the parameter 'authorize_at' then we will
	 * redirect to that URL and append the state as parameter.
	 */
	expressApp.get('/state', (req: Express.Request, res: Express.Response) => {
		// If the following is set, we append the state as paramete and redirect.
		const authorizeAtUrl = req.param('authorize_at', null);

		if (authorizeAtUrl === null) {
			res.type('text/plain');
			res.end(StateResource.getState());
		} else {
			const decoded = decodeURIComponent(authorizeAtUrl);
			const queryOp = decoded.indexOf('?') >= 0 ? '&' : '?';
			res.redirect(decoded + queryOp + 'state=' + StateResource.getState());
			res.end();
		}
	});
};
