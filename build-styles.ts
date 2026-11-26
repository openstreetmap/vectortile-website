// Based heavily on https://github.com/versatiles-org/versatiles-style/blob/main/scripts/build-styles.ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { osm } from "@versatiles/style";
import { StyleSpecification, validateStyleMin } from '@maplibre/maplibre-gl-style-spec';

const saveLocation = "release/shortbread";
const baseUrl = 'https://vector.openstreetmap.org';
const urls = {
    base: baseUrl,
    // A TileJSON object is used as given, so its tile URL must be absolute.
    osm: {
        tilejson: '3.0.0',
        tiles: [baseUrl + '/shortbread_v1/{z}/{x}/{y}.mvt'],
        minzoom: 0,
        maxzoom: 14,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    glyphsPattern: '/styles/shortbread/fonts/{fontstack}/{range}.pbf',
    sprite: [{ id: 'base', url: '/styles/shortbread/sprites/base' }]
}

const dirDst = new URL(saveLocation, import.meta.url).pathname;
mkdirSync(dirDst, { recursive: true });

// The file names are the v5 style names, so existing links keep working.
[
	{ name: 'colorful', theme: 'colorful' },
	{ name: 'eclipse', theme: 'colorful-dark' },
	{ name: 'graybeard', theme: 'gray' },
	{ name: 'neutrino', theme: 'muted' },
	{ name: 'shadow', theme: 'gray-dark' },
].forEach(({ name, theme }) => {
	produce(name, osm({ theme, urls, projection: 'mercator' }));
});




function produce(name: string, style: StyleSpecification): void {

	// Validate the style and log errors if any
	const errors = validateStyleMin(style);
	if (errors.length > 0) console.log(errors);

	// write
    writeFileSync(saveLocation + '/' + name + '.json', JSON.stringify(style, null, 2));
	console.log('Saved ' + name);
}
