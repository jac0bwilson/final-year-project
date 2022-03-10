import React from "react";

import { Save } from "./save";

import "./sidebar.css";

/**
 * Generates the sidebar that appears to the left of the screen
 * @param {Object} savedValues the values saved from responses
 * @param {*} handleSave the function to save a value for later use
 * @param {*} checkForVariableConflicts the function to ensure that variable names can not be duplicates
 * @returns 
 */
function Sidebar({ savedValues, handleSave, checkForVariableConflicts }) {
    const keys = Object.keys(savedValues);

    /**
     * Naive method of turning saved data into a string to be displayed in the sidebar
     * @param {Object} data the value to be confirmed as a string
     * @returns the string of the data
     */
    const stringify = (data) => {
        if (typeof data === "object") {
            return JSON.stringify(data);
        } else {
            return data;
        }
    };

    return (
        <div>
            <section className="hero is-small">
                <div className="hero-body">
                    <p className="title">
                        Saved Values
                    </p>
                    <p className="subtitle">
                        You can find the values saved from responses here. You can also save your own text
                        values for use at any point in the workflow.
                    </p>
                </div>
            </section>

            <div className="box">
                <h3>Save a New Value</h3>

                <Save handleSave={handleSave} checkForVariableConflicts={checkForVariableConflicts} />
            </div>

            <table className="table is-narrow is-striped is-hoverable is-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {keys.length > 0
                        ? keys.map((value) => {
                            let item = savedValues[value]

                            return (
                                <tr key={value}>
                                    <td>{value}</td>
                                    <td>{stringify(item.data)}</td>
                                    <td>{typeof item.data}</td>
                                </tr>
                            )
                        })
                        : <tr>
                            <td colSpan="3">You have not saved any values yet.</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { Sidebar };