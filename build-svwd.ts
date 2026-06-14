import fs from 'fs';

// TODO: use the full set of fonts from the website
function setFonts(layer: any, index: number, arr: any[]): void {
  if (layer.layout?.['text-font'] == "KlokanTech Noto Sans Regular") {
    arr[index].layout['text-font'] = ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Noto Sans", "Liberation Sans", "Arial", "sans-serif"];
  } else if (layer.layout?.['text-font'] == "KlokanTech Noto Sans Italic") {
    arr[index].layout['text-font'] = ["Segoe UI Italic", "Roboto Italic", "Helvetica Neue Italic", "Noto Sans Italic", "Liberation Sans Italic", "Arial Italic", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Noto Sans", "Liberation Sans", "Arial"];
  }
}

function main(): void {
  // Get command line arguments (skip first two: node and script path)
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: tsx svwd.ts <path-to-json-file>');
    console.error('Example: tsx svwd.ts config.json');
    process.exit(1);
  }

  const jsonFilePath = args[0];

  const style = fs.readFileSync(jsonFilePath);

  var styleJSON = JSON.parse(style);

  styleJSON.name = "SVWD03";
  delete styleJSON.center;
  delete styleJSON.metadata;
  delete styleJSON.zoom;
  delete styleJSON.bearing;
  delete styleJSON.pitch;
  delete styleJSON.glyphs;
  delete styleJSON.id;

  styleJSON.sources.someoneelse = {
      "attribution": "© \u003Ca href=\"https://www.openstreetmap.org/copyright\"\u003EOpenStreetMap\u003C/a\u003E contributors",
      "tiles": [
        "https://vector.openstreetmap.org/shortbread_v1/{z}/{x}/{y}.mvt"
      ],
      "type": "vector",
      "scheme": "xyz",
      "bounds": [-180, -85.0511287798066, 180, 85.0511287798066],
      "minzoom": 0,
      "maxzoom": 14
    };

  styleJSON.layers.forEach(setFonts);
  styleJSON.sprite = "https://vector.openstreetmap.org/styles/svwd/sprites/svwd03sprite"

  fs.writeFileSync('svwd03style.json', JSON.stringify(styleJSON, null, 2));
}

main();
