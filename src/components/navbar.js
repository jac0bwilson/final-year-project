import React from "react";

import { TextIcon } from "./icon";

import "./navbar.css";

/**
 * Generates the navigation bar that displays at the top of the screen
 * @param {*} upload the function to upload a workflow file
 * @param {*} downloadUrl the URL to visit to get the workflow file
 */
function Navbar({ upload, downloadUrl }) {
    return (
        <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <div className="navbar-item">
                    <h1 className="title">APEX</h1>
                </div>
                <div className="navbar-item">
                    <div className="file is-info">
                        <label className="file-label">
                            <input data-testid="upload" className="file-input" type="file" multiple={false} accept=".json,application/json" onInput={upload} />
                            <span className="file-cta">
                                <span className="file-icon">
                                    <i className="fas fa-file-upload" />
                                </span>
                                <span className="file-label">
                                    Open
                                </span>
                            </span>
                        </label>
                    </div>
                </div>

                {downloadUrl !== "" &&
                    <div className="navbar-item">
                        <a data-testid="download" href={downloadUrl} className="button is-info" download="workflow.json">
                            <TextIcon text="Save" iconName="fa-file-download" />
                        </a>
                    </div>
                }
            </div>
        </nav>
    );
}

export { Navbar };