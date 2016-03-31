//Gruntプラグインの導入（watchの場合）
module.exports = function(grunt){

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.loadNpmTasks("grunt-shell");
	grunt.loadNpmTasks("grunt-remove-logging");
	grunt.loadNpmTasks("grunt-newer");


	//基本的なタスクセット
    grunt.initConfig({
        concat:{
            baseJS:{
                src:[
                    "common/js/lib/pageInfo.js",
                    "common/js/jquery/jquery.js",
                    "common/js/jquery/easing.js",
                    "common/js/lib/library.js",
					"common/js/ie/selectivizr.js"
                ],
                dest:"common/js/base.js"
            }
        },
		removelogging:{
			baseJS:{
				src: "common/js/base.js",
				dest:"common/js/minify/base.js"
			},
            mainJS:{
                src: "common/js/main.js",
                dest:"common/js/minify/main.js"
            }
		},
        uglify:{
			baseJS:{
                src:"common/js/base.js",
                dest:"common/js/minify/base.js"
            },
            mainJS:{
                src:"common/js/main.js",
                dest:"common/js/minify/main.js"
            }
        },
		clean:{
            js:"<%= concat.baseJS.dest %>"
        },
		sass:{
			options:{
				style: 'compact'
			},
			dist:{
				files:{
					'common/style/layout.css': 'common/scss/layout.scss',
					'common/style/contents.css': 'common/scss/contents.scss',
					'common/style/module.css': 'common/scss/module.scss'
				}
			}
		},
		autoprefixer:{
			options:{
				browsers: ['last 2 version','ie 8','ie 9','ios 5']
			},
			file:{
				expand: true,
				flatten: true,
				src:'common/style/*.css',
				dest:'common/style/'
			}
		},
		styleguide: {
			dist: {
				options: {
					framework: {
						name: 'compornents',
						options:{
							preprocessor:"scss"
						}
					}
				},
				files: {
				  'docs': 'common/scss/module.scss'
				}
			}
		},
		shell:{
			styledocco:{
				command: function () {
					return ' styledocco --o "common/style/compornents" --preprocessor "scss" common/scss/module.scss';
				}
			}
		},
        watch:{
			options: {
				spawn: false
			},
//            js:{
//                files:[
//                    "common/js/*.js",
//                    "common/js/lib/*.js",
//                    "common/js/jquery/*.js",
//                    "common/js/ie/*.js"
//                ],
//                tasks:["concat","removelogging","uglify"/*,"clean",*//*"utf8tosjis"*/]
//            },
			sass:{
				files:["common/scss/*.scss","common/scss/partials/*.scss"],
				tasks:"sass"
			},
			css:{
				files:"<%= autoprefixer.file.src %>",
                tasks:"autoprefixer"
			},
			styleguide:{
				files:["common/scss/module.scss","common/scss/README.md"],
                tasks:["newer:sass","shell:styledocco"]
			}
        }
	});

    //grunt.registerTask("default",["concat","uglify","clean","play"]);


};


