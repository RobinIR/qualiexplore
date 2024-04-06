
# QualiExplore Angular Module

Standalone Frontend Angular application of QualiExplore Component in the [i4Q](www.i4q-project.eu)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.8.

### Important Notes

This App requires two backend servers 'mongodb-graphql' and 'neo4j-graphql' server.

## Backend Servers

- **mongodb-graphql**: Used for user authentication.
- **neo4j-graphql**: Handles all other functionalities.

Backend URLs and SocketUrls for RASA widget are stored in the `src/environments` folder.

For backend servers setup, please refer to the [qualiexplore-stack repository](https://github.com/s-wel/qualiexplore-stack/tree/i4q).

## Installation Instructions

### Local Setup

1. Install dependencies by running `npm i`.
2. Start the application by running `ng serve`.
3. The app will automatically reload if you make any changes to the source files.


## Installation through Docker

QualiExplore is served through `nginx` HTTP Server. See `Dockerfile` for details.
Qualiexplore is also available on [Docker Hub]

*  [Dockerhub Image link will be added]

See Dockerfile and docker-compose.yml file for details


## Contact

* [Stefan Wellsandt](mailto:wel@biba.uni-bremen.de)

## Contributors

* [Shantanoo Desai](mailto:des@biba.uni-bremen.de)
* [Stefan Wellsandt](mailto:wel@biba.uni-bremen.de)
* [Robin Kuri](mailto:kur@biba.uni-bremen.de)


## License

__Apache2.0 License__
```
  Copyright 2022
  University of Bremen, Faculty of Production Engineering, Badgasteiner Straße 1, 28359 Bremen, Germany.
  In collaboration with BIBA - Bremer Institut für Produktion und Logistik GmbH, Bremen, Germany.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. MIT License for npm package- "ngx-tree-dnd" : Copyright (c) 2018 Yaroslav Kikot.
```
