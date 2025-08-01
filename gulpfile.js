import { create } from 'browser-sync';
import { deleteAsync, deleteSync } from 'del';
import { dest, parallel, series, src, watch } from 'gulp';
import beautify from 'gulp-beautify';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import pag from 'gulp-pug';
import gulpSass from 'gulp-sass';
import sprite from 'gulp-svg-sprite';
import sassEmbedded from 'sass-embedded';

/**
 * Tools setup
 *
 * 01.Server instance
 * 02.Sass plugin
 */

// 01.Server instance
const server = create();

// 02.Sass plugin
const sass = gulpSass(sassEmbedded);

/**
 * Configuration
 *
 * 01.Mode config
 * 02.Dirs config
 * 03.Paths config
 */

// 01.Mode config
const MODE = {
	dev: !process.argv.includes('--production'),
	prod: process.argv.includes('--production'),
};

// 02.Dirs config
const DIR = {
	src: './src',
	build: './dist',
	public: './public',
};

// 03.Paths config
const PATH = {
	pages: {
		src: `${DIR.src}/*.pug`,
		dist: `${DIR.build}`,
		watch: `${DIR.src}/**/*.pug`,
	},
	fonts: {
		src: `${DIR.src}/assets/fonts/**/*.*`,
		dist: `${DIR.build}/assets/fonts`,
		watch: `${DIR.src}/assets/fonts/**/*.*`,
	},
	icons: {
		src: `${DIR.src}/assets/icons/**/*.svg`,
		dist: `${DIR.build}/assets/icons`,
		watch: `${DIR.src}/assets/icons/**/*.svg`,
	},
	images: {
		src: `${DIR.src}/assets/images/**/*.*`,
		dist: `${DIR.build}/assets/images`,
		watch: `${DIR.src}/assets/images/**/*.*`,
	},
	media: {
		src: `${DIR.src}/assets/media/**/*.*`,
		dist: `${DIR.build}/assets/media`,
		watch: `${DIR.src}/assets/media/**/*.*`,
	},
	scripts: {
		src: `${DIR.src}/assets/scripts/*.js`,
		dist: `${DIR.build}/assets/scripts`,
		watch: `${DIR.src}/assets/scripts/**/*.js`,
	},
	styles: {
		src: `${DIR.src}/assets/styles/*.scss`,
		dist: `${DIR.build}/assets/styles`,
		watch: `${DIR.src}/assets/styles/**/*.scss`,
	},
	public: {
		src: `${DIR.public}/**/*.*`,
		dist: `${DIR.build}`,
	},
};

/**
 * Handle functions
 *
 * 01.Handle pages
 * 02.Handle icons
 * 03.Handle styles
 * 04.Handle scripts
 */

function handlePages() {
	return src(PATH.pages.src, { encoding: false, ignore: ['**/_*'] })
		.pipe(plumber())
		.pipe(pag({ pretty: true }))
		.pipe(
			beautify.html({
				indent_size: '4',
				indent_with_tabs: false,
				end_with_newline: false,
			}),
		)
		.pipe(dest(PATH.pages.dist))
		.pipe(server.stream());
}

function handleIcons() {
	const spriteMode = {
		symbol: {
			dest: '.',
			sprite: 'sprite.svg',
		},
	};

	const spriteShape = {
		transform: [
			{
				svgo: {
					plugins: [
						'preset-default',
						{
							name: 'removeAttrs',
							active: true,
							params: {
								attrs: '(fill|stroke|opacity|clip-rule)',
							},
						},
						{
							name: 'removeDimensions',
							active: true,
						},
						{
							name: 'removeViewBox',
							active: false,
						},
						{
							name: 'inlineStyles',
							active: true,
							params: {
								onlyMatchedOnce: false,
							},
						},
					],
				},
			},
		],
	};

	return src(PATH.icons.src, { encoding: false, ignore: ['**/_*'] })
		.pipe(plumber())
		.pipe(dest(PATH.icons.dist))
		.pipe(
			sprite({
				mode: spriteMode,
				shape: spriteShape,
			}),
		)
		.pipe(dest(PATH.icons.dist))
		.pipe(server.stream());
}

function handleScripts() {
	return src(PATH.scripts.src, { sourcemaps: MODE.dev })
		.pipe(plumber())
		.pipe(dest(PATH.scripts.dist, { sourcemaps: '.' }))
		.pipe(server.stream());
}

function handleStyles() {
	return src(PATH.styles.src, { sourcemaps: MODE.dev })
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss())
		.pipe(dest(PATH.styles.dist, { sourcemaps: '.' }))
		.pipe(server.stream());
}

const handleFunctions = [handlePages, handleStyles, handleScripts, handleIcons];

/**
 * Copy functions
 *
 * 00.Copy function
 * 01.Copy fonts
 * 02.Copy media
 * 03.Copy images
 * 04.Copy public
 */

function copy({ from, to }) {
	return src(from, { encoding: false, ignore: ['**/_*'] })
		.pipe(plumber())
		.pipe(dest(to));
}

const copyFonts = () => copy({ from: PATH.fonts.src, to: PATH.fonts.dist });
const copyMedia = () => copy({ from: PATH.media.src, to: PATH.media.dist });
const copyImages = () => copy({ from: PATH.images.src, to: PATH.images.dist });
const copyPublic = () => copy({ from: PATH.public.src, to: PATH.public.dist });

const copyFunctions = [copyFonts, copyImages, copyMedia];

/**
 * Command functions
 *
 * 01.Run clean
 * 02.Run serve
 * 03.Run watch
 */

async function runClean() {
	await deleteAsync(`${DIR.build}/*`);
}

function runServe() {
	server.init({
		server: MODE.prod ? [DIR.build] : [DIR.build, DIR.public],
		notify: false,
		port: 3000,
		open: true,
		cors: true,
		ui: false,
	});
}

export const runWatch = () => {
	const pages = watch(PATH.pages.watch);
	const fonts = watch(PATH.fonts.watch);
	const icons = watch(PATH.icons.watch);
	const images = watch(PATH.images.watch);
	const styles = watch(PATH.styles.watch);
	const scripts = watch(PATH.scripts.watch);

	const deleteFiles = (path) => {
		deleteSync(path.replace(DIR.src, DIR.build));
	};

	pages.on('all', () => {
		handlePages();
	});

	styles.on('all', () => {
		handleStyles();
	});

	scripts.on('all', async () => {
		handleScripts();
	});

	fonts.on('all', () => {
		copyFonts();
		server.reload();
	});

	icons.on('all', () => {
		handleIcons();
		server.reload();
	});

	images.on('all', () => {
		copyImages();
		server.reload();
	});

	fonts.on(['unlink'], deleteFiles);
	images.on(['unlink'], deleteFiles);
	styles.on(['unlink'], deleteFiles);
	scripts.on(['unlink'], deleteFiles);
};

/**
 * CLI tasks
 *
 * 01.Clean task
 * 02.Build task
 * 03.Preview task
 * 04.Default task (develop)
 */

export const clean = series(runClean);
export const build = series(runClean, ...copyFunctions, ...handleFunctions);
export const preview = series(runClean, copyPublic, ...copyFunctions, ...handleFunctions, runServe);

export default series(runClean, ...copyFunctions, ...handleFunctions, parallel(runServe, runWatch));
