/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/request-promise/request-promise.d.ts" />

import Express = require('express');
import ReqProm = require('request-promise');


export function configure(expressApp: Express.Express, clientId: string, clientSecret: string) {
	expressApp.get('/check/:token/:scopes', (req: Express.Request, res: Express.Response) => {
		const token = req.params['token'], scopes = req.params['scopes'].split(','),
			rqpOptions = {
				uri: 'https://api.github.com/applications/' + clientId +'/tokens/' + token,
				json: true,
				headers: {
					'User-Agent': 'Github Comments Authorizer'
				},
				auth: {
					user: clientId,
					pass: clientSecret
				}
			};
		
		res.type('text/plain');
		
		ReqProm(rqpOptions).then(json => {
			// check all scopes:
			for (var i = 0; i < scopes.length; i++) {
				if ((<string[]>json.scopes).filter(scope => scope === scopes[i]).length === 0) {
					// scope not present in authorization
					res.statusCode = 404;
					break;
				}
			}
			
			res.end();
		}).catch(e => {
			res.statusCode = 404;
			res.end();
		});
	});
};