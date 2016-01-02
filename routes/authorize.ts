/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/request-promise/request-promise.d.ts" />

import StateResource = require('../modules/StateResource');
import Express = require('express');
import ReqProm = require('request-promise');

var handleError = (req: Express.Request, res: Express.Response, code: number) => {
	res.statusCode = code;
	res.end();
};

var exchangeCodeForAccessToken = (code: string, clientId: string, clientSecret: string): Promise<string> => {
	var options = {
		method: 'POST',
		uri: 'https://github.com/login/oauth/access_token?code=' + code + '&client_id=' + clientId + '&client_secret=' + clientSecret
	};
	
	return ReqProm(options).then((parsedBody: string) => {
		// looks like access_token=e72e16c7e42f292c6912e7710c838347ae178b4a&scope=user%2Cgist&token_type=bearer
		return parsedBody.split('&').filter(pair => pair.indexOf('access_token') === 0)[0].split('=')[1];
	});
};

export function configure(expressApp: Express.Express, clientId: string, clientSecret: string) {
	expressApp.get('/authorize', (req: Express.Request, res: Express.Response) => {
		var state = req.param('state', null),
			// The OAuth code which we use to obtain the access-token
			code = req.param('code', null),
			// This is where we finally send the access token to
			blogUrl = req.param('blog_url', null);

		if (!StateResource.validateState(state)) {
			handleError(req, res, 401);
			return;
		}
		if (blogUrl === null) {
			handleError(req, res, 400);
			return;
		}
		
		// Ok, now we have to exchange the code for a token:
		exchangeCodeForAccessToken(code, clientId, clientSecret).then((token: string) => {
			// redirect to blogurl:
			res.redirect(blogUrl + (blogUrl.indexOf('?') === -1 ? '?' : '&') + 'access_token=' + token);
			res.end();
		});
	});
};