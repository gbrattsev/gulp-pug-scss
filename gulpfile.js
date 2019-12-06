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
    clean = require('gulp-clean'),
    rigger = require('gulp-rigger'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require('browser-sync').create(),
    watch = require('gulp-watch'),
    reload = browserSync.reload;

var config = {
  server: {
    baseDir: "./build"
},
tunnel: true,
host: 'localhost',
port: 9000,
logPrefix: "G_BRAT"
}


var path = {
  src: {
    pug: 'src/views/*.pug',
    scss: 'src/scss/*.scss',
    js: 'src/js/*.js',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  build: {
    html: 'build/',
    css: 'build/css/',
    js: 'build/js/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  },
  watch: {
    pug: 'src/views/**/*.pug',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean:  './build'
}

// CLEAN
gulp.task('clean', ()=>{
  return gulp.src(path.clean, {read: false})
    .pipe(clean())
})

// PUG
gulp.task('pug', ()=>{
  return gulp.src(path.src.pug)
    .pipe(plumber({
      errorHandler: notify.onError()
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}))
});

//STYLE-DEV
gulp.task('scss',()=>{
  return gulp.src(path.src.scss)
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
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}))
})
//STYLE-PROD
gulp.task('scss-prod',()=>{
  return gulp.src(path.src.scss)
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
    .pipe(gulp.dest(path.build.css))
})

//JS-DEV
gulp.task('js', ()=>{
  return gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}))
})

//JS-PROD
gulp.task('js-prod', ()=>{
  return gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.build.js))
})

// FONTS
gulp.task('fonts', ()=>{
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(reload({stream: true}))
})

// IMG
gulp.task('img',()=>{
  return gulp.src(path.src.img)
   .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()],
    interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}))
})

gulp.task('build', gulp.series('pug', 'scss', 'js', 'fonts', 'img'))

// WATCH
gulp.task('watch',()=>{
  gulp.watch(path.watch.pug, gulp.parallel('pug'))
  gulp.watch(path.watch.scss, gulp.parallel('scss'))
  gulp.watch(path.watch.js, gulp.parallel('js'))
  gulp.watch(path.watch.fonts, gulp.parallel('fonts'))
  gulp.watch(path.watch.img, gulp.parallel('img'))
})

// SERVER
gulp.task('server',()=>{
  browserSync.init(config)
})

//PRODUCTION
gulp.task('prod', gulp.series('clean', 'pug', 'scss-prod', 'js-prod', 'fonts', 'img'))

// DEFAULT
gulp.task('default', gulp.series('build', gulp.parallel('server', 'watch')))