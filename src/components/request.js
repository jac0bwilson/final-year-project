import React, { useState } from "react";

import { TextIcon } from "./icon";

import "./request.css";

/**
 * Creates a form to allow the user to provide the details for the request
 * @param {*} handleSubmit the function to pass the data back to the workflow
 * @param {*} handleEdit the function to update the saved data in the workflow
 * @param {*} handleDelete the function to delete the request in the workflow
 * @param {string} url the URL to be displayed - "" by default
 * @param {string} method the HTTP method to be displayed - "GET" by default
 * @param {Object} response the response to the request if run from outside
 * @param {boolean} newInput whether the information should initialise in an editable state
 * @param {number} idx the index of the saved information in the list of requests (if saved)
 */
function Request({ handleSubmit, handleEdit, handleDelete, url = "", method = "get", response = {}, newInput = false, idx }) {
    const [urlError, setError] = useState(false);
    const [editable, setEditable] = useState(newInput);
    const [selectedMethod, setMethod] = useState(method);

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
                setError(true);
                return; // needs to be done to prevent falling to default case
            }
        }

        setError(false);
    }

    /**
     * Performs error checking, then submits the entered details
     * @param {*} event the event caused by the field being edited
     */
    const onSubmit = (event) => {
        event.preventDefault(); // prevents the values from being added to the URL

        if (!urlError) {
            if (newInput) { // if the item has just been created
                handleSubmit(event);
                setMethod("get");
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
    }

    const httpMethods = ["get", "post", "put", "delete"];

    const renderResponse = () => {
        if (response.status === 200) {
            return (
                <pre>
                    <code>
                        {JSON.stringify(response.data, null, 2)}
                    </code>
                </pre>
            );
        } else if (response.status >= 400 && response.status < 500) {
            return (
                <section className="hero is-danger">
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
                    Unknown response
                </p>
            )
        }
    }

    return (
        <div className="request-container">
            <form onSubmit={onSubmit}>
                <div className="field is-grouped">
                    <div className="field has-addons request-inputs">
                        <div className="control">
                            <input name="url" className="input is-link" defaultValue={url} placeholder="https://google.com/test" disabled={!editable} onChange={validateURL} />
                        </div>

                        <div className="control select is-link is-expanded">
                            <select name="method" className="select" value={selectedMethod} disabled={!editable} onChange={(e) => setMethod(e.target.value)}>
                                {httpMethods.map((value) => {
                                    return (
                                        <option value={value} key={value}>{value.toUpperCase()}</option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="field is-grouped">
                        <div className="control">
                            {editable
                                ? <button className="button is-success" type="submit" disabled={urlError}>
                                    <TextIcon text="Done" iconName="fa-check" />
                                </button>
                                : <button className="button is-warning" type="button" onClick={startEditing}>
                                    <TextIcon text="Edit" iconName="fa-edit" />
                                </button>
                            } {/* if editable - present submit button, if not - show the edit button */}
                        </div>
                        {(editable && !newInput) &&
                            <div className="control">
                                <button className="button is-danger" onClick={() => handleDelete(idx)}>
                                    <TextIcon text="Delete" iconName="fa-trash-alt" />
                                </button>
                            </div>
                        } {/* if editable and not the new input box - allow deleting the item */}
                    </div>
                </div>
                {!newInput &&
                    <div className="columns">
                        <div className="column box">Args</div>
                        <div className="column box">{renderResponse()}</div>
                    </div>
                }
            </form>

            {(urlError && editable) &&
                <div className="notification is-danger">
                    The provided URL is not valid, please correct it.
                </div>
            } {/* only shown when state indicates an error in the URL */}

        </div>
    )
}

export { Request };