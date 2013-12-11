
module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jsdoc");

  grunt.initConfig({

    /**
     * less 编译器
     */
    less: {
      development: {
        options: {
          paths: []
        },
        files: {
          "app/public/smartadmin/stylesheets/admin.css": "app/public/smartadmin/stylesheets/admin.less"
        }
      },
      production: {
        options: {
          paths: []
        , compress: true
        },
        files: {
          "app/public/smartadmin/stylesheets/admin.min.css": "app/public/smartadmin/stylesheets/admin.less"
        }
      }
    },

    /**
     * 监视文件变更（执行less编译）
     */
    watch: {
      less: {
        files: ["*.less", "app/public/smartadmin/stylesheets/*.less"]
      , tasks: ["less:development", "less:production"]
      , options : {
          livereload: true
        , nospawn: true
        }
      }
    },

    /**
     * 代码检查
     */
    jshint: {
      files: [
        "lib/**/*.js"
      , "app/admin/**/*.js"
      , "bin/**/*.js"
      , "test/cases/**/*.js"
      ]
    , options: {
        jshintrc: ".jshintrc"
      }
    },

    /**
     * 文档生成
     */
    jsdoc : {
      dist : {
        src: [
          "lib/**/*.js"
        ]
      , options: {
          destination: "docs"
        }
      }
    },

    mochacli: {
      options: {
        require: ["should"],
        files: "test/cases/core/models/*.js"
      },
      nyan: {
        options: {
          reporter: "nyan"
        }
      }
    }


  });

};
