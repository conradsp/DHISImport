import React, { Component } from 'react';

import { dhisRead, dhisWrite } from './dhis';

export class ViewData extends Component {

    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          data: [],
          page: 1
        };
      }

    componentDidMount() {
        dhisRead('metadata.json?assumeTrue=false&dataElements=true')
        .then(json => {
            this.setState({ loading: false, data: json.dataElements });
        })
    }

    render() {
        var {elements} = this.state;
        console.log(elements);
        
        return (
            <div className="main-content">
            { this.state.loading ? (
                <div>Loading data...</div>
            ) : elements ? (
                <DataElementList
                    list={elements}
                    
                />
            ) : (<div>No data elements defined</div>)}
            </div>
        )
    }

}


// The data element list component
class DataElementList extends Component {

    constructor(props) {
        super(props);
    }
  
  render() {
      var { list } = this.props;
      return (
            <div>
            <div>Showing {list.length} data elements:</div>
            <ul>{list.map(de => <DataElement element={de} key={de.id}/>)}</ul>
            </div>
        );
    }
}


// The data element component, which just renders the name of the data element as a link
class DataElement extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const dataElement = this.props.element;

        return (<div><a href={`${dataElement.href}.json`}>{dataElement.displayName}</a></div>);
    }
}