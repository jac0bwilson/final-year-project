import React from "react";

/**
 * Displays a modal interface over the top of the main screen content.
 * @param {JSX.Element} children the HTML/components to display within the modal
 * @param {string} testId the ID to use for referencing the modal in testing
 * @param {boolean} active whether or not to display the modal
 * @param {string} title the header for the modal
 * @param {*} close the function needed to close the modal using the button or background
 */
function Modal({ children, testId, active, title, close }) {
    return (
        <div data-testid={testId} className={"modal modal-fx-normal" + (active ? " is-active" : "")}>
            <div className="modal-background" onClick={close} />
            <div className="modal-content">
                <div className="box">
                    <h1 className="title">
                        {title}
                    </h1>

                    {children}
                </div>
            </div>
            <button className="modal-close is-large" type="button" aria-label="close" onClick={close}></button>
        </div>
    );
}

export { Modal };