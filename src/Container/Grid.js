import _ from 'lodash';
import Element from '../Element';
import { getName, joinNames } from '../utils';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Grid = ({
                  config: {
                      name: containerName = '',
                      elements,
                      showTableHeader = true,
                      tableHeaderClass = '',
                      tableContainerClass = 'table-responsive',
                      tableBodyClass = '',
                      tableClass = 'table table-bordered flutter-editable-grid',
                  }, formik
              }) => {
    const tableWidth = _.map(elements, 'width').reduce(( sum, num ) => sum + num, 50) || '100%';
    const { values } = formik;
    if (Array.isArray(elements)) {
        const fieldValues = _.get(values, containerName);
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
                    { _.map(fieldValues, ( value, index ) => (
                        <tr key={ index }>
                            { _.map(elements, ({ name, label, labelClass,...rest }, key) => (
                                <td key={ key }>
                                    <Element config={{ ...rest, name: joinNames(containerName, index, name) }} />
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
                    { _.map(elements, ({ name, label, labelClass, ...config }, key) => (
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
};

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
};

export default Grid;
