import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import { init, config, getManifest } from 'd2/lib/d2';

import dhis2 from 'd2-ui/lib/header-bar/dhis2';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

// The react-tap-event-plugin is required by material-ui to make touch screens work properly with onClick events
import 'react-tap-event-plugin';

import App from './app/App';
import './app/app.scss';

// This code will only be included in non-production builds of the app
// It sets up the Authorization header to be used during CORS requests
// This way we can develop using webpack without having to install
// the application into DHIS2.
if (process.env.NODE_ENV !== 'production') {
    jQuery.ajaxSetup({ // eslint-disable-line no-undef
        headers: {
            Authorization: `Basic ${btoa('admin:district')}`,
        },
    });
}

// Render the a LoadingMask to show the user the app is in loading
// The consecutive render after we did our setup will replace this loading mask
// with the rendered version of the application.
render(<LoadingMask />, document.getElementById('app'));

/**
 * Renders the application into the page.
 *
 * @param d2 Instance of the d2 library that is returned by the `init` function.
 */
function startApp(d2) {
    render(<App d2={d2} />, document.querySelector('#app'));
}


// Load the application manifest to be able to determine the location of the Api
// After we have the location of the api, we can set it onto the d2.config object
// and initialise the library. We use the initialised library to pass it into the app
// to make it known on the context of the app, so the sub-components (primarily the d2-ui components)
// can use it to access the api, translations etc.
getManifest('./manifest.webapp')
    .then(manifest => {
        config.baseUrl = `${manifest.getBaseUrl()}/api`;

        // Set the baseUrl to localhost if we are in dev mode
        if (process.env.NODE_ENV !== 'production') {
            config.baseUrl = 'http://localhost:8080/dhis/api';
            dhis2.settings.baseUrl = 'http://localhost:8080/dhis';
        }
    })
    .then(init)
    .then(startApp)
    .catch(log.error.bind(log));
