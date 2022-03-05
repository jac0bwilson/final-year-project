import React, { useState } from "react";

import { TextIconButton } from "./icon";

import { extractNestedResponseData } from "../utilities";

/**
 * A separate component for saving values, from responses or on an impromptu basis
 * @param {*} handleSave the function passed in to provide custom functionality on saving
 * @param {*} checkForVariableConflicts the function to ensure that variable names can not be duplicates
 * @param {Object} response the data source to used for value extraction (if necessary)
 * @param {number} idx the index of the request (if used in that content) for generating test IDs
 * @returns 
 */
function Save({ handleSave, checkForVariableConflicts, response = {}, idx }) {
    const [variableError, setVarError] = useState(true);

    /**
     * Create the test ID for the HTML feature in order to run unit tests
     * @param {string} name the name of the feature
     * @returns the test ID
     */
    const getTestId = (name) => {
        return name + "-" + (idx == null ? "main" : idx);
    };

    /**
     * Flatten an object and get the list of it's keys
     * @param {Object} object the object to obtain the keys for
     * @param {string} stub the base of the key to construct
     * @returns the list of keys at all levels of the object
     */
    const getResponseKeys = (object, stub = "") => {
        let keys = [];

        for (let key in object) { // iterate through response data
            let next;

            if (stub === "") {
                next = key;
            } else {
                next = stub + "/" + key;
            }

            keys.push(next);

            if (typeof object[key] === "object") { // if key holds an object, recurse
                let these = getResponseKeys(object[key], next);

                keys = keys.concat(these);
            }
        }

        return keys;
    };

    /**
     * Checks the current value of the name to assign to a saved value and sets the state to indicate if it is valid
     * @param {*} event the event caused by the field being edited
     */
    const validateVariableName = (event) => {
        let toCheck = event.target.value;

        let matches = toCheck.match(/^[A-Za-z0-9]+$/);

        if (!matches || checkForVariableConflicts(toCheck)) {
            setVarError(true);
            return;
        }

        setVarError(false);
    };

    const onValueSave = (event) => {
        event.preventDefault();

        const config = idx != null ? {
            name: event.target.elements.name.value,
            data: extractNestedResponseData(event.target.elements.target.value, response),
            key: event.target.elements.target.value,
            availableFrom: idx
        }
        : {
            name: event.target.elements.name.value,
            data: event.target.elements.data.value,
            key: "",
            availableFrom: 0
        };

        handleSave(config);

        setVarError(true);
        event.target.reset();
    }

    return (
        <form onSubmit={onValueSave}>
            <div className="field is-horizontal">
                <div className={"field-label" + (idx == null ? " is-small" : "")}>
                    <label className="label">Value to Save:</label>
                </div>
                <div className="field-body">
                    <div className="field">
                        {idx != null
                            ? <div className="control select is-fullwidth">
                                <select name="target" data-testid={getTestId("save-value-select")}>
                                    {getResponseKeys(response.data).map((value) => {
                                        return (
                                            <option value={value} key={value}>{value}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            : <div className="control is-fullwidth">
                                <input
                                    name="data"
                                    data-testid={getTestId("save-value-data")}
                                    className="input"
                                    type="text"
                                    placeholder="Enter some data to be stored"
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="field is-horizontal">
                <div className={"field-label" + (idx == null ? " is-small" : "")}>
                    <label className="label">Assigned Name:</label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <div className="control">
                            <input
                                name="name"
                                data-testid={getTestId("save-value-name")}
                                className={"input" + (variableError ? " is-danger" : "")}
                                type="text"
                                placeholder="Enter a name to reference this value by"
                                onChange={validateVariableName}
                            />
                            {variableError &&
                                <p data-testid={getTestId("variable-error")} className="help is-danger">
                                    Please enter an unused, alphanumeric variable name.
                                </p>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <nav className="level">
                <div className="level-left" />
                <div className="level-right">
                    <TextIconButton testId={getTestId("save-value")} buttonClass="is-success" type="submit" disabled={variableError} text="Done" icon="fa-check" />
                </div>
            </nav>
        </form>
    );
};

export { Save };