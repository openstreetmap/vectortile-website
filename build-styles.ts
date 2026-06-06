// Based heavily on https://github.com/versatiles-org/versatiles-style/blob/main/scripts/build-styles.ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { colorful, eclipse, graybeard, neutrino, shadow } from "@versatiles/style";
import { StyleSpecification, validateStyleMin } from '@maplibre/maplibre-gl-style-spec';

const saveLocation = "release/shortbread";
const styleOptions = {
    language: undefined,
    baseUrl: 'https://vector.openstreetmap.org',
    tiles: ['/shortbread_v1/{z}/{x}/{y}.mvt'],
    glyphs: '/styles/shortbread/fonts/{fontstack}/{range}.pbf',
    sprite: [{ id: 'basics', url: '/styles/shortbread/sprites/basics/sprites' }]
}

const dirDst = new URL(saveLocation, import.meta.url).pathname;
mkdirSync(dirDst, { recursive: true });

[
	{ name: 'colorful', builder: colorful },
	{ name: 'eclipse', builder: eclipse },
	{ name: 'graybeard', builder: graybeard },
	{ name: 'neutrino', builder: neutrino },
	{ name: 'shadow', builder: shadow },
].forEach(({ name, builder }) => {
	produce(name, builder(styleOptions));
});




function produce(name: string, style: StyleSpecification): void {

	// Validate the style and log errors if any
	const errors = validateStyleMin(style);
	if (errors.length > 0) console.log(errors);

	// write
    writeFileSync(saveLocation + '/' + name + '.json', JSON.stringify(style, null, 2));
	console.log('Saved ' + name);
}
