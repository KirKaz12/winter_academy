var gulp         = require('gulp'),
    sass = require('gulp-sass'),
    plumber      = require('gulp-plumber'),
    gutil        = require('gulp-util'), 
    // Подключаем библиотеку для автоматического добавления префиксов 
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'),
    jade         = require('gulp-jade');

//=========== Tasks
// Jade
gulp.task('jade', function() {
    return gulp.src(['source/views/index.jade',
                    'source/views/svgsprite.jade'])
	    .pipe(plumber(function (error) {
                gutil.log(error.message); //Продолжаем watch после ошибки
                this.emit('end');
        }))
        .pipe(jade({pretty: true})) 
        .pipe(gulp.dest('public')) 
});
//Перезагрузка после изменения  .jade
gulp.task('jade-watch', ['jade'], browserSync.reload);


gulp.task('sass', function () {
  return gulp.src('source/styles/common.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/styles/common.css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('source/styles/*.sass', ['sass'], browserSync.reload)
});

//gulp.task('sass:watch', ['sass'], browserSync.reload);


// Создаем таск browser-sync
gulp.task('browser-sync', function() { 
    browserSync({
       proxy: 'wa.sl' //Домен OpenServer
       // или baseDir: 'app' // Директория для сервера - app
    });
});

//Набюлдаем за изменениями файлов
gulp.task('watch', ['browser-sync', 'jade', 'sass'], function() {
    gulp.watch('./source/**/*.sass', ['sass:watch']);
    gulp.watch('./source/**/*.jade', ['jade-watch']);
    gulp.watch('source/*.html').on('change', browserSync.reload);
    gulp.watch('source/js/**/*.js').on('change', browserSync.reload); 
});

// Вызываем gulp по дефолту
gulp.task('default', ['watch']);