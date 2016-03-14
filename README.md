d2 Starter app

--

## Prerequisites
Make sure you have at least the following versions of `node` and `npm`.

+ Node version v5.6.0 or higher
+ npm version 3.8.0 or higher

Use the following commands to check your current versions
```sh
node -v

npm -v
```

## Getting started

Clone the repository from github with the following command
```sh
git clone https://github.com/dhis2/app-skeleton
```

Install the node dependencies
```sh
npm install
```

To set up your DHIS2 instance to work with the development service you will need to add the development servers address to the CORS whitelist. You can do this within the DHIS2 Settings app under the _access_ tab. On the access tab add `http://localhost:8081` to the CORS Whitelist.
> The starter app assumes your dhis2 instance is located at `http://localhost:8080/dhis` and that you have an account available with username `admin` and password `district`. If this you do not have these settings available change them in the following locations [username and password](https://github.com/dhis2/app-skeleton/blob/master/src/app.js#L22) and/or [server location](https://github.com/dhis2/app-skeleton/blob/master/src/app.js#L53-L54).

This should allow you to be able to run the following node commands

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


