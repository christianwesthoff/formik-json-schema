import _ from 'lodash';
import React from 'react';
import Label from './Label';
import ErrorMessage, { hasError } from './ErrorMessage';

const Textarea = ({ config, formikProps, submitCountToValidate }) => {
    const { name, label, type, attributes, rows } = config;
    const { values, handleChange } = formikProps;
    const error = hasError(name, submitCountToValidate, formikProps);

    return (
        <div className="form-group">
            <Label htmlFor={ name }>{ label }</Label>
            <textarea
                id={ name }
                name={ name }
                className={ 'form-control ' + ( error ? 'is-invalid' : '' ) }
                value={ _.get(values, name, '') }
                onChange={ handleChange }
                { ...attributes } />
            <ErrorMessage name={ name } submitCountToValidate={ submitCountToValidate } />
        </div>
    );
}

export default Textarea;
