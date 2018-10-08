const gulp = require('gulp');
const gulpPlugins = require('gulp-load-plugins')();

const { sequence } = gulpPlugins;
const browserSync = require('browser-sync').create();

const pkg = require('./package.json');

const { reload } = browserSync;

// project
const project = { root: __dirname };

project.assets = `${project.root}/assets`;
project.dist = 'docs';
project.fonts = `${project.assets}/fonts`;
project.img = `${project.assets}/img`;
project.inc = `${project.root}/includes`;
project.js = `${project.assets}/js`;
project.lang = `${project.root}/languages`;
project.node = `${project.root}/node_modules`;
project.sass = `${project.assets}/sass`;
project.vendor = `${project.assets}/vendor`;

// Translation related.
const textDomain = pkg.name; // Your textdomain here.
const translationFile = 'WPGULP.pot'; // Name of the transalation file.
const translationDestination = project.lang; // Where to save the translation files.
const packageName = pkg.name; // Package name.
const bugReport = pkg.author.url; // Where can users report bugs.
const lastTranslator = `${pkg.author.url} <info@broadsoft.com>`; // Last translator Email ID.
const team = `${pkg.author.url} <info@broadsoft.com>`; // Team's Email ID.

const banner = `/*!
 * DO NOT OVERRIDE THIS FILE.
 * Generated with \`npm run build\`
 *
 * ${pkg.name} - ${pkg.description}
 * @version ${pkg.version}
 * @author ${pkg.author.name}
 * @link ${pkg.author.url}
 */

`;

// build
gulp.task('build', sequence('build:vendor', ['build:img', 'build:css', 'build:js', 'html']));

// img
gulp.task('build:img', () => {
	const { imagemin, size } = gulpPlugins;


return gulp
		.src(`${project.img}/**/*.{png,jpg,jpeg,gif,svg}`)
		.pipe(imagemin())
		.pipe(
			size({
				showFiles: true,
				title: 'imagemin',
			})
		)
		.pipe(gulp.dest(`${project.img}`));
});

// css
gulp.task('build:css', () => {
	const {
		autoprefixer,
		csso,
		filter,
		header,
		mergeMediaQueries,
		notify,
		plumber,
		rename,
		sass,
		sassGlob,
		size,
		sourcemaps,
		util,
	} = gulpPlugins;
	const filterCSS = filter(['**/*.css'], { restore: true });
	const sync = () => (browserSync ? browserSync.stream({ match: '**/*.css' }) : util.noop());

	return (
		gulp
			.src([`${project.sass}/**/*.scss`, '!_*.scss'])
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(sassGlob())
			.pipe(
				sass({
					outputStyle: 'expanded',
				}).on('error', sass.logError)
			)
			.pipe(
				autoprefixer({
					browsers: ['last 2 versions', 'ie 11'],
				})
			)
			.pipe(header(banner))
			.pipe(
				size({
					showFiles: true,
					title: 'sass',
				})
			)
			.pipe(sourcemaps.write('.'))
			.on('error', util.log)
			.pipe(gulp.dest(project.dist))
			.pipe(sync())

			// minified version
			.pipe(filterCSS)
			.pipe(mergeMediaQueries({ log: true }))
			.pipe(rename({ suffix: '.min' }))
			// .pipe(csso())
			.on('error', util.log)
			.pipe(
				size({
					showFiles: true,
					title: 'sass',
				})
			)
			.pipe(sourcemaps.write('.'))
			.on('error', util.log)
			.pipe(filterCSS.restore)

			// create both files
			.pipe(gulp.dest(project.dist))
			.pipe(sync())
			.pipe(notify({ message: 'TASK: "styles" Completed! 💯', onLast: true }))
	);
});

// js
gulp.task('build:js', function() {
	const { plumber, sourcemaps, babel, uglify, rename } = gulpPlugins;


return gulp.src(`${project.js}/**/*.js`)
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(gulp.dest(`${project.dist}`))
			.pipe(rename('scripts.min.js'))
			.pipe(uglify())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(`${project.dist}`));
});

// vendor
gulp.task('build:vendor', ['build:vendor:copyFromNpm', 'build:vendor:modernizr']);

gulp.task('build:vendor:copyFromNpm', () => {
	const { size } = gulpPlugins;
	const npmFiles = Object.keys(pkg.dependencies).map(name => `${project.node}/${name}/**/*`);

	return gulp
		.src(npmFiles, { base: project.node })
		.pipe(size({ title: 'vendor' }))
		.pipe(gulp.dest(project.vendor));
});

gulp.task('build:vendor:modernizr', () => {
	const { babel, header, modernizr, rename, sourcemaps, uglify } = gulpPlugins;

	return (
		gulp
			.src([`${project.sass}/**/*.scss`, `${project.js}/**/*.js`])
			.pipe(
				modernizr({
					options: ['setClasses', 'addTest', 'html5printshiv', 'testProp', 'fnBind'],
				})
			)
			.pipe(gulp.dest(`${project.vendor}/modernizr`))

			// minified version
			.pipe(sourcemaps.init())
			.pipe(rename({ suffix: '.min' }))
			.pipe(babel({
				presets: ['env']
			}))
			.pipe(
				uglify({
					preserveComments: 'license',
				})
			)
			.pipe(header(banner))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(`${project.vendor}/modernizr`))
	);
});

gulp.task('translate', () => {
	const { notify, sort, wpPot } = gulpPlugins;

	gulp
		.src(`${project.root}/**/*.php`)
		.pipe(sort())
		.pipe(
			wpPot({
				domain: textDomain,
				package: packageName,
				bugReport,
				lastTranslator,
				team,
			})
		)
		.pipe(gulp.dest(`${translationDestination}/${translationFile}`))
		.pipe(notify({ message: 'TASK: "translate" Completed! 💯', onLast: true }));
});


gulp.task('html', () => {
	const { htmlmin } = gulpPlugins;

	gulp
		.src(`${project.root}/*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest(`${project.dist}`));
});

// watch
gulp.task('watch', () => {
	// browserSync.init({
	// 	// Project URL.
	// 	proxy: 'http://localhost:8888/',
	// 	open: true,
	// 	// Use a specific port (instead of the one auto-detected by Browsersync).
	// 	// port: 7000,
	// });

	browserSync.init({
		server: {
			baseDir: `${project.root}/docs`
		},
	});
	gulp.watch(`${project.root}/*.html`, ['html', reload]);
	gulp.watch(`${project.sass}/**/*.scss`, ['build:css']);
	gulp.watch(`${project.js}/**/*.js`, ['build:js', reload]);
	gulp.watch(`${project.root}/**/*.php`).on('change', reload);
	gulp.watch(`${project.img}/**/*.{png,jpg,jpeg,gif,svg}`).on('change', reload);
});
