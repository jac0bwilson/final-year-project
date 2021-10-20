import React from "react";

/**
 * Creates a form to allow the user to provide the details for the request
 * @param {*} handleSubmit the function to pass the data back to the workflow 
 */
function EditableRequest({ handleSubmit }) {
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input name="url" placeholder="https://google.com/test" />
                <select name="method">
                    <option value="get">GET</option>
                    <option value="post">POST</option>
                    <option value="put">PUT</option>
                    <option value="delete">DELETE</option>
                </select>
                <input type="submit" value="Done" />
            </form>
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