// Based heavily on https://github.com/versatiles-org/versatiles-style/blob/main/scripts/build-styles.ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { eclipse } from "@versatiles/style";
import { StyleSpecification, validateStyleMin } from '@maplibre/maplibre-gl-style-spec';

const styleOptions = {
    language: undefined,
    baseurl: '',
    tiles: ['/shortbread_v1/{z}/{x}/{y}.mvt'],
    glyphs: '/demo/fonts/{fontstack}/{range}.pbf',
    sprite: [{ id: 'basics', url: '/demo/sprites/basic/sprites' }]
}

const dirDst = new URL('demo/shortbread', import.meta.url).pathname;
mkdirSync(dirDst, { recursive: true });

[
	{ name: 'eclipse', builder: eclipse },
].forEach(({ name, builder }) => {
	produce(name, builder(styleOptions));
});


function produce(name: string, style: StyleSpecification): void {

	// Validate the style and log errors if any
	const errors = validateStyleMin(style);
	if (errors.length > 0) console.log(errors);

	// write
    writeFileSync('demo/shortbread/' + name + '.json', JSON.stringify(style, null, 2));
	console.log('Saved ' + name);
}
