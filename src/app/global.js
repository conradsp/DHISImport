import React, { Component } from 'react';
import { FlatButton, RaisedButton, Card, CardText } from 'material-ui';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component.js';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import 'd2-ui/scss/DataTable.scss';

import { dhisRead, dhisWrite } from './dhis';
import { orgFields, elementFields } from './fields';

export class GlobalData extends Component {

    constructor(props) {
        super(props);
        this.state = {
          trackedEntityAttributes: null,
          userRole: null,
          newOrg: {},
          newElement: {},
          newStage: {},
          newProgram: {},
          elementsAssigned: false,
          defaultCombo: null
        };
        this.createOrg = this.createOrg.bind(this);
        this.createElement = this.createElement.bind(this);
        this.createTrackedAttributes = this.createTrackedAttributes.bind(this);
        this.createTrackerProgram = this.createTrackerProgram.bind(this);
        this.assignToProgram = this.assignToProgram.bind(this);
        this.onUpdateOrgField = this.onUpdateOrgField.bind(this);
        this.onUpdateElementField = this.onUpdateElementField.bind(this);
    }

    loadUser() {
        dhisRead('me.json')
        .then(json => {
            this.props.setUser(json);
            // Load the user role - we will need it for creating the program
            dhisRead('metadata.json?assumeTrue=false&userRoles=true')
                .then(json=>{
                    this.setState({userRole: json.userRoles[0]});
                })
        })
    }

    loadOrgs(setUser=false) {
        dhisRead('metadata.json?assumeTrue=false&organisationUnits=true')
            .then(json => {
                this.props.setOrgs(json.organisationUnits);
                if (setUser) {
                    var {user} = this.props;
                    var dhisPayload = { "users" : [{"id":user.id, "firstName": "admin", "surname":"admin", "organisationUnits":[{"id":json.organisationUnits[0].id}],"dataViewOrganisationUnits":[{"id":json.organisationUnits[0].id}]}]};
                    dhisWrite('metadata.json?importStrategy=UPDATE&mergeMode=MERGE', JSON.stringify(dhisPayload))
                    .then(res => {

                    });
                }
            })
    }

    loadElements() {
        dhisRead('metadata.json?assumeTrue=false&dataElements=true')
            .then(json => {
                this.props.setElements(json.dataElements);
            })

        // Also need to read category combos (there should only be one) - 
        // we need this when creating elements
        if (!this.state.defaultCombo) {
            dhisRead('metadata.json?assumeTrue=false&categoryCombos=true')
            .then(json => {
                this.setState({defaultCombo: json.categoryCombos[0].id})
            })
        }
    }

    loadTrackedEntityAttributes() {
        dhisRead('metadata.json?assumeTrue=false&programTrackedEntityAttributes=true')
            .then(json => {
                this.setState({ trackedEntityAttributes: json.trackedEntityAttributes });
            })
    }

    loadPrograms() {
        dhisRead('metadata.json?assumeTrue=false&programs=true')
            .then(json => {
                this.props.setPrograms(json.programs);
            })
    }

    createOrg() {
        var {newOrg} = this.state;
        var {user} = this.props;
        var dhisPayload = {"organisationUnits" : [{"code":newOrg.code, "name":newOrg.name, "shortName":newOrg.shortName, "level":1, "openingDate":newOrg.openingDate, "user":{"id":user.id}}]};

        dhisWrite('metadata.json', JSON.stringify(dhisPayload))
            .then(res => {
                // Add the org unit to the user record
                this.loadOrgs(true);

                // Make sure the organisationUnitLevel is set
                dhisPayload = {"organisationUnitLevels": [{"level":1, "name":"Level 1"}]};
                dhisWrite('metadata.json', JSON.stringify(dhisPayload))
                .then(res => {
                });
            });
    }

    createElement() {
        var {newElement} = this.state;
        var {user} = this.props;
        var dhisPayload = {"dataElements" : [{"code":newElement.code, "name":newElement.name, "shortName":newElement.shortName, "openingDate":newElement.openingDate, "aggregationType":newElement.aggregationType, "valueType": newElement.valueType, "domainType":"TRACKER", /*"categoryCombo":{"id":this.state.defaultCombo},*/ "user":{"id":user.id}}]};

        dhisWrite('metadata.json', JSON.stringify(dhisPayload))
            .then(res => {
                this.loadElements();
            });
    }

    createTrackedAttributes() {
        var {user} = this.props;
        var dhisPayload = {"programTrackedEntityAttributes": []};
        this.props.elements.map((element) => {
            dhisPayload.programTrackedEntityAttributes.push({"dataElement": {"id":element.id}, "programStage": {"id":this.state.newStage.id}});
        });
        dhisWrite('metadata.json', JSON.stringify(dhisPayload))
            .then(res => {
                this.loadTrackedEntityAttributes();
            });
        
    }

