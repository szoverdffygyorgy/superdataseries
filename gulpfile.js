var gulp = require("gulp");
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");
var stylish = require("gulp-jscs-stylish");
var jsonlint = require("gulp-jsonlint");
var jasmine = require("gulp-jasmine");
var browserify = require("browserify");
var partialify = require("partialify");
var source = require("vinyl-source-stream");

var jsFiles = [
	"./**/*.js",
	"!node_modules/**/*",
	"!./**/*.built.js"
];

var jsonFiles = [
	".jshintrc",
	".jscsrc"
];

// JSON lint
// ==================================================
gulp.task("jsonlint", function() {
	return gulp.src(jsonFiles)
		.pipe(jsonlint())
		.pipe(jsonlint.failOnError());
});


// JS Hint
// ==================================================
gulp.task("jshint", function() {
	return gulp.src(jsFiles)
		.pipe(jshint(".jshintrc"))
		.pipe(jshint.reporter("jshint-stylish"))
		.pipe(jshint.reporter("fail"));
});


// JS CodeStyle
// ==================================================
gulp.task("jscs", function() {
	return gulp.src(jsFiles)
		.pipe(jscs({
			configPath: ".jscsrc",
			fix: true
		}))
		.pipe(stylish())
		.pipe(jscs.reporter("fail"));
});

gulp.task("test", ["jsonlint", "jshint", "jscs"]);

// JS Index.html
// ==================================================
gulp.task("js:dev", [/*"js:dummy",*/"js:prod"], createBrowserifyTask({
	entries: ["./examples/main.js"],
	outputFileName: "main.built.js",
	destFolder: "./examples/"
}));

// JS production
// ==================================================
gulp.task("js:prod", /*["jsonlint", "jscs"],*/ createBrowserifyTask({
	entries: ["./src/public/main.js"],
	outputFileName: "superdataseries.js",
	destFolder: "./dist/"
}));

gulp.task("js", /*["jsonlint", "jshint", "jscs"],*/ createBrowserifyTask({
	entries: ["./src/public/main.js"],
	outputFileName: "main.built.js",
	destFolder: "./src/public/"
}));

// Tests
// ==================================================
gulp.task("jasmine", function() {
	return gulp.src("src/public/**/*Spec.js")
		.pipe(jasmine({
			verbose: true
		}));
});

// Build example
// ==================================================
gulp.task("build:dev", ["js:dev"]);

function createBrowserifyTask(config) {
	return function() {
		var bundleMethod = browserify;//global.isWatching ? watchify : browserify;

		var bundler = bundleMethod({
			// Specify the entry point of your app
			debug: true,
			entries: config.entries,
			standalone: "superdataseries"
		});

		var bundle = function() {
			return bundler
				.transform(partialify)
				// Enable source maps!
				.bundle()
				// Use vinyl-source-stream to make the
				// stream gulp compatible. Specifiy the
				// desired output filename here.
				.pipe(source(config.outputFileName))
				// Specify the output destination
				.pipe(gulp.dest(config.destFolder));
		};

		return bundle();
	};
}
