# Vector Tile Website

This repository contains the demo content for vector.openstreetmap.org/demo. It builds styles, sprites, and fonts, and serves them from a Docker container. Note that the Docker container relies on an external tile server, as it doesn't serve tiles itself.

The @versatiles/style package builds the style while sprites and glyphs are downloaded from github releases.
