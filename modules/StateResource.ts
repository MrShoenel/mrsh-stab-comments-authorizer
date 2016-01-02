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
	
	private interval: any = null;
	
	public constructor() {
		this.states = {};
	};
	
	private manageInterval(): void {
		const timeoutMillis = 60 * 10 * 1000;

		if (Object.keys(this.states).length === 0) {
			if (this.interval !== null) {
				clearInterval(this.interval);
				this.interval = null;
			}
		} else {
			if (this.interval === null) {
				this.interval = setInterval(() => {
					var now = +new Date, keys = Object.keys(this.states);
					for (let i = 0; i < keys.length; i++) {
						if ((this.states[keys[i]] + timeoutMillis) < now) {
							delete this.states[keys[i]];
						}
					}
				}, 30000);
			}
		}
	};
	
	public getState(): string {
		var id = UUID.v4();
		this.states[id] = +new Date;
		this.manageInterval();
		return id;
	};
	
	public validateState(state: string): boolean {
		if (this.states.hasOwnProperty(state)) {
			delete this.states[state];
			this.manageInterval();
			return true;
		}
		return false;
	};
};

// We export this single instance
export = new StateResource();