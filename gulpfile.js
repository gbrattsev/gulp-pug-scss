'use strict';

var gulp = require('gulp'),
    pug = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    scss = require('gulp-sass'),
    cleanScss = require('gulp-clean-css'),
    groupMedia = require('gulp-group-css-media-queries'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean');

gulp.task('clean', ()=>{
  return gulp.src('build/')
    .pipe(clean())
    .pipe(gulp.dest('build/'))
})


// PUG
gulp.task('pug', ()=>{
  return gulp.src('src/views/*.pug')
    .pipe(plumber({
      errorHandler: notify.onError()
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build/'))
});

//STYLE-DEV
gulp.task('scss-dev',()=>{
  return gulp.src('src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: notify.onError()
    }))
    .pipe(scss())
    .pipe(groupMedia())
    .pipe(autoprefixer())
    .pipe(cleanScss({
      compatibility: 'ie8', level: {
        1: {
            specialComments: 0,
            removeEmpty: true,
            removeWhitespace: true
        },
        2: {
            mergeMedia: true,
            removeEmpty: true,
            removeDuplicateFontRules: true,
            removeDuplicateMediaBlocks: true,
            removeDuplicateRules: true,
            removeUnusedAtRules: false
        }
      }
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(plumber.stop())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css/'))
})
//STYLE-PROD
gulp.task('scss-prod',()=>{
  return gulp.src('src/scss/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError()
    }))
    .pipe(scss())
    .pipe(groupMedia())
    .pipe(autoprefixer())
    .pipe(cleanScss({
      compatibility: 'ie8', level: {
        1: {
            specialComments: 0,
            removeEmpty: true,
            removeWhitespace: true
        },
        2: {
            mergeMedia: true,
            removeEmpty: true,
            removeDuplicateFontRules: true,
            removeDuplicateMediaBlocks: true,
            removeDuplicateRules: true,
            removeUnusedAtRules: false
        }
      }
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest('build/css/'))
})