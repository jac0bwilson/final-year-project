import React, {useState} from "react";
import ReactDOM from "react-dom";

const App = () => {
    const [name, updateName] = useState("World")

    const handleChange = (e) => {
        updateName(e.target.value.trim());
    };

    return (
        <div>
            Hello {name}!
            <p />

            <label>
                Name:
                <input name="name" onChange={handleChange} />
            </label>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));