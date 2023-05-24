import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import rename from "gulp-rename";

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

export const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

//Images

export const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

export const copyImages = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(gulp.dest("build/img"));
};


//WebP

export const createWebP = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(squoosh({webp:{}}))
    .pipe(gulp.dest("build/img"));
}

//SVG

export const sprite = () => {
  return gulp.src('source/img/sprite-img/*.svg')
    .pipe(svgo())
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
 }

//Copy

export const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/img/favicons/*.{ico,png,xml}',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
 }

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

//Defoult

export default gulp.series(
  optimizeImages,
  sprite,
  createWebP,
  html,
  styles,
  copy,
  server,
  watcher,
  copyImages,
);
