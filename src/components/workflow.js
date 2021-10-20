import React, { useState } from "react";

import { EditableRequest, Request } from "./request";

/**
 * Creates a workflow which contains a number of request elements.
 */
function Workflow() {
    const [list, editList] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault(); // prevents the values from being added to the URL

        let newRequest = {
            url: event.target.url.value,
            method: event.target.method.value
        };

        editList(list.concat([newRequest])); // adds the new data to the list in state
    };

    return (
        <div>
            {list.length > 0 && list.map((value, index) => {
                return (
                    <Request key={index} url={value.url} method={value.method} />
                );
            })}

            <EditableRequest handleSubmit={handleSubmit} />
        </div>
    );
}

export { Workflow }