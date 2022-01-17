import React from "react";

import "./sidebar.css";

/**
 * Generates the sidebar that appears to the left of the screen
 * @param {*} param0 
 * @returns 
 */
function Sidebar({ savedValues }) {
    const keys = Object.keys(savedValues);

    return (
        <table className="table is-narrow">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                    {/* <th>Type</th> */}
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
                                <td>{item.data}</td>
                                {/* <td>{typeof item.data}</td> */}
                                {/* <td>{item.availableFrom}</td> */}
                            </tr>
                        )
                    })
                    : <></>
                }
            </tbody>
        </table>
    );
}

export { Sidebar };