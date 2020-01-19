const { src, dest, watch, series, parallel } = require('gulp');
// gulp cleaner
const del = require('del');
const rimraf = require('rimraf');
// browser Sync
const browserSync = require('browser-sync');
// mod. files (min, rename)
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const rigger = require('gulp-rigger');
// styles
const sass = require('gulp-sass');
const mincss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
// scripts
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
// html
const pug = require('gulp-pug');
const htmlBeautify = require('gulp-html-beautify');
const pretty = require('pretty');
const htmlPrettify = require('gulp-html-prettify');


const htmlBeautifyOptions = {
    indentSize: 2,
    unformatted: [
        'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite',
        'code', 'data', 'datalist', 'del', 'dfn', 'em', 
        'embed', 'i', 'ins', 'kbd', 'keygen', 'map',
        'mark', 'math', 'meter', 'noscript', 'object', 
        'output', 'progress', 'q', 'ruby', 's', 'samp', 
        'small', 'strong', 'sub', 'sup', 'template', 
        'time', 'u', 'var', 'wbr', 'text', 'acronym', 
        'address', 'big', 'dt', 'ins', 'strike', 'tt'
    ]
};

const paths = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        style: 'dist/styles/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        style: 'src/styles/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/styles/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './dist/'
};

const serverConfig = {
    server: {
        baseDir: './dist'
    },
    host: 'localhost',
    port: 9000,
};

function html() {
    return src(paths.src.html)
        .pipe(rigger())
        .pipe(dest(paths.dist.html))
        .pipe(browserSync.stream());
}

function scripts() {
    return src(paths.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(dest(paths.dist.js))
        .pipe(browserSync.stream());
}

function styles() {
    return src(paths.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            cascade: false,
            grid: true
        }))
        .pipe(mincss({}))
        .pipe(sourcemaps.write())
        .pipe(dest(paths.dist.style))
        .pipe(browserSync.stream());
}

function image() {
    return src(paths.src.img)
        .pipe(dest(paths.dist.img))
        .pipe(browserSync.stream());
};

function fonts() {
    return src(paths.src.fonts)
        .pipe(dest(paths.dist.fonts))
        .pipe(browserSync.stream());
}; 

function clean() {
    return del(paths.clean);
}

function watchFiles() {
    watch(paths.watch.html, html);
    watch(paths.watch.style, styles);
    watch(paths.watch.js, scripts);
    watch(paths.watch.img, image);
    watch(paths.watch.fonts, fonts);
}

function serve() {
    browserSync.init(serverConfig);    
}

exports.html = html;
exports.scripts = scripts;
exports.styles = styles;
exports.image = image;
exports.fonts = fonts;

exports.clean = clean;

exports.build = series(clean, html, styles, scripts);
exports.default = series(clean, html, styles, scripts, parallel(serve, watchFiles));