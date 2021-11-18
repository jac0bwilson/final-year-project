import React, { useState, useEffect } from "react";

import { TextIcon, Icon } from "./icon";

import "./request.css";

/**
 * Creates a form to allow the user to provide the details for the request
 * @param {*} handleSubmit the function to pass the data back to the workflow
 * @param {*} handleEdit the function to update the saved data in the workflow
 * @param {*} handleDelete the function to delete the request in the workflow
 * @param {*} runSomeRequests the function to run the individual request
 * @param {string} url the URL to be displayed - "" by default
 * @param {string} method the HTTP method to be displayed - "GET" by default
 * @param {string} args the arguments to be sent to the endpoint - "" by default
 * @param {Object} response the response to the request if run from outside
 * @param {boolean} newInput whether the information should initialise in an editable state
 * @param {number} idx the index of the saved information in the list of requests (if saved)
 */
function Request({ handleSubmit, handleEdit, handleDelete, runSomeRequests, url = "", method = "get", args = "", response = {}, newInput = false, idx }) {
    const [urlError, setUrlError] = useState(false);
    const [argsError, setArgsError] = useState(false);
    const [editable, setEditable] = useState(newInput);
    const [selectedMethod, setMethod] = useState(method);
    const [savedArgs, setArgs] = useState(args);

    /**
     * Update method when component receives new values
     */
    useEffect(() => {
        setMethod(method);
    }, [method]);

    /**
     * Update arguments when component received new values
     */
    useEffect(() => {
        setArgs(args);
    }, [args]);

    /**
     * Create the test ID for the HTML feature in order to run unit tests
     * @param {string} name the name of the feature
     * @returns the test ID
     */
    const getTestId = (name) => {
        return name + "-" + (idx == null ? "main" : idx);
    };

    /**
     * Checks the current value of the URL field and sets the state to indicate if it is valid
     * @param {*} event the event caused by the field being edited
     */
    const validateURL = (event) => {
        let toCheck = event.target.value;

        if (toCheck.length > 0) { // prevents error being shown on empty strings
            try {
                new URL(toCheck);
            } catch (e) {
                setUrlError(true);
                return; // needs to be done to prevent falling to default case
            }
        }

        setUrlError(false);
    };

    /**
     * Checks the current value of the arguments field and sets the state to indicate if it is valid
     * @param {*} event the event caused by the field being edited
     */
    const validateArgs = (event) => {
        // TODO: when it comes to using saved values, perform the replacement, the do the validation on that
        let toCheck = event.target.value;

        if (toCheck.length > 0) {
            try {
                JSON.parse(toCheck);
            } catch (e) {
                setArgsError(true);
                return;
            }
        }

        setArgsError(false);
    };

    /**
     * Performs error checking, then submits the entered details
     * @param {*} event the event caused by the field being edited
     */
    const onSubmit = (event) => {
        event.preventDefault(); // prevents the values from being added to the URL

        if (!urlError && !argsError) {
            // if the arguments are a valid JSON string, replace it with a formatted version
            let tempArgs = event.target.elements.arguments.value;
            event.target.elements.arguments.value = tempArgs.length > 0 ? JSON.stringify(JSON.parse(tempArgs), null, 2) : "";

            if (newInput) { // if the item has just been created
                handleSubmit(event);
                setMethod("get");
                setArgs("");
            } else { // if an existing item has been rendered
                handleEdit(event, idx);
                setEditable(false);
            }
        }

        event.target.reset(); // clear the form after submission
    };

    /**
     * Handles the action when the edit button is pressed
     * @param {*} event the event caused by the edit button being pressed
     */
    const startEditing = (event) => {
        event.preventDefault();

        setEditable(true);
    };

    /**
     * Sets the cell to be non-editable and initiates the deletion
     */
    const onDelete = () => {
        setEditable(false);

        handleDelete(idx);
    };

    /**
     * Handles the action when the run individual button is pressed
     * @param {*} event the event caused by the run button being pressed
     */
    const runRequest = (event) => {
        event.preventDefault();

        runSomeRequests(idx, false);
    };

    /**
     * Handles the action when the run from here onwards button is pressed
     * @param {*} event the event caused by the run button being pressed
     */
    const runRequestOnwards = (event) => {
        event.preventDefault();

        runSomeRequests(idx, true);
    };

    const httpMethods = ["get", "post", "put", "delete"];

    /**
     * Creates the appropriate output based on the response to the request, either a formatted JSON,
     * a Bulma Hero card for an error, or a simple message if there is no response yet
     * @returns HTML output
     */
    const renderResponse = () => {
        if (response.status === 200) { // if request worked okay, display the data that was returned
            return (
                <pre data-testid={getTestId("response-data")}>
                    <code>
                        {JSON.stringify(response.data, null, 2)}
                    </code>
                </pre>
            );
        } else if (response.status >= 400 && response.status < 500) { // if error, use Bulma hero card to show code and description
            return (
                <section data-testid={getTestId("error")} className="hero is-danger">
                    <div className="hero-body">
                        <p className="title">
                            {response.status}
                        </p>
                        <p className="subtitle">
                            {response.statusText}
                        </p>
                    </div>
                </section>
            );
        } else {
            return (
                <p>
                    No response yet, try running the workflow!
                </p>
            )
        }
    };

    return (
        <div data-testid={getTestId("request")} className="request-container">
            <form onSubmit={onSubmit}>
                {/* URL and method */}
                <div className="field has-addons request-inputs">
                    <div className="control is-expanded" key={url}>
                        <input
                            name="url"
                            data-testid={getTestId("url")}
                            className="input is-link"
                            defaultValue={url}
                            placeholder="https://google.com/test"
                            disabled={!editable}
                            onChange={validateURL}
                        />
                    </div>

                    <div className="control select is-link">
                        <select name="method" data-testid={getTestId("method")} className="select" value={selectedMethod} disabled={!editable} onChange={(e) => setMethod(e.target.value)}>
                            {httpMethods.map((value) => {
                                return (
                                    <option value={value} key={value}>{value.toUpperCase()}</option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {(urlError && editable) &&
                    <div data-testid={getTestId("url-error")} className="notification is-danger">
                        The provided URL is not valid, please correct it.
                    </div>
                } {/* only shown when state indicates an error in the URL */}

                {/* Arguments and response (if applicable) */}
                <div className="columns field">
                    <div className="column box">
                        <textarea
                            name="arguments"
                            data-testid={getTestId("arguments")}
                            className="textarea has-fixed-size"
                            defaultValue={savedArgs}
                            placeholder="{ ... }"
                            disabled={!editable}
                            onChange={validateArgs}
                        />
                        {(argsError && editable) &&
                            <div data-testid={getTestId("arguments-error")} className="notification is-danger">
                                The provided arguments are not valid, please correct them.
                            </div>
                        }
                    </div>
                    {!newInput &&
                        <div data-testid={getTestId("response")} className="column box">{renderResponse()}</div>
                    }
                </div>

                {/* Buttons */}
                <nav className="level">
                    <div className="level-left">
                        {!editable &&
                            <div className="level-item">
                                <button data-testid={getTestId("run-individual")} className="button is-primary" type="button" onClick={runRequest}>
                                    {idx === 0
                                        ? <TextIcon text="Run Individual" iconName="fa-angle-down" />
                                        : <Icon iconName="fa-angle-down" />
                                    }
                                </button>
                            </div>
                        }
                        {!editable &&
                            <div className="level-item">
                                <button data-testid={getTestId("run-onwards")} className="button is-primary" type="button" onClick={runRequestOnwards}>
                                    {idx === 0
                                        ? <TextIcon text="Run from Here Onwards" iconName="fa-angle-double-down" />
                                        : <Icon iconName="fa-angle-double-down" />
                                    }
                                </button>
                            </div>
                        }
                    </div>

                    <div className="level-right">
                        <div className="level-item control">
                            {editable
                                ? <button data-testid={getTestId("done")} className="button is-success" type="submit" disabled={urlError || argsError}>
                                    <TextIcon text="Done" iconName="fa-check" />
                                </button>
                                : <button data-testid={getTestId("edit")} className="button is-warning" type="button" onClick={startEditing}>
                                    <TextIcon text="Edit" iconName="fa-edit" />
                                </button>
                            } {/* if editable - present submit button, if not - show the edit button */}
                        </div>
                        {(editable && !newInput) &&
                            <div className="level-item control">
                                <button data-testid={getTestId("delete")} className="button is-danger" type="button" onClick={onDelete}>
                                    <TextIcon text="Delete" iconName="fa-trash-alt" />
                                </button>
                            </div>
                        } {/* if editable and not the new input box - allow deleting the item */}
                    </div>
                </nav>
            </form>
        </div>
    );
}

export { Request };