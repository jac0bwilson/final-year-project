import React from "react";

function Request() {
    return (
        <div>
            <input name="url" />
            <select name="method">
                <option value="get">GET</option>
                <option value="post">POST</option>
                <option value="put">PUT</option>
                <option value="delete">DELETE</option>
            </select>
        </div>
    )
}

export { Request };