/**
 * Created by Nguyen Cong Huy on 9/30/2015.
 */

// Requires the gulp and gulp-sass plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concatCss = require('gulp-concat-css'),
    sourcemap = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),

    sassSource = 'scss/custom.scss',
    cssDest = 'css',
    imageFiles = 'images/**/*.+(png|jpg|gif)',
    imageDest = 'images',
    svgFiles = 'svg/**/*.svg',
    svgDest = 'svg';

// Create task for browser sync
gulp.task('browserSync', function() {
    browserSync({
        proxy: 'http://localhost/chichchich/'
    })
});

// Create task for compile sass to css
gulp.task('sass', function() {
    return gulp.src(sassSource)
        .pipe(sourcemap.init())
        .pipe(sass({
            sourceComments: 'map',
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(concatCss('custom.css'))
        .pipe(sourcemap.write())
        .pipe(gulp.dest(cssDest))
        .pipe(browserSync.stream({
            match: '**/*.css'
        }))
});

// Create task for optimize images
gulp.task('images', function() {
    return gulp.src(imageFiles)
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            verbose: true
        }))
        .pipe(gulp.dest(imageDest))
});

// Create task for optimize svg
gulp.task('svg', function() {
    return gulp.src(svgFiles)
        .pipe(imagemin({
            svgoPlugins: [
                {
                    removeViewBox: true
                }
            ],
            verbose: true
        }))
        .pipe(gulp.dest(svgDest))
});

// Create task for watch changes
gulp.task('watch', ['sass'], function() {
    // Watch changes of files
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('js/**/*.js', browserSync.reload);
    gulp.watch('**/*.php', browserSync.reload);
});

// Create task for optimize images
gulp.task('optimize', ['images', 'svg']);

// Default task for gulp
gulp.task('default', ['sass', 'watch']);
