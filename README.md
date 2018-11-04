# Dungeon and Dragon NPC generator
Website for generating npc with caracteristics and backstory with attributes

## Development
### Setup
You will need to install [Node](https://nodejs.org/) on your system.

```
$ git clone https://github.com/Cellule/dndGenerator.git
$ cd dndGenerator
$ npm install
```
### Development
Start Webpack hot server
```
$ npm start
```

## Deployment

Currently the website is hosted on [Azure Blob Storage](https://azure.microsoft.com/‎)

In order to publish to azure you need to follow these steps.
- Commit and push all your development work in master
- Build the app in console
  - `npm install` to refresh modules
  - `npm run build` to build
- Copy content of the build folder to the Azure storage account
  - This can be done directly in VS Code using "Azure Storage" extension
