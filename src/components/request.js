import React from "react";

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