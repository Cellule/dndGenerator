# Non-Player Character generator
Website for generating randomized Non-Player Characters (NPCs) with attributes, in-depth and unique descriptions as well as a plot hook

[![Build Status](https://dev.azure.com/cellule/NpcGenerator/_apis/build/status/NpcGenerator-CI?branchName=master)](https://dev.azure.com/cellule/NpcGenerator/_build/latest?definitionId=1?branchName=master)

## Development
### Setup
You will need to install [Node](https://nodejs.org/) on your system.

```
$ git clone https://github.com/Cellule/dndGenerator.git
$ cd dndGenerator
$ npm install
```

### Run locally
Start local server
```
$ npm start
```

## Run in Docker
You can startup a local server using [Docker](https://www.docker.com/) & [Docker compose](https://docs.docker.com/compose/) with the included Dockerfile and docker-compose.yml
The docker instance will listen on port 3000

```
$ docker compose up --build --detach
```
