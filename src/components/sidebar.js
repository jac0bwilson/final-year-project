import React from "react";

import "./sidebar.css";

/**
 * Generates the sidebar that appears to the left of the screen
 * @param {Object} savedValues the values saved from responses
 * @returns 
 */
function Sidebar({ savedValues }) {
    const keys = Object.keys(savedValues);

    /**
     * Naive method of turning saved data into a string to be displayed in the sidebar
     * @param {*} data the value to be confirmed as a string
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
                        You can find the values saved from responses here.
                    </p>
                </div>
            </section>
            <table className="table is-narrow is-striped is-hoverable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Type</th>
                        {/* <th>Defined</th> */}
                    </tr>
                </thead>
                <tbody>
                    {keys.length > 0
                        ? keys.map((value) => {
                            let item = savedValues[value]

                            return (
                                <tr key={value}>
                                    <td>{item.key}</td>
                                    <td>{stringify(item.data)}</td>
                                    <td>{typeof item.data}</td>
                                    {/* <td>{item.availableFrom}</td> */}
                                </tr>
                            )
                        })
                        : <></>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { Sidebar };