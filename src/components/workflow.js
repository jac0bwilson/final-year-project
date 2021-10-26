import React, { useState } from "react";

import { Request } from "./request";

/**
 * Creates a workflow which contains a number of request elements.
 */
function Workflow() {
    const [requests, editRequests] = useState([]);

    /**
     * Handles new submissions of information
     * @param {Object} event the event from the trigger
     */
    const handleSubmit = (event) => {
        const newRequest = {
            url: event.target.url.value,
            method: event.target.method.value
        };

        editRequests(requests.concat([newRequest])); // adds the new data to the list in state
    };

    /**
     * Handles the updating of existing information
     * @param {*} event the event from the trigger
     * @param {*} index the index of the request to be updated
     */
    const handleEdit = (event, index) => {
        const modifiedRequest = {
            url: event.target.url.value,
            method: event.target.method.value
        };

        let newRequests = [...requests];
        newRequests[index] = modifiedRequest;

        editRequests(newRequests);
    };

    return (
        <div>
            {requests.length > 0 && requests.map((value, index) => {
                return (
                    <Request key={index} handleSubmit={handleSubmit} handleEdit={handleEdit} url={value.url} method={value.method} editing={false} id={index} />
                );
            })}

            <p />

            <Request handleSubmit={handleSubmit} url="" editing={true} />
        </div>
    );
}

export { Workflow }