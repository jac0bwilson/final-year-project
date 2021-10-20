import React, { useState } from "react";
import ReactDOM from "react-dom";

import { Workflow } from "./components/workflow";

/**
 * A container for the React application
 */
function App() {
    const [name, updateName] = useState("World")

    const handleChange = (e) => {
        let name = e.target.value.trim();

        updateName(name.length > 0 ? name : "World");
    };

    return (
        <div>
            Hello {name}!
            <p />

            <label>
                Name:
                <input name="name" onChange={handleChange} />
            </label>

            <p />

            <Workflow />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));