import TextField from 'd2-ui/lib/form-fields/TextField.js';
import CheckBox from 'd2-ui/lib/form-fields/CheckBox.component.js';
import SelectField from 'd2-ui/lib/form-fields/DropDown.component.js';
import DatePicker from 'd2-ui/lib/form-fields/DatePicker.component.js';

export function orgFields(parent) {
    return [
        {
            name: 'code',
            value: parent.state.newOrg.code,
            component: TextField,
            props: {
                floatingLabelText: 'Org Unit Code',
                style: { width: '100%' },
                changeEvent: 'onBlur',
            },
        },
        {
            name: 'name',
            value: parent.state.newOrg.name,
            component: TextField,
            props: {
                floatingLabelText: 'Org Name',
                style: { width: '100%' },
                // multiLine: true,
                changeEvent: 'onBlur',
            },
        },
        {
            name: 'shortName',
            value: parent.state.newOrg.shortName,
            component: TextField,
            props: {
                floatingLabelText: 'Org Short Name',
                style: { width: '100%' },
                // multiLine: true,
                changeEvent: 'onBlur',
            },
        },
        {
            name: 'openingDate',
            value: parent.state.newOrg.openDate ? parent.state.newOrg.openDate : new Date(),
            component: DatePicker,
            props: {
                floatingLabelText: 'Org Opening Date',
                dateFormat: 'yyyy-MM-dd',
                onChange: (e) => {
                    parent.onUpdateOrgField('openingDate', new Date(e.target.value).toISOString().split('T')[0]);
                },
                allowFuture: false,
            },
        }
    ]
}

export function elementFields(parent) {
    return [
        {
            name: 'code',
            value: parent.state.newElement.code,
            component: TextField,
            props: {
                floatingLabelText: 'Data Element Code',
                style: { width: '100%' },
                changeEvent: 'onBlur',
            },
        },
        {
            name: 'name',
            value: parent.state.newElement.name,
            component: TextField,
            props: {
                floatingLabelText: 'Data Element Name',
                style: { width: '100%' },
                // multiLine: true,
                changeEvent: 'onBlur',
            },
        },
        {
            name: 'shortName',
            value: parent.state.newElement.shortName,
            component: TextField,
            props: {
                floatingLabelText: 'Data Element Short Name',
                style: { width: '100%' },
                // multiLine: true,
                changeEvent: 'onBlur',
            },
        },
        {
            name: 'aggregationType',
            value: parent.state.newElement.aggregationType,
            component: SelectField,
            props: {
                floatingLabelText: 'Aggregation Type',
                menuItems: [{ id:'NONE', displayName: 'NONE' }, { id: 'SUM', displayName: 'SUM' }, { id: 'AVERAGE', displayName: 'AVERAGE' }, { id: 'COUNT', displayName: 'COUNT' }],
                includeEmpty: false,
                emptyLabel: 'No Options',
            },
        },
        {
            name: 'valueType',
            value: parent.state.newElement.valueType,
            component: SelectField,
            props: {
                floatingLabelText: 'Value Type',
                menuItems: [{ id: 'NUMBER', displayName: 'NUMBER' }, { id: 'TEXT', displayName: 'TEXT' },{ id: 'BOOLEAN', displayName: 'BOOLEAN' },{ id: 'DATE', displayName: 'DATE' }],
                includeEmpty: false,
                emptyLabel: 'No Options',
            },
        }
    ]
}
