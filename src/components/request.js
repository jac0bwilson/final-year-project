import React, { useState, useEffect } from "react";

import isURL from "validator/lib/isURL";

import { TextIconButton } from "./icon";
import { Modal } from "./modal";
import { Save } from "./save";

import { processSavedValuesJSON, processSavedValuesURL, customFormatJSON } from "../utilities";

import "./request.css";

/**
 * Creates the input and also the containers for submitted data, as well as associated actions
 * @param {*} handleSubmit the function to pass the data back to the workflow
 * @param {*} handleEdit the function to update the saved data in the workflow
 * @param {*} handleDelete the function to delete the request in the workflow
 * @param {*} handleSave the function to save a value out of an executed request
 * @param {*} handleInsert the function to insert a new request after the current one
 * @param {*} runSomeRequests the function to run the individual request
 * @param {*} checkForVariableConflicts the function to check that a variable name is not in use
 * @param {string} url the URL to be displayed - "" by default
 * @param {string} method the HTTP method to be displayed - "GET" by default
 * @param {string} args the arguments to be sent to the endpoint - "" by default
 * @param {string} headers the headers to use in the request - "" by default
 * @param {Object} response the response to the request if run from outside
 * @param {Object} saved the available saved values for this request
 * @param {boolean} newInput whether the information should initialise in an editable state
 * @param {number} idx the index of the saved information in the list of requests (if saved)
 */
