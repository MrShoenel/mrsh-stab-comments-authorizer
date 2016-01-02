'use strict';
module.exports = function(grunt) {
	// Dynamically loads all required grunt tasks
	require('matchdep').filterDev('grunt-*')
		.forEach(grunt.loadNpmTasks);
		
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		/**
		 * All TypeScript compilation tasks
		 */
		ts: {
			app: {
				src: ['./**/*.ts', '!./node_modules/**/*.ts'],
				options: {
					target: 'ES5',
					module: 'commonjs',
					sourceMap: true,
					declaration: false // won't create *.d.ts files
				}
			}
		}
	});
	
	grunt.registerTask('default', [
		'ts'
	]);
};