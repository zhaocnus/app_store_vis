/* jshint camelcase:false */

'use strict';

var config = require('./build/build.config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');

// optimize images and put them in the dist folder
/*
gulp.task('images', function() {
  return gulp.src(config.images)
    .pipe($.imagemin({
      progressive: true,
      interlaced: tru
    }))
    .pipe(gulp.dest(config.dist + '/assets/images'))
    .pipe($.size({
      title: 'images'
    }));
});
*/

//build files for development
gulp.task('build', ['clean:tmp'], function(cb) {
  runSequence(['sass', 'templates'], cb);
});

gulp.task('clean:tmp', del.bind(null, [config.tmp]));

//generate angular templates using html2js
gulp.task('templates', function() {
  return gulp.src(config.tpl)
    .pipe($.html2js({
      outputModuleName: 'templates',
      base: 'client',
      useStrict: true
    }))
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest(config.tmp))
    .pipe($.size({
      title: 'templates'
    }));
});

//generate css files from scss sources
gulp.task('sass', function() {
  return gulp.src([
      config.mainScss
    ])
    .pipe($.sass())
    .on('error', $.sass.logError)
    .pipe(gulp.dest(config.tmp))
    .pipe($.size({
      title: 'sass'
    }));
});

//build files for creating a dist release
// gulp.task('build:dist', ['clean'], function(cb) {
//   runSequence(
//     'jshint',
//     [
//       'build',
//       'copy',
//       'images'
//     ],
//     'html',
//     cb);
// });

//build files for development
// gulp.task('build', ['clean:tmp'], function(cb) {
//   runSequence(['createGlobals', 'sass', 'templates'], cb);
// });

// generate a minified css files, 2 js file, change
// their name to be unique, and generate sourcemaps
// gulp.task('html', function() {
//   var assets = $.useref.assets({
//     searchPath: '{build,client}'
//   });

//   return gulp.src(config.index)
//     .pipe(assets)
//     .pipe($.sourcemaps.init())
//     .pipe($.if('**/*main.js', $.ngAnnotate()))
//     .pipe($.if('*.js', $.uglify({
//       mangle: false,
//     })))
//     .pipe($.if('*.css', $.csso()))
//     .pipe($.if(['**/*main.js', '**/*main.css'], $.header(config.banner, {
//       pkg: pkg
//     })))
//     .pipe($.rev())
//     .pipe(assets.restore())
//     .pipe($.useref())
//     .pipe($.revReplace())
//     .pipe($.if('*.html', $.minifyHtml({
//       empty: true
//     })))
//     .pipe($.sourcemaps.write())
//     .pipe(gulp.dest(config.dist))
//     .pipe($.size({
//       title: 'html'
//     }));
// });

//copy assets in dist folder
/*
gulp.task('copy', function() {
  return gulp.src([
      config.base + '/*',
      '!' + config.base + '/json',
      '!' + config.base + '/projects',
      '!' + config.base + '/additional',
      '!' + config.base + '/*.html',
      '!' + config.base + '/src',
      '!' + config.base + '/test'
    ])
    .pipe(gulp.dest(config.dist))
    .pipe($.size({
      title: 'copy'
    }));
});
*/

gulp.task('nodemon', function (done) {
  $.nodemon({
    script: 'server.js',
    ignore: ['/**/tmp/**/*', 'tmp', 'data_processing'],
    env: { 'NODE_ENV': 'development' }
  })
  .on('restart');
});

//lint files
gulp.task('jshint', function() {
  return gulp.src(config.jshint)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

// Default task(s).
gulp.task('serve', function (done) {
  process.env.NODE_ENV = 'development';
  runSequence('jshint', 'build', ['nodemon', 'watch'], done);
});

//run the server after having built generated files, and watch for changes
gulp.task('watch', ['build'], function() {
  gulp.watch(config.scss, ['sass']);
  gulp.watch(config.jshint, ['jshint']);
  gulp.watch(config.tpl, ['templates']);
});