function Request({ handleSubmit, handleEdit, handleDelete, handleSave, handleInsert, runSomeRequests, checkForVariableConflicts, url = "", method = "get", args = "", headers = "", response = {}, saved, newInput = false, idx }) {
    const [urlError, setUrlError] = useState(false);
    const [insecureURL, setInsecure] = useState(url.length > 0 ? !processSavedValuesURL(url, saved).startsWith("https") : false);
    const [argsError, setArgsError] = useState(false);
    const [headerError, setHeaderError] = useState(false);
    const [editable, setEditable] = useState(newInput);
    const [selectedMethod, setMethod] = useState(method);
    const [savedArgs, setArgs] = useState(args);
    const [savedHeaders, setHeaders] = useState(headers);
    const [displaySaving, setDisplaySaving] = useState(false);
    const [displayPayload, setDisplayPayload] = useState(true);

    /**
     * Update method when component receives new values
     */
    useEffect(() => {
        setMethod(method);
    }, [method]);

    /**
     * Update arguments when component receives new values
     */
    useEffect(() => {
        setArgs(args);
    }, [args]);

    /**
     * Update headers when component receives new values
     */
    useEffect(() => {
        setHeaders(headers);
    }, [headers]);

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
     * @param {Object} event the event caused by the field being edited
     */
    const validateURL = (event) => {
        let toCheck = processSavedValuesURL(event.target.value, saved);

        if (toCheck.length > 0) { // prevents error being shown on empty strings
            setInsecure(!toCheck.startsWith("https"));

            let options = { protocols: ["http", "https"], require_protocol: true };
            let valid = isURL(toCheck, options);

            if (!valid) { // special case handling for localhost
                try {
                    let tester = new URL(toCheck);

                    if (["http", "https"].includes(tester.protocol.slice(0, -1)) && tester.hostname === "localhost") {
                        valid = true;
                    }
                } catch (e) {
                    valid = false;
                }
            }

            setUrlError(!valid);
            return;
        }


        setUrlError(false);
    };

    /**
     * Checks the current value of the arguments/headers field and sets the state to indicate if it is valid
     * @param {Object} event the event caused by the field being edited
     */
    const validateArgs = (event) => {
        const toCheck = processSavedValuesJSON(event.target.value, saved); // apply the saved values and then do the validation
        const name = event.target.name;

        if (toCheck.length > 0) {
            try {
                JSON.parse(toCheck);
            } catch (e) {
                if (name === "arguments") {
                    setArgsError(true);
                } else if (name === "headers") {
                    setHeaderError(true);
                }

                return;
            }
        }

        if (name === "arguments") {
            setArgsError(false);
        } else if (name === "headers") {
            setHeaderError(false);
        }
    };

    /**
     * Performs error checking, then submits the entered details
     * @param {Object} event the event caused by the field being edited
     */
    const onSubmit = (event) => {
        event.preventDefault(); // prevents the values from being added to the URL

        if (!urlError && !argsError) {
            // if the arguments are a valid JSON string, replace it with a formatted version
            const tempArgs = event.target.elements.arguments.value;
            const tempHeaders = event.target.elements.headers.value;
            event.target.elements.arguments.value = tempArgs.length > 0 ? customFormatJSON(tempArgs) : "";
            event.target.elements.headers.value = tempHeaders.length > 0 ? customFormatJSON(tempHeaders) : "";

            if (newInput) { // if the item has just been created
                handleSubmit(event);
                setMethod("get");
                setArgs("");
                setHeaders("");
                setInsecure(false);
            } else { // if an existing item has been rendered
                handleEdit(event, idx);
                setEditable(false);
            }
        }

        event.target.reset(); // clear the form after submission
    };

    /**
     * Handles the action when the edit button is pressed
     * @param {Object} event the event caused by the edit button being pressed
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
     * Inserts a request below the current one
     */
    const onInsert = () => {
        handleInsert(idx);
    };

    /**
     * Toggle the value saving modal
     */
    const toggleSaving = () => {
        setDisplaySaving(previous => {
            return !previous;
        });
    };

    /**
     * Toggle the display of payloads and headers
     */
    const toggleTabs = () => {
        setDisplayPayload(previous => {
            return !previous;
        });
    };

    /**
     * Handles the action when the run individual button is pressed
     * @param {Object} event the event caused by the run button being pressed
     */
    const runRequest = (event) => {
        event.preventDefault();

        runSomeRequests(idx, false);
    };

    /**
     * Handles the action when the run from here onwards button is pressed
     * @param {Object} event the event caused by the run button being pressed
     */
    const runRequestOnwards = (event) => {
        event.preventDefault();

        runSomeRequests(idx, true);
    };

    /**
     * Wrapper to pass saving from response functionality and closing of modal
     * @param {Object} config the information to be stored in saved values
     */
    const savingWrapper = (config) => {
        handleSave(config);

        toggleSaving();
    };

    const httpMethods = {
        get: {
            requestHasBody: false,
            responseHasBody: true,
        },
        head: {
            requestHasBody: false,
            responseHasBody: false
        },
        post: {
            requestHasBody: true,
            responseHasBody: true,
        },
        put: {
            requestHasBody: true,
            responseHasBody: false
        },
        delete: {
            requestHasBody: true,
            responseHasBody: true,
        },
        options: {
            requestHasBody: false,
            responseHasBody: false
        },
        patch: {
            requestHasBody: true,
            responseHasBody: true,
        }
        // "connect" & "trace" are not implemented in axios
    };

    /**
     * Creates the appropriate output based on the response to the request, either a formatted JSON,
     * or a Bulma Hero card
     * @returns HTML output
     */
    const renderResponse = () => {
        if (response.status === 200) { // if request worked okay, display the data that was returned
            return (
                <pre data-testid={getTestId("response-data")}>
                    <code data-testid={getTestId("response-data-text")}>
                        {JSON.stringify(displayPayload ? response.data : response.headers, null, 2)}
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
            return ( // if not run yet, use Bulma hero card to say so
                <section className="hero">
                    <div className="hero-body">
                        <p className="title">
                            No response yet
                        </p>
                        <p className="subtitle">
                            Try running the workflow
                        </p>
                    </div>
                </section>
            )
        }
    };

    return (
        <div data-testid={getTestId("request")} className="request-container">
            <form onSubmit={onSubmit}>
                {/* URL and method */}
                <div className="field has-addons">
                    <div className="control is-expanded" key={url}>
                        <input
                            name="url"
                            data-testid={getTestId("url")}
                            className={"input" + (urlError ? " is-danger" : " " + (insecureURL ? "is-warning" : "is-link"))}
                            defaultValue={url}
                            placeholder="Enter a URL to make a request to"
                            disabled={!editable}
                            onChange={validateURL}
                            spellCheck="false"
                        />
                        {(urlError && editable) &&
                            <p data-testid={getTestId("url-error")} className="help is-danger">
                                The provided URL is not valid, please correct it.
                            </p>
                        } {/* only shown when state indicates an error in the URL */}
                        {(insecureURL && !urlError) &&
                            <p data-testid={getTestId("url-insecure")} className="help has-text-warning-dark">
                                This URL is insecure, data sent to it is not encrypted in transit.
                            </p>
                        }
                    </div>

                    <div className="control select is-link">
                        <select name="method" data-testid={getTestId("method")} className="select" value={selectedMethod} disabled={!editable} onChange={(e) => setMethod(e.target.value)}>
                            {Object.keys(httpMethods).map((value) => {
                                return (
                                    <option value={value} key={value}>{value.toUpperCase()}</option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {/* Toggle between payload and headers */}
                <div className="field has-addons has-addons-centered">
                    <div className="control">
                        <button className={"toggle button is-family-monospace" + (displayPayload ? " is-link" : "")} data-testid={getTestId("toggle-payload")} type="button" disabled={displayPayload} onClick={toggleTabs}>
                            Payload
                        </button>
                    </div>
                    <div className="control">
                        <button className={"toggle button is-family-monospace" + (!displayPayload ? " is-link" : "")} data-testid={getTestId("toggle-headers")} type="button" disabled={!displayPayload} onClick={toggleTabs}>
                            Headers
                        </button>
                    </div>
                </div>

                {/* Arguments and response (if applicable) */}
                <div className="columns field">
                    <div className={"json-input-container column box" + (!newInput ? " is-half" : "")}>
                        <textarea
                            name="arguments"
                            data-testid={getTestId("arguments")}
                            className={"json-input textarea has-fixed-size" + (argsError ? " is-danger" : "") + (!displayPayload ? " hidden" : "")}
                            defaultValue={savedArgs}
                            placeholder="{ ... }"
                            readOnly={!editable || !httpMethods[selectedMethod].requestHasBody}
                            onChange={validateArgs}
                            spellCheck="false"
                        />
                        <textarea
                            name="headers"
                            data-testid={getTestId("headers")}
                            className={"json-input textarea has-fixed-size" + (headerError ? " is-danger" : "") + (displayPayload ? " hidden" : "")}
                            defaultValue={savedHeaders}
                            placeholder="{ ... }"
                            readOnly={!editable}
                            onChange={validateArgs}
                            spellCheck="false"
                        />

                        {(argsError && editable) &&
                            <p data-testid={getTestId("arguments-error")} className="help is-danger">
                                The provided arguments are invalid, please correct them.
                            </p>
                        }

                        {(headerError && editable) &&
                            <p data-testid={getTestId("arguments-error")} className="help is-danger">
                                The provided headers are invalid, please correct them.
                            </p>
                        }
                    </div>
                    {!newInput &&
                        <div data-testid={getTestId("response")} className="column is-half box">{renderResponse()}</div>
                    }
                </div>

                {/* Buttons */}
                <nav className="level">
                    <div className="level-left">
                        {(!editable && idx != null) &&
                            <div className="level-item">
                                <TextIconButton testId={getTestId("insert")} buttonClass="is-primary" type="button" onClick={onInsert} text="Insert Request Below" icon="fa-plus" />
                            </div>
                        }
                        {!editable &&
                            <div className="level-item">
                                <TextIconButton testId={getTestId("run-individual")} buttonClass="is-primary" type="button" onClick={runRequest} text="Run Individual" icon="fa-angle-down" />
                            </div>
                        }
                        {!editable &&
                            <div className="level-item">
                                <TextIconButton testId={getTestId("run-onwards")} buttonClass="is-primary" type="button" onClick={runRequestOnwards} text="Run From Here Onwards" icon="fa-angle-double-down" />
                            </div>
                        }
                        {(!editable && response.data) &&
                            <div className="level-item">
                                <TextIconButton testId={getTestId("open-value-saving")} buttonClass="is-info" type="button" onClick={toggleSaving} text="Save Values" icon="fa-save" />
                            </div>
                        } {/* only show if not editing and response.data is present - indicating a successful request */}
                    </div>

                    <div className="level-right">
                        <div className="level-item control">
                            {editable
                                ? <TextIconButton testId={getTestId("done")} buttonClass="is-success" type="submit" disabled={urlError || argsError} text="Done" icon="fa-check" />
                                : <TextIconButton testId={getTestId("edit")} buttonClass="is-warning" onClick={startEditing} text="Edit" icon="fa-edit" />
                            } {/* if editable - present submit button, if not - show the edit button */}
                        </div>
                        {(editable && !newInput) &&
                            <div className="level-item control">
                                <TextIconButton testId={getTestId("delete")} buttonClass="is-danger" onClick={onDelete} text="Delete" icon="fa-trash-alt" />
                            </div>
                        } {/* if editable and not the new input box - allow deleting the item */}
                    </div>
                </nav>
            </form>

            {/* Saving Values Interface */}
            {idx != null &&
                <Modal testId={getTestId("value-saving")} active={displaySaving} title="Save Values" close={toggleSaving}>
                    <Save handleSave={savingWrapper} checkForVariableConflicts={checkForVariableConflicts} response={response} idx={idx} />
                </Modal>
            }
        </div>
    );
}

export { Request };