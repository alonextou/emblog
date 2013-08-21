module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		watch: {
			sass: {
				files: 'public/sass/*',
				tasks: ['compass:dev']
			},
			neuter: {
				files: ['public/js/app/**/*.js'],
                tasks: ['neuter']
			},
			emberTemplates: {
				files: 'public/js/app/templates/**/*.hbs',
				tasks: ['emberTemplates']
			}
		},
		compass: {
			dev: {
				options: {
					require: 'zurb-foundation',
					sassDir: 'public/sass',
					cssDir: 'public/css',
				}
			},
			dist: {
				options: {
					require: 'zurb-foundation',
					sassDir: 'public/sass',
					cssDir: 'dist/css',
					outputStyle: 'compressed'
				}
			}
		},
		neuter: {
			dev: {
                options: {
                    filepathTransform: function (filepath) {
                        return 'public/js/app/' + filepath;
                    }
                },
				src: 'public/js/app/app.js',
				dest: 'public/js/global.js'
			}
		},
       	copy: {
            dev: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'public/',
                    dest: 'dist/',
                    src: [
                        'js/global.js',
                        'js/templates.js'
                    ]
                }]
            }
        },
		htmlmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'public',
                    src: '*.html',
                    dest: 'dist'
                }]
            }
        },
		useminPrepare: {
			html: 'public/index.html',
			options: {
                dest: 'dist/'
            }
		},
		usemin: {
			html: ['dist/index.html'],
		},
        emberTemplates: {
            options: {
                templateName: function (sourceFile) {
                    var templatePath = 'public/js/app/templates/';
                    return sourceFile.replace(templatePath, '');
                }
            },
            dist: {
                files: {
                    'public/js/templates.js': 'public/js/app/templates/**/*.hbs'
                }
            }
        }
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-neuter');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-ember-templates');

	grunt.registerTask('default', ['compass:dev', 'neuter', 'emberTemplates']);
	grunt.registerTask('dist', ['compass:dist', 'neuter', 'emberTemplates', 'copy', 'htmlmin', 'useminPrepare', 'concat', 'uglify', 'usemin' ]);

};