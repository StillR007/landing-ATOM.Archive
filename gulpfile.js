'use strict';
/* npm i -D gulp del gulp-file-include browser-sync gulp-sass sass gulp-autoprefixer gulp-group-css-media-queries gulp-clean-css gulp-rename gulp-uglify-es gulp-imagemin gulp-webp gulp-webp-html gulp-htmlmin */
const project_folder = "dist";
const source_folder = "src";

/* import imagemin from "gulp-imagemin" */

const { src, dest } = require('gulp'),
	gulp = require('gulp'),
	del = require('del'),
	fileinclude = require('gulp-file-include'),
	browsersync = require("browser-sync").create(),
	scss = require("gulp-sass")(require("sass")),
	autoprefixer = require("gulp-autoprefixer"),
	group_media = require("gulp-group-css-media-queries"),
	clean_css = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify-es").default,
	/* imagemin = require("gulp-imagemin"),
	webp = require("gulp-webp"),
	webphtml = require("gulp-webp-html"), */
	htmlmin = require('gulp-htmlmin');


const path = {
	build: {
		Html: project_folder + "/",
		Css: project_folder + "/css/",
		CssDep: project_folder + "/css/",
		Js: project_folder + "/js/",
		JsDep: project_folder + "/js/",


		fonts: project_folder + "/fonts/",
		img: project_folder + "/img/",
		video: project_folder + "/video/",
	},
	src: {
		Html: source_folder + "/*.html",
		Css: [source_folder + "/scss/*.scss", "!" + source_folder + "/scss/start*.scss"],
		CssDep: source_folder + "/scss/*.min.css",
		Js: [source_folder + "/js/*.js", "!" + source_folder + "/js/*.min.js"],
		JsDep: source_folder + "/js/*.min.js",

		fonts: source_folder + "/fonts/*.{otf,ttf,woff,woff2}",
		img: source_folder + "/img/**/*.{jpg,png,ico,gif}",
		video: source_folder + "/video/*.{mp4,webm}",
	},
	watch: {
		Css: source_folder + "/scss/*.scss",
		Js: source_folder + "/js/*.js",
		Html: source_folder + "/*.html",

		img: source_folder + "/img/**/*.{jpg,png,ico,gif}",
		video: source_folder + "/video/*.{mp4,webm}",
	},
	clean: "./" + project_folder + "/"
};

function clean() {
	return del(path.clean);
}
function browserSync() {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/",
		},
		port: 3000,
	});
}


function images() {
	return src(path.src.img)
		/* 		.pipe(
					webp({
						quality: 100 // 0 to 100
					})
				) */
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		/* 		.pipe(
					imagemin({
						progressive: true,
						svgoPlugins: [{ removeViewBox: false }],
						interlaced: true,
						optimizationLevel: 0 // 0 to 7
					})
				) */
		/* 		.pipe(dest(path.build.img)) */
		.pipe(browsersync.stream());
}

function fonts() {
	return src(path.src.fonts)
		.pipe(dest(path.build.fonts))
		.pipe(src(path.src.fonts))
		.pipe(browsersync.stream());
}

function Html() {
	return src(path.src.Html)
		.pipe(fileinclude())
		.pipe(dest(path.build.Html))

		/* Минификация html */
		.pipe(htmlmin({
			collapseWhitespace: true, // удаляем все переносы
			removeComments: true // удаляем все комментарии
		}))
		.pipe(
			rename({
				extname: ".min.html"
			})
		)
		.pipe(dest(path.build.Html))
		/* Минификация html */

		.pipe(browsersync.stream());
}


function Css() {
	return src(path.src.Css)
		.pipe(
			scss({
				outputStyle: "expanded"
			})
		)
		.pipe(
			group_media()
		)

		/* Минификация css */
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 10 versions"],
				cascade: true
			})
		)
		.pipe(dest(path.build.Css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.Css))
		/* Минификация css */

		.pipe(browsersync.stream());
}

function CssDep() {
	return src(path.src.CssDep)
		.pipe(dest(path.build.CssDep))
		.pipe(src(path.src.CssDep))
		.pipe(browsersync.stream());
}


function Js() {
	return src(path.src.Js)


		.pipe(fileinclude())

		.pipe(dest(path.build.Js))

		/* Минификация js */
		.pipe(
			uglify()
		)
		/* .pipe(AlreadyMinified) */
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		/* .pipe(AlreadyMinified.restore) */
		.pipe(dest(path.build.Js))
		/* Минификация js */

		.pipe(browsersync.stream());
}

function JsDep() {
	return src(path.src.JsDep)
		.pipe(dest(path.build.JsDep))
		.pipe(src(path.src.JsDep))
		.pipe(browsersync.stream());
}


function watchFiles(params) {
	gulp.watch([path.watch.Html], Html),
		gulp.watch([path.watch.Css], Css),
		gulp.watch([path.watch.Js], Js),
		gulp.watch([path.watch.img], images),
		params()
}

let build = gulp.series(clean, gulp.parallel(Html, Css, Js,
	images, JsDep, CssDep, fonts
));
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = watch;