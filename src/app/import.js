import React, { Component } from 'react';
import FileInput from 'react-input-file';
import { FlatButton, RaisedButton, Card, CardText } from 'material-ui';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import 'd2-ui/scss/DataTable.scss';

import { dhisRead, dhisWrite } from './dhis';

export class ImportData extends Component {

    constructor(props) {
        super(props);
        this.state = {
          filename: null,
          weights: [],
          imported: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.renderFile = this.renderFile.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    sendData() {
        var {user, orgs, programs, elements} = this.props;
        
        var dhisPayload = {"events" : []};
       this.state.weights.map((weight) => {
            var currEvent = {"program":programs[0].id, "orgUnit":orgs[0].id, "eventDate":weight.date, 
                    "status":"COMPLETED", "storedBy":"admin",
                    "dataValues": [{"dataElement": elements[0].id, "value": weight.value}]
            }; 
            dhisPayload.events.push(currEvent);  
        }) 

        dhisWrite('events.json', JSON.stringify(dhisPayload))
        .then(res => {
            this.setState({imported: true, weights: []});
        });
        
    }

    renderFile(theFile) {
        return (e) => {
            var weightData = [];
            var patientData = JSON.parse(e.target.result);
            patientData.entry.map((event) => {
                if (event.resource.code && event.resource.code.text && event.resource.code.text.toLowerCase().includes('weight')) { 
                    var eventDate;
                    (event.resource.effectiveDateTime) ? eventDate = event.resource.effectiveDateTime : 
                        (event.resource.issued) ? eventDate = event.resource.issued.value.split('T')[0] :
                        eventDate = 'XXXX-XX-XXX';

                    weightData.push({value: event.resource.valueQuantity.value, date: eventDate});
                }
            })

            this.setState({weights : weightData});
        };
    }

    handleChange(files) {
        
        this.setState({filename: files[0].name});
        var file = files[0];
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = this.renderFile(file);

        // Read in the image file as a data URL.
        reader.readAsText(file);

        this.setState({imported: false});
    }

    render() {
        var data = this.state.data;

        return (
            <div className="main-content">
                <div className="headerlabel">Import FHIR Data</div>
                <Card>
                    <CardText>
                    { this.state.filename ? (<div>Current selected file: {this.state.filename}</div>) : <div>No file selected</div> }
                    <form>
                        <input type="file" onChange={ (e) => this.handleChange(e.target.files) } />
                    </form>
                    { (this.state.weights.length > 0) && !this.state.imported && (<div>Weight measurements: 
                        <ul>
                            {this.state.weights.map((data) =>
                            <li>{data.value} on {data.date}</li>
                            )}
                        </ul>
                    <button className="dhisbutton" onClick={this.sendData}>Send to DHIS</button>
                    </div>)}
                    { (this.state.imported) && (<div>Data imported</div>)}
                    </CardText>
                </Card>
                
            </div>
        )
    }
}