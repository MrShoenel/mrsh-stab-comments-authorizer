/// <reference path="../typings/node-uuid/node-uuid.d.ts" />

var UUID: INodeUUID = require('node-uuid');

/**
 * This class will create and temporarily buffer states so we
 * can validate them. Note that a created state will expire
 * after ten minutes, so that it can't be used to retrieve
 * OAuth authorization. 
 */
class StateResource {
	
	private states: { [key: string]: number };
	
	public constructor() {
		this.states = {};
		const timeoutMillis = 60 * 10 * 1000;
		
		setInterval(() => {
			var now = +new Date, keys = Object.keys(this.states);
			for (let i = 0; i < keys.length; i++) {
				if ((this.states[keys[i]] + timeoutMillis) < now) {
					delete this.states[keys[i]];
				}
			}
		}, 30000);
	};
	
	public getState(): string {
		var id = UUID.v4();
		this.states[id] = +new Date;
		return id;
	};
	
	public validateState(state: string): boolean {
		if (this.states.hasOwnProperty(state)) {
			delete this.states[state];
			return true;
		}
		return false;
	};
};

// We export this single instance
export = new StateResource();