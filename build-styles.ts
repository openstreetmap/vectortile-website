// Based heavily on https://github.com/versatiles-org/versatiles-style/blob/main/scripts/build-styles.ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { osm } from "@versatiles/style";
import { StyleSpecification, validateStyleMin } from '@maplibre/maplibre-gl-style-spec';

const saveLocation = "release/shortbread";
const styleOptions = {
    urls: {
        base: 'https://vector.openstreetmap.org',
        osm: '/shortbread_v1/{z}/{x}/{y}.mvt',
        glyphsPattern: '/styles/shortbread/fonts/{fontstack}/{range}.pbf',
        sprite: [{ id: 'base', url: '/styles/shortbread/sprites/base' }]
    }
}

const dirDst = new URL(saveLocation, import.meta.url).pathname;
mkdirSync(dirDst, { recursive: true });

[
	{ name: 'colorful', theme: 'colorful' },
	{ name: 'eclipse', theme: 'colorful-dark' },
	{ name: 'graybeard', theme: 'gray' },
	{ name: 'neutrino', theme: 'muted' },
	{ name: 'shadow', theme: 'gray-dark' },
].forEach(({ name, theme }) => {
	produce(name, osm({ ...styleOptions, theme }));
});




function produce(name: string, style: StyleSpecification): void {

	// Validate the style and log errors if any
	const errors = validateStyleMin(style);
	if (errors.length > 0) console.log(errors);

	// write
    writeFileSync(saveLocation + '/' + name + '.json', JSON.stringify(style, null, 2));
	console.log('Saved ' + name);
}
