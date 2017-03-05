import gulp from 'gulp';
import eslint from 'gulp-eslint';
import plumber from 'gulp-plumber';
import minify from 'gulp-minify-css';
import sass from 'gulp-sass';
import { join } from 'path';

const baseDir = relativeToBaseDir =>
    join(__dirname, '../', relativeToBaseDir);

gulp.task('lint', () => {
    return gulp.src([
            baseDir('./server/**/*.js'),
            baseDir('./browser/**/*.js')
        ])
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('css', () => {

    var sassCompilation = sass();
    sassCompilation.on('error', console.error.bind(console));

    return gulp.src(baseDir('./browser/styles/main.scss'))
        .pipe(plumber())
        .pipe(sassCompilation)
        .pipe(minify())
        .pipe(gulp.dest(baseDir('./public')));
});