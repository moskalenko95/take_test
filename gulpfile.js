var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var autoprefixer= require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var imageminPngquant = require('imagemin-pngquant');
var debug = require('gulp-debug');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var minify = require('gulp-babel-minify');
// var minify = require('gulp-minify');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("js/*.js", ['babel'])
    // gulp.watch("scss/base/*.scss", ['sass']);
    // gulp.watch("scss/components/*.scss", ['sass']);
    // gulp.watch("scss/layout/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("js/*.js").on('change', browserSync.reload);
});

// gulp.task('compress', function() {
//   gulp.src('dist/js/*.js')
//     .pipe(minify({
//         ext:{
//             src:'-debug.js',
//             min:'.js'
//         },
//         exclude: ['tasks'],
//         ignoreFiles: ['.combo.js', '-min.js', '-debug.js']
//     }))
//     .pipe(gulp.dest('dist/js'))
// });

gulp.task('babel', () => {
    return gulp.src('js/*')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js'))
        // .pipe(minify({}))
        // .pipe(gulp.dest('dist/js'))
});
gulp.task('min', function() {
  return gulp.src('dist/js/*.js')
    .pipe(minify({}))
    .pipe(gulp.dest('dist/js'));
})
// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("scss/**/*.scss")
        .pipe(sass())
        .pipe(autoprefixer({browsers: ['last 8 version', '> 2%', 'firefox 15', 'safari 5', 'ie 6', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}))
        .pipe(gulp.dest("css"))
        // .pipe(cssmin())
        // .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

gulp.task('images', () =>
    gulp.src('img/*')
        .pipe(imagemin({
          interlaced: true,
          progressive: true,
          optimizationLevel: 10,
          svgoPlugins: [{removeViewBox: true}]
          }))
        .pipe(gulp.dest('dist/images'))
);

// Таск для оптимизации изображений
gulp.task('img:prod', function () {
  return gulp.src('img/*') //Выберем наши картинки
    .pipe(debug({title: 'building img:', showFiles: true}))
    .pipe(plumber())
    .pipe(gulp.dest('dist/img')) //Копируем изображения заранее, imagemin может пропустить парочку )
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imageminJpegRecompress({
        progressive: true,
        max: 80,
        min: 70
      }),
      imageminPngquant({quality: '80'}),
      imagemin.svgo({plugins: [{removeViewBox: true}]})
    ]))
    .pipe(gulp.dest('dist/img')); //И бросим в prod отпимизированные изображения
});

gulp.task('default', ['serve']);
