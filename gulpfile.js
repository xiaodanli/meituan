var gulp = require('gulp');

var server = require('gulp-webserver');

var sass = require('gulp-sass');

var minCss = require('gulp-clean-css');



var uglify = require('gulp-uglify');

var fs = require('fs');

var url = require('url');

var path = require('path');

//开发环境 ----起服务
gulp.task('devServer', function() {
    return gulp.src('src')
        .pipe(server({
            port: 9090,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    res.end('');

                    return
                }

                if (pathname === '/api/swiper') {

                } else {
                    pathname = pathname === '/' ? '/index.html' : pathname;

                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
})

//开发环境--- css
gulp.task('devCss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest('./src/css'))
})

//监听sass
gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.parallel('devCss'))
})

//开发环境
gulp.task('dev', gulp.series('devCss', 'devServer', 'watch'))

//线上环境  ---- 打包

gulp.task('buildUglify', function() {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
})

gulp.task('buildCss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest('./build/css'))
})

gulp.task('copyLibs', function() {
    return gulp.src('./src/js/libs/*.js')
        .pipe(gulp.dest('build/js/libs'))
})

gulp.task('copyHtml', function() {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('build'))
})

gulp.task('copyImgs', function() {
    return gulp.src('./src/imgs/*')
        .pipe(gulp.dest('build/imgs'))
})

//线上环境
gulp.task('build', gulp.series('buildUglify', 'buildCss', 'copyLibs', 'copyHtml', 'copyImgs'))