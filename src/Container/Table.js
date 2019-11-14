import _ from 'lodash';
import Element from '../Element';
import { getName } from '../utils';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Table = ({
    config: {
        name: containerName = '',
        elements,
        tableHeaderClass = '',
        tableContainerClass = 'table-responsive',
        tableBodyClass = '',
        tableClass = 'table table-bordered flutter-editable-grid',
    }
}) => {
    return (
        <div className={ tableContainerClass }>
            <table className={ tableClass } style={{ width: tableWidth }}>
                <thead className={ tableHeaderClass } >
                    <tr>
                        { isObject === false && isSortable && <th/>}
                        { _.map(elements, ({ label, width }, key) =>
                            <th key={ key } style={{ width: width }}>{ label }</th>
                        ) }
                        { isObject === false && !!buttons && !!buttons.remove && <th></th> }
                    </tr>
                </thead>
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

Fieldset.propTypes = {
    config: PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
        elements: PropTypes.object.isRequired,
        tableContainerClass: PropTypes.string,
        tableClass: PropTypes.string,
        tableBodyClass: PropTypes.string,
        tableHeaderClass: PropTypes.string,
    })
}

export default Table;
