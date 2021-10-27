import React from "react";
import ReactDOM from "react-dom";

import { Workflow } from "./components/workflow";

import "bulma/css/bulma.min.css";

/**
 * A container for the React application
 */
function App() {
    return (
        <div>
            <Workflow />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));