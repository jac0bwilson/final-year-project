import React, { useState } from "react";

import { TextIcon, TextIconButton } from "./icon";

import "./navbar.css";

/**
 * Generates the navigation bar that displays at the top of the screen
 * @param {*} upload the function to upload a workflow file
 * @param {string} downloadUrl the URL to visit to get the workflow file
 * @param {*} reset the function to reset the current workflow
 * @param {*} help the function to toggle the help screen
 */
function Navbar({ upload, downloadUrl, reset, help }) {
    const [mobileNavOpen, setMobileNav] = useState(false);
    const [uploadingFile, setUploading] = useState(false);

    /**
     * When focus returns to the window, file input has been cancelled, so animation should be stopped
     */
    const windowFocus = () => {
        setUploading(false);

        window.removeEventListener("focus", windowFocus);
    };

    /**
     * When the upload button is clicked, start the animation while file picker is open
     */
    const onUpload = () => {
        window.addEventListener("focus", windowFocus);

        setUploading(true);
    };

    /**
     * When input completes, upload the file and stop the animation
     * @param {Object} event the event from the trigger
     */
    const uploadWrapper = (event) => {
        upload(event);

        setUploading(false);

        window.removeEventListener("focus", windowFocus);
    };

    /**
     * Toggle the navbar in small display sizes
     */
    const toggleMobileNav = () => {
        setMobileNav(previous => {
            return !previous;
        });
    };

    return (
        <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <div className="navbar-item">
                    <h1 className="title">APEX</h1>
                </div>
                <button className="navbar-burger" aria-label="menu" aria-expanded="false" onClick={toggleMobileNav}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </div>
            <div className={"navbar-menu" + (mobileNavOpen ? " is-active" : "")}>
                <div className="navbar-start">
                    <div className={"navbar-item" + (uploadingFile ? " hidden" : "")}>
                        <div className="file is-info">
                            <label className="file-label">
                                <input data-testid="upload" className="file-input" type="file" multiple={false} accept=".json,application/json" onClick={onUpload} onInput={uploadWrapper} />
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

                    {uploadingFile &&
                        <div className="navbar-item">
                            <TextIconButton buttonClass="is-info is-loading" text="Open" icon="fa-file-upload" />
                        </div>    
                    }

                    {downloadUrl !== "" &&
                        <div className="navbar-item">
                            <a data-testid="download" href={downloadUrl} className="button is-info" download="workflow.json">
                                <TextIcon text="Save" iconName="fa-file-download" />
                            </a>
                        </div>
                    }

                    {downloadUrl !== "" &&
                        <div className="navbar-item">
                            <TextIconButton testId="reset" buttonClass="is-info" onClick={reset} text="Reset" icon="fa-redo" />
                        </div>
                    }
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        <TextIconButton testId="help-toggle" buttonClass="is-info" onClick={help} text="Help" icon="fa-question" />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export { Navbar };