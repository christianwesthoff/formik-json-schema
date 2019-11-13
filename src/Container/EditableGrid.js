import _ from 'lodash';
import React from 'react';
import Element from '../Element';
import PropTypes from 'prop-types';
import { FieldArray } from 'formik';
import { joinNames } from '../utils';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

const onSortEnd = ( move, { oldIndex, newIndex } ) => move(oldIndex, newIndex);
const SortableItem = SortableElement((props) => renderTableRow(props));
const SortableTableBody = SortableContainer((props) => renderTableBody(props));
const SortableRowHandle = SortableHandle((props) => renderSortableHandle(props));

const renderTableBody = ({ isObject = false, isSortable, initTable, hasValue, arrayValues, ...rowProps }) => (
    <tbody>
        { hasValue ? _.map(arrayValues, ( value, index ) =>
            isObject === false && isSortable
                ? <SortableItem key={ index+1 } index={ index } rowIndex={ index } value={ value } isSortable={ isSortable } { ...rowProps } />
                : renderTableRow({ ...rowProps, index: index, rowIndex: index, value, isObject })
        ) : null }
    </tbody>
);

const renderTableRow = ({ fieldArrayName, elements, arrayActions, buttonDuplicateClass, buttonRemoveClass, iconSortableHandle, rowIndex, buttons, isSortable, value = {}, isObject = false }) => (
    <tr key={ rowIndex }>
        { isObject === false && isSortable && <SortableRowHandle iconSortableHandle={ iconSortableHandle }/> }
        { _.map(elements, ({ name, label, ...rest }, key) => (
            <td key={ key }>
                <Element config={{ ...rest, name: joinNames(fieldArrayName, rowIndex, name) }} />
            </td>
        ))}
        { isObject === false && !!buttons && (
            <td style={{ minWidth: 50 }}>
                { !!buttons.remove && (
                    _.isFunction(buttons.remove)
                        ? buttons.remove(arrayActions, rowIndex, value)
                        : (
                            <button
                                type="button"
                                className={ buttonRemoveClass }
                                onClick={ arrayActions.remove.bind(this, rowIndex) }>{ buttons.remove }
                            </button>
                        )
                    )
                }
                { !!buttons.duplicate && (
                    _.isFunction(buttons.duplicate)
                        ? buttons.duplicate(arrayActions, value, rowIndex)
                        : (
                            <button
                                type="button"
                                className={ buttonDuplicateClass }
                                onClick={ arrayActions.push.bind(this, value) }>{ buttons.duplicate }
                            </button>
                        )
                    )
                }
            </td>
        )}
    </tr>
);

const renderSortableHandle = ( { iconSortableHandle } ) => <td><i className={ iconSortableHandle }></i></td>

const EditableGrid = ({
    config: {
        name: fieldArrayName,
        isObject = false,
        elements,
        buttons,
        initTable = true,
        isSortable = true,
        tableHeaderClass = '',
        tableContainerClass = 'table-responsive',
        tableClass = 'table table-bordered flutter-editable-grid',
        buttonAddClass = 'btn btn-secondary',
        buttonDuplicateClass = 'btn duplicate',
        buttonCopyClass = 'btn duplicate',
        iconSortableHandle = 'fas fa-grip-vertical'
    },
    formik
}) => {
    const { values, errors, touched, setFieldValue } = formik;
    const arrayFields = _.mapValues(_.assign({}, elements), () => '');
    const arrayValues = _.get(values, fieldArrayName);
    const hasValue = _.size(arrayValues) > 0;

    if (initTable && !hasValue) {
        setFieldValue(fieldArrayName, [ arrayFields ]);
        return (null);
    }

    const tableWidth = _.map(elements, 'width').reduce(( sum, num ) => sum + num, 50) || '100%';
    const additionalColumnCount = isSortable ? 2 : 1;

    return (
        <FieldArray
            name={ fieldArrayName }
            render={( arrayActions ) => {
                const bodyProps = {
                    arrayValues, hasValue, elements, fieldArrayName, arrayActions, buttons, isSortable, isObject, buttonDuplicateClass, buttonCopyClass, iconSortableHandle
                };
                return (
                    <div className={ tableContainerClass }>
                        <table className={ tableClass } style={{ width: tableWidth }}>
                            <thead className={ tableHeaderClass } >
                                <tr>
                                    { isObject === false && isSortable && <th></th>}
                                    { _.map(elements, ({ label, width }, key) =>
                                        <th key={ key } style={{ width: width }}>{ label }</th>
                                    ) }
                                    { isObject === false && !!buttons && !!buttons.remove && <th></th> }
                                </tr>
                            </thead>
                            { isObject === false && isSortable
                                ? <SortableTableBody
                                    distance={ 10 }
                                    onSortEnd={ onSortEnd.bind(this, arrayActions.move) }
                                    useDragHandle={ true }
                                    { ...bodyProps }
                                />
                                : renderTableBody(bodyProps)
                            }
                            <tfoot>
                                <tr>
                                    { isObject === false && !!buttons && !!buttons.add &&
                                        <td colSpan={ _.size(elements) + additionalColumnCount }>
                                            { _.isFunction(buttons.add)
                                                ? buttons.add(arrayActions, arrayFields, rowIndex)
                                                : (
                                                    <button
                                                        type="button"
                                                        className={ buttonAddClass }
                                                        onClick={ arrayActions.push.bind(this, arrayFields) }>{ buttons.add }
                                                    </button>
                                                )
                                            }
                                        </td>
                                    }
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )
        }} />
    );
}

EditableGrid.propTypes = {
    config: PropTypes.shape({
        name: PropTypes.string.isRequired,
        elements: PropTypes.object.isRequired,
        buttons: PropTypes.exact({
            add: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func
            ]),
            remove: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func
            ]),
            duplicate: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func
            ]),
        }),
        isSortable: PropTypes.bool,
        tableContainerClass: PropTypes.string,
        tableClass: PropTypes.string,
        tableHeaderClass: PropTypes.string,
        buttonAddClass: PropTypes.string,
        buttonDuplicateClass: PropTypes.string,
        buttonCopyClass: PropTypes.string,
        iconSortableHandle: PropTypes.string
    })
}

export default EditableGrid;
