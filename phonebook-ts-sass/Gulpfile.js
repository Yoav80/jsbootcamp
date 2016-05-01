
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('mainSass', function () {
    return gulp.src('./public/sass/PB-styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('components', function () {
    return gulp.src('./public/components/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/components'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./public/components/*.scss', ['components']);
    gulp.watch('./public/sass/PB-styles.scss', ['mainSass']);
});


//var gulp = require('gulp');
//var sass = require('gulp-sass');
//var ts = require('gulp-typescript');
////var flatten = require('gulp-flgatten');
//
//gulp.task('sass', function(){
//    return gulp.src('./public/stylesheets/PH-styles.scss')
//        .pipe(sass()) // Using gulp-sass
//        .pipe(gulp.dest('./public/stylesheets/'))
//});
//
//gulp.task('main-styles', function() {
//    console.log("main-styles");
//    gulp.src('./public/stylesheets/*.scss')
//        .pipe(sass())
//        .pipe(gulp.dest('./public/stylesheets/*'))
//});
////
////gulp.task('compile-dev', function() {
////    gulp.src('./public/components/**/*.ts')
////        .pipe(ts())                    //compile them
////        .pipe(flatten())                //change their relative path to point to one dir
////        .pipe(gulp.dest('./public/components'));      //write them in destination
////});
//
//gulp.task('ts', function () {
//    return gulp.src('./clientApp/src/**/*.ts')
//        .pipe(ts({
//            noImplicitAny: true,
//            out: 'output.js'
//        }))
//        .pipe(gulp.dest('./public/components'));
//});
//
////Watch task
//gulp.task('default',function() {
//    console.log("watch");
//    gulp.watch('./public/stylesheets/*.scss',['main-styles']);
//});