    createTrackerProgram() {
        var {orgs, user} = this.props;
        var {trackedEntityAttributes, userRole} = this.state;

        var dhisPayload = {"programs" : [{"name":"FHIR Weight", "shortName":"FHIR Weight", "categoryCombination": "NONE", "programType": "WITHOUT_REGISTRATION", "completeEventsExpiryDays":0, "expiryDays":0, "programStages":[],"organisationUnits":[{"id":orgs[0].id}],"user":{"id":user.id}}]};

        dhisWrite('metadata.json', JSON.stringify(dhisPayload))
            .then(res => {
                dhisRead('metadata.json?assumeTrue=false&programs=true')
                .then(json => {
                    var progId = json.programs[0].id;
                    this.setState({newProgram: json.programs[0]});
                    // Create the stage
                    dhisPayload = {"programStages": [{"program":{"id":progId}, "name":"Stage1", "description":"Desc", "sortOrder":1,"programStageDataElements":[]}]}
                    dhisWrite('metadata.json', JSON.stringify(dhisPayload))
                    .then(res => {
                        dhisRead('metadata.json?assumeTrue=false&programStages=true')
                        .then(json => {
                            this.setState({newStage: json.programStages[0]})
                            // Now update the program with the stage Id
                            dhisPayload = {"programs": [{"id":progId, "programStages":[{"id":json.programStages[0].id}]}]};
                            dhisWrite('metadata.json?importStrategy=UPDATE&mergeMode=MERGE', JSON.stringify(dhisPayload))
                            .then(res => {
                                // Update the current user role and add the program
                                dhisPayload = {"userRoles": [{"id":userRole.id, "name":"Superuser", "authorities":userRole.authorities, "programs":[{"id":progId }]}]};
                                dhisWrite('metadata.json?importStrategy=UPDATE&mergeMode=MERGE', JSON.stringify(dhisPayload))
                                .then(res => {
                                    this.loadPrograms();
                                });
                            })
                        });
                    });
                });
            });
    }

    assignToProgram() {
        // Get the stage of the program
        var stageId = this.state.newStage.id;
        var dhisPayload = {"programStages" : [{"id":stageId, "programStageDataElements":[]}]};
        this.props.elements.map((element) => {
            dhisPayload.programStages[0].programStageDataElements.push({"programStage":{"id":stageId}, "dataElement":{"id":element.id}, "sortOrder":0});
        });
        dhisWrite('metadata.json?importStrategy=UPDATE&mergeMode=MERGE', JSON.stringify(dhisPayload))
        .then(res => {
            this.setState({elementsAssigned:true});
        });
    }

    componentDidMount() {
        this.loadUser();
        this.loadOrgs();
        this.loadElements();
        this.loadTrackedEntityAttributes();
        this.loadPrograms();
    }

    onUpdateOrgField(fieldName, newValue) {
        this.setState({'newOrg': {...this.state.newOrg, [fieldName]: newValue}})
    }

    onUpdateElementField(fieldName, newValue) {
        this.setState({'newElement': {...this.state.newElement, [fieldName]: newValue}})
    }

    render() {

        return (
            <div className="main-content">
                <div className="headerlabel">Organization Units</div>
                {this.props.orgs ? (<OrgList orgs={this.props.orgs} />) : (<div>
                    <div className='divider'>
                        <Card>
                            <CardText>No organizations defined</CardText>
                        </Card>
                    </div>
                    <Card>
                        <CardText>
                            Add Organization
                            <FormBuilder
                                fields={orgFields(this)}
                                onUpdateField={this.onUpdateOrgField}
                            />
                        </CardText>
                        <button className="dhisbutton" onClick={this.createOrg}>Create Org</button>
                    </Card>
                </div>)}
                   
                <div className="headerlabel">Data Elements</div>
                {this.props.elements ? (<DataElementList dataElements={this.props.elements} />) : (
                    <div className='divider'>
                        <Card>
                            <CardText>No Data Elements defined</CardText>
                        </Card>
                    </div>)
                }
                <Card>
                    <CardText>
                        Add Data Element
                        <FormBuilder
                            fields={elementFields(this)}
                            onUpdateField={this.onUpdateElementField}
                        />
                    </CardText>
                    <button className="dhisbutton" onClick={this.createElement}>Create Data Element</button>
                </Card>

                <div className="headerlabel">Programs</div>
                <div className='divider'>
                    <Card>
                    {this.props.programs ? (<CardText>Tracker program has been defined</CardText>) : (
                        <CardText>Tracker program not defined</CardText>)}
                    </Card>
                    { !this.props.programs && (<button className="dhisbutton" onClick={this.createTrackerProgram}>Create Program</button>)}
                </div>

                <div className="headerlabel">Assign Data Elements to Program</div>
                {!this.state.elementsAssigned && this.props.elements && this.props.programs ? (
                        <button className="dhisbutton" onClick={this.assignToProgram}>Assign to Program</button>
                    ) : <div>Data elements have been assigned to program</div>}

                <div className="headerlabel">Tracked Entity Attributes</div>
                <div className='divider'>
                    <Card>
                    {this.state.trackedEntityAttributes ? (<CardText>Program Attributes have been defined</CardText>) : (
                        <CardText>Tracked Entity Attributes not defined</CardText>)}
                    </Card>
                    { this.props.programs && !this.state.trackedEntityAttributes && (<button className="dhisbutton" onClick={this.createTrackedAttributes}>Create Attributes</button>)}
                </div>
            </div>
        );
    }
}

class OrgList extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        var { orgs } = this.props;

        const cma = {
            delete: function (...args) {
                console.log('Delete', ...args);
            },
        };

        return (
            <div>
                <DataTable
                    columns={['name', 'shortName', 'code']}
                    rows={orgs}
                    contextMenuActions={cma}
                />
            </div>
        );
    }
}


class DataElementList extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        var { dataElements } = this.props;

        const cma = {
            delete: function (...args) {
                console.log('Delete', ...args);
            },
        };

        return (
            <div>
                <DataTable
                    columns={['name', 'shortName', 'code']}
                    rows={dataElements}
                    contextMenuActions={cma}
                />
            </div>
        );
    }
}
