import React, { useState } from "react";

/**
 * Creates a form to allow the user to provide the details for the request
 * @param {*} handleSubmit the function to pass the data back to the workflow
 * @param {*} handleEdit the function to update the saved data in the workflow
 * @param {string} url the URL to be displayed - "" by default
 * @param {string} method the HTTP method to be displayed - "GET" by default
 * @param {boolean} editing whether the information should initialise in an editable state
 * @param {number} idx the index of the saved information in the list of requests (if saved)
 */
function Request({ handleSubmit, handleEdit, url, method, editing, idx }) {
    const [urlError, setError] = useState(false);
    const [editable, setEditable] = useState(editing);

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
     * @param {*} event 
     */
    const onSubmit = (event) => {
        event.preventDefault(); // prevents the values from being added to the URL

        if (!urlError) {
            handleSubmit(event);

            if (editing) { // if the item has just been created
                handleSubmit(event);
            } else { // if an existing item has been rendered
                handleEdit(event, idx);
                setEditable(false);
            }
        }

    };

    const httpMethods = ["get", "post", "put", "delete"];

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="url" defaultValue={url} placeholder="https://google.com/test" disabled={!editable} onChange={validateURL} />
                <select name="method" defaultValue={method} disabled={!editable}>
                    {httpMethods.map((value) => {
                        return (
                            <option value={value} key={value}>{value.toUpperCase()}</option>
                        );
                    })}
                </select>
                {editable ?
                    <input type="submit" value="Done" disabled={urlError} /> : <button onClick={() => setEditable(true)}>Edit</button>}
            </form>

            {(urlError && editable) &&
                <div>
                    The provided URL is not valid, please correct it.
                </div>
            } {/* only shown when state indicates an error in the URL */}

        </div>
    )
}

export { Request };