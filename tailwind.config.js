const { addDynamicIconSelectors } = require('@iconify/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#971327',
				secondary: '#EA8C55',
				accent: '#4281A4',
				base: '#02111B',
				content: '#F1FAEE'
			}
		}
	},
	plugins: [
		// Iconify plugin
		addDynamicIconSelectors(),
		require('daisyui')
	]
};
