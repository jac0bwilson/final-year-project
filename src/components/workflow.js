import React, { useState } from "react";

import { EditableRequest, Request } from "./request";

function Workflow() {
    const [list, editList] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();

        let newRequest = {
            url: event.target.url.value,
            method: event.target.method.value
        };

        editList(list.concat([newRequest]));
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