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
### Run
Start Server and Webpack on 2 different consoles
```
$ npm run start-dev
$ npm run hot-dev-server
```

Navigate to `http://localhost:8080`

### Tests
Execute tests with
```
npm test
```

### Linting
ESLint is used to lint this project. To check linting run
```
npm run lint
```
To integrate ESLint in sublime 3 see [SublimeLinter-ESLint](https://github.com/roadhump/SublimeLinter-eslint)

## Deployment

Currently the website is hosted on [Azure Website](https://azure.microsoft.com/‎)
It is linked to the GitHub repository https://github.com/Cellule/dndGenerator.

In order to publish to azure you need to follow these steps.
- Commit and push all your development work in master
- Merge master to the [release](https://github.com/Cellule/dndGenerator/tree/release) branch
  - If there are any conflicts on the `build` folder, you can safely ignore them (resolve using theirs for instance)
- Build the app in console
  - `npm install` to refresh modules
  - `npm run build` to build
- Commit and push the changes in the `build` folder to the release branch
- Make sure to add any new image in \build\public\, they might have a weird name though!

Once a new commit is pushed on the `release` branch, Azure will detect and publish your new code automatically.
It might take a few minutes to deploy (usually really fast).
