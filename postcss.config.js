import postcssPresetEnv from 'postcss-preset-env';

/**
 * @see https://github.com/postcss/postcss#usage
 * @type {import('postcss-load-config').Config}
 */
export default {
	plugins: [
		postcssPresetEnv({
			stage: 2,
			features: {
				'media-query-ranges': true,
			},
			autoprefixer: {
				grid: true,
				cascade: true,
			},
		}),
	],
};
