'use strict';

var fs = require('fs');

var browserify = require('browserify');
var babelify = require('babelify');
var reactify = require('reactify');

var source = require('vinyl-source-stream');
require('harmonize')();

var gulp = require('gulp');
var jest = require('jest-cli');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');

// Notifier for browserify
var errorHandler = function (title) {
    return function () {
        notify.onError({
            title: title, 
            message: '<%= error %>'
        }).apply(this, arguments);

        this.emit('end');
    };
};

// Compile scripts from jsx
gulp.task('jsx:started', function () {
    //return gulp.src('.').pipe(notify({title: 'Task jsx', message: 'Started' }));
});
gulp.task('jsx:browserify', ['jsx:started'], function () {
    return browserify({
            entries: ['jsx/index.js'],
            //extensions: ['.jsx'],
            debug: true,
            transform: [babelify, reactify]
        }).bundle()
        .on('error', errorHandler('Browserify Error'))
        .pipe(source('script.js'))
        .pipe(gulp.dest('.')) ;
});
//gulp.task('jsx:uglify', ['jsx:browserify'], function () {
//    return gulp.src('script.js')
//        .pipe(sourcemaps.init())
//        .pipe(uglify())
//        .pipe(rename({
//            extname: '.min.js'
//        }))
//        .pipe(sourcemaps.write('.'))
//        .pipe(gulp.dest('.'));
//});
gulp.task('jsx:copy', ['jsx:browserify'], function () {
    return gulp.src('script.*')
        .pipe(gulp.dest('public'));
});
gulp.task('jsx:finished', ['jsx:copy'], function () {
    return gulp.src('.').pipe(notify({title: 'Task jsx', message: 'Finished' }));
});
gulp.task('jsx', ['jsx:finished']);

// Compile styles from less
gulp.task('less', function () {
    console.log('ToDo');
});

// Test with Jest
gulp.task('jest:started', function () {
    //return gulp.src('.').pipe(notify({title: 'Task jest', message: 'Started' }));
});
gulp.task('jest:jest', ['jest:started'], function (cb) {
    return jest.runCLI({}, __dirname, function (succeeded) {
            if (!succeeded) {
                return cb('Failed');
            }
            return cb();
        });
});
gulp.task('jest:finished', ['jest:jest'], function () {
    return gulp.src('.').pipe(notify({title: 'Task jest', message: 'Finished' }));
});
gulp.task('jest', ['jest:finished']);

// Web server with live reloading
gulp.task('server', function () {
    return gulp.src('public')
        .pipe(webserver({
            livereload: true,
            directoryListening: true,
            open: true,
            middleware: function (req, res, next) {
                if (req.url.match(/^\/resource\/character\/[^\/]+/)) {
                    var path = req.url.replace(/^\/resource\/character\/[^\/]+/, 'test') + '.json';
                    fs.readFile(path, function (err, data) {
                        if (err) {
                            res.writeHead(500);
                            //res.end(err);
                            console.dir(err);
                            res.end();
                        } else {
                            res.setHeader('content-type', 'application/json; charset=UTF-8');
                            res.end(data);
                        }
                    });
                } else {
                    return next();
                }
            }
        }));
});

// Watch and auto compile
gulp.task('watch:jsx', function () {
    gulp.watch('jsx/**/*.jsx', ['jsx']);
    gulp.watch('jsx/**/*.js', ['jsx']);
});
gulp.task('watch:less', function () {
    gulp.watch('less/**/*.less', ['less']);
});
gulp.task('watch:jest', function () {
    gulp.watch('jsx/**/*.jsx', ['jest']);
    gulp.watch('jsx/**/*.js', ['jest']);
    gulp.watch('test/**/*.js', ['jest']);
});
gulp.task('watch', ['watch:jsx', 'watch:less', 'watch:jest']);

// Test Driven Development
gulp.task('tdd', ['server', 'watch']);

gulp.task('build', ['jsx', 'less']);
gulp.task('test', ['build', 'jest']);

// Default
gulp.task('default', ['jsx', 'less']);
