import React from "react";
import ReactDOM from "react-dom";

import { Workflow } from "./components/workflow";

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