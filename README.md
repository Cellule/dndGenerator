# Non-Player Character generator
Website for generating randomized Non-Player Characters (NPCs) with attributes, in-depth and unique descriptions as well as a plot hook

Uses the [NPC Generator library](https://github.com/Cellule/npc-generator) to generate NPCs.

## Development
### Setup

This project uses [mise](https://mise.jdx.dev/) to manage the Node.js version (see `mise.toml`).

```
$ git clone https://github.com/Cellule/dndGenerator.git
$ cd dndGenerator
$ mise install
$ npm install
```

Alternatively, install [Node](https://nodejs.org/) (>=26.0.0) manually.

### Run locally

Start local server
```
$ npm run dev
```

### Test changes from the npc-generator library

Recommended to checkout the npc-generator library on your computer and use npm link to link it to the dndGenerator project.

```
$ git clone https://github.com/Cellule/npc-generator
$ cd npc-generator
$ npm run build
$ npm link
$ cd ../dndGenerator
$ npm link npc-generator
# Start local server
```

