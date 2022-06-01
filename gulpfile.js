const 
	gulp = require("gulp"),
	M = {
		// fs           : require("fs"),
		browserSync  : require("browser-sync").create(),
		del          : require("del"),
		sass         : require("gulp-sass")(require('sass')),
		autoprefixer : require("gulp-autoprefixer"),
		sourcemaps   : require("gulp-sourcemaps"),
		rename       : require("gulp-rename"),
		incl         : require("gulp-h-include"),
	};

const
	SRC      = "src/",
	DST      = "build/",
	HTML_DST = "./";

module.exports = {
	html,
	css,
	images,
	fonts,
	watch,
	clean,
	build,
	default: defTask,
}

function defTask(cb) {
	return gulp.series(
		clean, 
		build, 
		gulp.parallel(watch, initBrowserSync),
	)(cb);
}

function build(cb) {
	return gulp.parallel(html, css, images, fonts)(cb);
}

function initBrowserSync() {
	M.browserSync.init({
		server: {
			baseDir: `./`+HTML_DST,
			port:    3000,
			notify:  false
		}
	});
}

function html() {
	return gulp.src(
		[SRC+"/html/**/*.html", "!"+SRC+"**/_*.html"], 
		{base: SRC+"/html"}
	)
		.pipe(M.incl())
		.pipe(gulp.dest(HTML_DST+""))
		.pipe(M.browserSync.stream());
}

function css() {
	return gulp.src(SRC+"scss/style.scss", {"allowEmpty": true})
		.pipe(M.sourcemaps.init())
		.pipe(
			M.sass({
				outputstyle: "extended"
			})
		)
		.pipe(
			M.autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(M.sourcemaps.write())
		.pipe(gulp.dest(DST+"css/"))
		.pipe(M.browserSync.stream());
}

function images() {
	return gulp.src(SRC+"img/**/*.{jpg,png,svg,ico,M.webp}")
		.pipe(gulp.dest(DST+"img/"))
		.pipe(gulp.src(SRC+"img/**/*.{jpg,png,svg,ico,M.webp}"))
		.pipe(gulp.dest(DST+"img/"))
		.pipe(M.browserSync.stream());
}

function fonts() {
	return gulp.src(SRC+"fonts/**/*.{ttf,eot,otf,woff,woff2,svg,svgs}")
		.pipe(gulp.dest(DST+"fonts/"));
}

function watch() {
	gulp.watch([SRC+"**/*.html"   ], html  );
	gulp.watch([SRC+"scss/**/*.*" ], css   );
	// gulp.watch([SRC+"js/**/*.js"  ], js    );
	gulp.watch([SRC+"img/**/*.*"  ], images);
	gulp.watch([SRC+"fonts/**/*.*"], fonts );
}

function clean () {
	return Promise.allSettled([
		M.del(DST+"css/"),
		M.del(DST+"fonts/"),
		M.del(DST+"img/"),
		M.del(HTML_DST+"*.html"),
	]);
}


// npm i -D browser-sync del gulp gulp-sass sass gulp-autoprefixer gulp-sourcemaps gulp-rename http://github.com/bognaum/gulp-h-include