import React, { useState } from "react";

import { EditableRequest, Request } from "./request";

/**
 * Creates a workflow which contains a number of request elements.
 */
function Workflow() {
    const [requests, editRequests] = useState([]);

    const handleSubmit = (event) => {
        let newRequest = {
            url: event.target.url.value,
            method: event.target.method.value
        };

        editRequests(requests.concat([newRequest])); // adds the new data to the list in state
    };

    return (
        <div>
            {requests.length > 0 && requests.map((value, index) => {
                return (
                    <Request key={index} url={value.url} method={value.method} />
                );
            })}

            <EditableRequest handleSubmit={handleSubmit} />
        </div>
    );
}

export { Workflow }