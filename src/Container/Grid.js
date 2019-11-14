import _ from 'lodash';
import Element from '../Element';
import { getName } from '../utils';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { joinNames } from '../utils';

const Grid = ({
    config: {
        name: fieldArrayName,
        elements,
        showTableHeader = true,
        tableHeaderClass = '',
        tableContainerClass = 'table-responsive',
        tableBodyClass = '',
        tableClass = 'table table-bordered flutter-editable-grid',
    }
}) => {
    if (Array.isArray(elements)) {
        const { values, errors, touched, setFieldValue, initialValues } = formik;
        const arrayValues = _.get(values, fieldArrayName);
        
        const tableWidth = _.map(elements, 'width').reduce(( sum, num ) => sum + num, 50) || '100%';
        return (
            <div className={ tableContainerClass }>
                <table className={ tableClass } style={{ width: tableWidth }}>
                    { showTableHeader && <thead className={ tableHeaderClass } >
                        <tr>
                            { _.map(elements, ({ label, width }, key) =>
                                <th key={ key } style={{ width: width }}>{ label }</th>
                            ) }
                        </tr>
                    </thead> }
                    <tbody className={ tableBodyClass }>
                    { _.map(arrayValues, ( value, index ) => (
                        <tr key={ index }>
                            { _.map(elements, ({ name, label, ...rest }, key) => (
                                <td key={ key }>
                                    <Element config={{ ...rest, name: joinNames(fieldArrayName, rowIndex, name) }} />
                                </td>
                            ))}
                        </tr>
                        ))}
                    <tr>
                    </tr>
                </tbody>
                </table>
            </div>
        );
    }
    return (
        <div className={ tableContainerClass }>
            <table className={ tableClass } style={{ width: tableWidth }}>
                { showTableHeader && <thead className={ tableHeaderClass } >
                    <tr>
                        { _.map(elements, ({ label, width }, key) =>
                            <th key={ key } style={{ width: width }}>{ label }</th>
                        ) }
                    </tr>
                </thead> }
                <tbody className={ tableBodyClass }>
                    <tr>
                    { _.map(elements, ({ name, ...config }, key) => (
                        <td><Element
                            key={ key }
                            config={{ ...config, name: getName(config.type, name, containerName) }}
                        /></td>
                    ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

Grid.propTypes = {
    config: PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
        elements: PropTypes.object.isRequired,
        showTableHeader: PropTypes.bool,
        tableContainerClass: PropTypes.string,
        tableClass: PropTypes.string,
        tableBodyClass: PropTypes.string,
        tableHeaderClass: PropTypes.string,
    })
}

export default Grid;
