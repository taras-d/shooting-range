var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('dist', function() {
    return gulp.src([
            'shooter/game.js',
            'shooter/battle.js',
            'shooter/gun.js',
            'shooter/bullet.js',
            'shooter/enemy.js',
            'shooter/stats.js'
        ])
        .pipe(concat('shooter.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});