module.exports = function(grunt) {
	grunt.initConfig({
		reload: {
			port: 6601,
			proxy: {
				host: 'localhost' 
			}
		},
		watch: {
			files: ['View/Dataview.js'],
			taks: ['reload']
		}
	});

	grunt.loadNpmTasks('grunt-reload');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['reload', 'watch']);
}
