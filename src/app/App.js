import React from 'react';
import log from 'loglevel';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';

import { ViewData } from './view';
import { ImportData } from './import';
import { GlobalData } from './global';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

var Actions = {
    HOME: 1,
    IMPORT: 2,
    VIEW: 3
  };

export default React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        d2: React.PropTypes.object,
    },

    childContextTypes: {
        d2: React.PropTypes.object,
    },

    getDefaultProps() {
        return {
            name: 'John',
        };
    },

    getChildContext() {
        return {
            d2: this.props.d2,
        };
    },

    getInitialState: function() {
        return {
          action: Actions.HOME,
          user: null,
          orgs: null,
          programs: null,
          elements: null
        };
      },

    setUser(user) {
        this.setState({user: user});
    },

    setOrgs(orgs) {
        this.setState({orgs: orgs});
    },

    setPrograms(programs) {
        this.setState({programs: programs});
    },

    setElements(elements) {
        this.setState({elements: elements});
    },

    _sidebarItemClicked(sideBarItemKey) {
        if (sideBarItemKey == 'home') {
            this.setState({ action: Actions.HOME});
        }
        if (sideBarItemKey == 'import') {
            this.setState({ action: Actions.IMPORT});
        }
        if (sideBarItemKey == 'view') {
            this.setState({ action: Actions.VIEW});
        }
    },

    render() {
        const sideBarSections = [
            { key: 'home', label: 'Home' },
            { key: 'import', label: 'Import Data' },
            { key: 'view', label: 'View Data' },
        ];

        return (
            <div className="app-wrapper">
                <HeaderBar />
                <Sidebar
                    sections={sideBarSections}
                    onChangeSection={this._sidebarItemClicked}
                />
                { this.state.action == Actions.HOME && (
                    <GlobalData {...this.state} setUser={this.setUser} setOrgs={this.setOrgs} setPrograms={this.setPrograms} setElements={this.setElements} />
                )}
                { this.state.action == Actions.IMPORT && (
                    <ImportData {...this.state} />
                )}
                { this.state.action == Actions.VIEW && (
                    <ViewData {...this.state} />
                )}
            </div>
        );
    },
});
