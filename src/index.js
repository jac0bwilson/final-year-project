import React, { useState } from "react";
import ReactDOM from "react-dom";

import { Request } from "./components/request";

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

            <Request />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));