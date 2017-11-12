DHIS Import App
==============

## Getting Started

Install the node dependencies
```sh
npm install
```

To set up your DHIS2 instance to work with the development service you will need to add the development servers address to the CORS whitelist. You can do this within the DHIS2 Settings app under the _access_ tab. On the access tab add `http://localhost:8081` to the CORS Whitelist.

This should enable you to run the following node commands:

To run the development server
```sh
npm start
```

To run the tests one time
```sh
npm test
```

To run the tests continuously on file changes (for your BDD workflow)
```sh
npm run test-watch
```

To generate a coverage report for the tests
```sh
npm run coverage
```

To check the code style for both the JS and SCSS files run
```sh
npm run lint
```
# Running the application

The home page allows for the configuration of global data needed by DHIS.
Create an organizational unit and at least one data element.

The Create Program button will do all of the work to create a tracker program
in DHIS. Once this is created, assign all data elements to this tracker program
(all data elements will be assigned to the first stage).

After configuration is complete, use the import tab. Select a json file to read. 
These files are expected to be in a standard FHIR format (a root object that contains
multiple entries. Each entry has a resource object that contains the information we
are interested in tracking).

After the file is read, press the import button to create the tracker event data
in DHIS. The data can now be used in the 'Event Visualization' portal in DHIS.

Future functionality: add data visualization within this application

# Tools etc.

## Frameworks... and libraries
### React
[React](https://facebook.github.io/react/) is the _view_ part of the front-end applications, it has a component based architecture. At DHIS2 we also use JSX syntax that is generally used with React.

###d2, d2-ui
[d2](https://github.com/dhis2/d2) is the DHIS2 abstraction library that allows you to communicate with the DHIS2 api in a programatic way. [d2-ui](https://github.com/dhis2/d2-ui) is the ui component library that is build on top of d2 to allow reuse of common components that are used within DHIS2 applications. d2-ui also contains our own application wiring code through its _stores_ and _actions_.

### material-ui
d2-ui makes use of [material-ui](http://www.material-ui.com) for rendering more basic components like TextFields and Lists. It is therefore quite useful to look into this library too when building DHIS2 apps and making use of d2-ui.

## Workflow

### Webpack
Webpack is a module bundler that allows the use of plugins to do various other things. We make use of webpack for the following things:
+ Bundling the files up into a single file. (The primary webpack use case)
+ Transpiling ES2015 and React JSX code to ES5 syntax so it runs in the browser. (This is done using [Babel](http://babeljs.io).)
+ Loading [Scss](http://sass-lang.com) files. Scss is a css pre-processor that has quite some fancy features as variables, nesting of style declarations etc.
+ Minifying the bundled file to reduce file size
+ Remove duplicate dependencies

To make the development a more interactive experience we use `webpack-dev-server` to provide us with a development server that watches the project files and refreshes the browser when changes are detected.

### npm
[Npm](https://www.npmjs.com) is used as both a dependency management tool as a _workflow manager_ through its `scripts` as can be seen in the [package.json](https://github.com/dhis2/app-skeleton/blob/master/package.json#L6-L14). It provides convenience commands to kick off various tasks. These tasks are mentioned above as `npm run <command>`, `npm start`, `npm test`, etc.

### linting
To make sure the code is in line with the code style, we use [eslint](http://eslint.org) as a static style checker. To a large degree we follow the [airbnb Javascript styleguide](https://github.com/airbnb/javascript). We do however have slight modifications which are defined in our own eslint-config. ([eslint-config-dhis2](https://github.com/dhis2/eslint-config-dhis2/blob/master/.eslintrc))

## Testing

### mocha, chai, sinon
[Mocha](https://mochajs.org) is a test runner that runs the unit tests. [Chai](http://chaijs.com) is the assertion library that is used to do assertions within those tests. It supports various styles. At DHIS2 we generally tend to go with the [expect/BDD](http://chaijs.com/api/bdd/) variant. [Sinon](http://sinonjs.org) is used to do mocking within the tests and to fake HTTP requests where needed. The interesting things to look at for sinon are it's [spies](http://sinonjs.org/docs/#spies) and [stubs](http://sinonjs.org/docs/#stubs) calls and the [fakeServer](http://sinonjs.org/docs/#fakeServer).

### enzyme
[Enzyme](https://github.com/airbnb/enzyme) tool to make testing of React components easier. They provide a pretty clean api to get information from your rendered react components. 
