// Based heavily on https://github.com/versatiles-org/versatiles-style/blob/main/scripts/build-styles.ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { colorful, eclipse, graybeard, neutrino, shadow } from "@versatiles/style";
import { StyleSpecification, validateStyleMin } from '@maplibre/maplibre-gl-style-spec';

const demoSaveLocation = "_versatiles/shortbread";
const demoStyleOptions = {
    language: undefined,
    baseUrl: '',
    tiles: ['/shortbread_v1/{z}/{x}/{y}.mvt'],
    glyphs: '/demo/shortbread/fonts/{fontstack}/{range}.pbf',
    sprite: [{ id: 'basics', url: '/demo/shortbread/sprites/basics/sprites' }]
}

const saveLocation = "release/shortbread";
const styleOptions = {
    language: undefined,
    baseUrl: 'https://vector.openstreetmap.org',
    tiles: ['/shortbread_v1/{z}/{x}/{y}.mvt'],
    glyphs: '/demo/shortbread/fonts/{fontstack}/{range}.pbf',
    sprite: [{ id: 'basics', url: '/demo/shortbread/sprites/basics/sprites' }]
}

const demoDirDst = new URL(demoSaveLocation, import.meta.url).pathname;
mkdirSync(demoDirDst, { recursive: true });

const dirDst = new URL(saveLocation, import.meta.url).pathname;
mkdirSync(dirDst, { recursive: true });

[
	{ name: 'colorful', builder: colorful },
	{ name: 'eclipse', builder: eclipse },
	{ name: 'graybeard', builder: graybeard },
	{ name: 'neutrino', builder: neutrino },
	{ name: 'shadow', builder: shadow },
].forEach(({ name, builder }) => {
	demoProduce(name, builder(demoStyleOptions));
	produce(name, builder(styleOptions));
});


function demoProduce(name: string, style: StyleSpecification): void {

	// Validate the style and log errors if any
	const errors = validateStyleMin(style);
	if (errors.length > 0) console.log(errors);

	// write
    writeFileSync(demoSaveLocation + '/' + name + '.json', JSON.stringify(style, null, 2));
	console.log('Saved ' + name);
}

function produce(name: string, style: StyleSpecification): void {

	// Validate the style and log errors if any
	const errors = validateStyleMin(style);
	if (errors.length > 0) console.log(errors);

	// write
    writeFileSync(saveLocation + '/' + name + '.json', JSON.stringify(style, null, 2));
	console.log('Saved ' + name);
}
