'use strict';

//basic configuration object used by gulp tasks
module.exports = {
  tmp: 'build/tmp',
  dist: 'build/dist',
  base: 'client',
  tpl: 'client/src/**/*.tpl.html',
  mainScss: 'client/src/scss/main.scss',
  scss: 'client/src/scss/**/*.scss',
  jshint: [
    'client/src/**/*.js',
    '!client/bower_components/**/*.js',
    'client/test/unit/**/*.js',
    'client/test/e2e/**/*.js'
  ],
  index: 'client/index.html',
  assets: 'client/assets/**',
  images: 'client/assets/images/**/*'
};
