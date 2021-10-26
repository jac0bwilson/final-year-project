import React, { useState } from "react";

/**
 * Creates a form to allow the user to provide the details for the request
 * @param {*} handleSubmit the function to pass the data back to the workflow 
 */
function EditableRequest({ handleSubmit }) {
    const [urlError, setError] = useState(false);

    /**
     * Checks the current value of the URL field and sets the state to indicate if it is valid
     * @param {*} event the event caused by the field being edited
     */
    const validateURL = (event) => {
        let url = event.target.value;

        if (url.length > 0) { // prevents error being shown on empty strings
            try {
                new URL(url);
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
        }

    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="url" placeholder="https://google.com/test" onChange={validateURL} />
                <select name="method">
                    <option value="get">GET</option>
                    <option value="post">POST</option>
                    <option value="put">PUT</option>
                    <option value="delete">DELETE</option>
                </select>
                <input type="submit" value="Done" disabled={urlError} />
            </form>

            {urlError &&
                <div>
                    The provided URL is not valid, please correct it.
                </div>
            } {/* only shown when state indicates an error in the URL */}

        </div>
    )
}

/**
 * Creates a visualisation of the completed form, and allows the user to edit
 * @param {*} url the URL to submit the request to
 * @param {*} method the HTTP method to use for the request 
 */
function Request({ url, method }) {
    return (
        <div>
            <p>{url}</p>
            <p>{method}</p>
            <button>Edit</button>
        </div>
    );
}

export { EditableRequest, Request };