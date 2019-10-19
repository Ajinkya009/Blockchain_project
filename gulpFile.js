'use strict';

//grab the packages
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const nodemon = require('gulp-nodemon');


//define input paths
var input = {
  'javascript': './**/*.js'
};

//configure jshint tasks
function jsHint(){
  return gulp.src(input.javascript)
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
};

//configure which files to watch and what tasks to use on file changes
function watch(){
  gulp.watch('./**/*.js',['jshint']);
};

function start(done){
  nodemon({
    script: 'index.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  , done: done
  })
};

exports.watch = watch;

// define the default task and add the watch task to it
exports.default = gulp.series(watch,jsHint,start);
