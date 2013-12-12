
module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-jsdoc");
  grunt.loadNpmTasks("grunt-mocha-cli");
  grunt.loadNpmTasks("grunt-mocha-cov");
  grunt.loadNpmTasks("grunt-jscoverage");

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

    /**
     * Mocha单元测试
     */
    mochacli: {
      options: {
        require: ["should"]
      , reporter: "nyan"
      , bail: true
      },
      all: [
        "test/cases/core/*.js"
      ]
    },

    /**
     * 生成coverage统计用代码
     */
    jscoverage: {
      options: {
        inputDirectory: "lib",
        outputDirectory: "test/coverage/lib"
      }
    },

    /**
     * 生成coverage报告
     */
    mochacov: {
      options: {
        reporter: "html-cov"
      , require: ["should"]
      },
      all: [
        "test/cases/core/models/test_mod_company.js"
      , "test/cases/core/models/test_mod_master.js"
      ]
    },

    /**
     * 清楚临时数据
     */
    clean: [
      "test/coverage"
    , "docs"
    ]

  });

  grunt.registerTask("test", ["jscoverage", "mochacov", "clean"]);
};
