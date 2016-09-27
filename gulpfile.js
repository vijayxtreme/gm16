const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync')
const uglify = require('gulp-uglify')
const pump = require('pump')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const clean = require('gulp-clean')

gulp.task('sass', function(){
	gulp.src('sass/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest('./public/css/'))
})

gulp.task('concat', function() {
  return gulp.src('./public/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('uglify', function(cb){
	pump([
        gulp.src('./public/js/all.js'),
        uglify(),
        rename('all.min.js'),
        gulp.dest('./public/js/')
    ],
    cb)
})
gulp.task('clean', function () {
  return gulp.src('./public/js/dist/all.*', {read: false})
    .pipe(clean());
});

gulp.task("scripts", ['clean'], function() {

    var concatted = gulp.src(['./public/js/*.js'])
                        .pipe(concat('all.js'));

    concatted.pipe(gulp.dest('./public/js/dist/'));

    concatted.pipe(uglify())
             .pipe(rename('all.min.js'))
             .pipe(gulp.dest('./public/js/dist/'));

});


gulp.task('serve', ['sass', 'scripts'], function(){
	browserSync.init({
        server: {
            baseDir: "./public/"
        }
    });
    gulp.watch('./sass/*.scss', ['sass']);
    gulp.watch('./public/js/*.js', ['scripts']);
    gulp.watch('./public/css/style.css').on('change', browserSync.reload);
    gulp.watch('./public/*.html').on('change', browserSync.reload);
})

gulp.task('default', ['serve'])