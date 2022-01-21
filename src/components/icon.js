import React from "react";

/**
 * Displays an icon from "Font Awesome" next to some text
 * @param {string} text the text to display to the right of the icon
 * @param {string} iconName the identifier for the icon on "Font Awesome"
 */
function TextIcon({ text, iconName }) {
    return (
        <div className="icon-text">
            <span className="icon">
                <i className={"fas " + iconName}></i>
            </span>
            <span>{text}</span>
        </div>
    );
}

/**
 * Displays an icon from "Font Awesome"
 * @param {string} iconName the identifier for the icon on "Font Awesome" 
 */
function Icon({ iconName }) {
    return (
        <span className="icon">
            <i className={"fas " + iconName}></i>
        </span>
    );
}

/**
 * Displays a button containing a TextIcon
 * @param {string} testId the ID to use for referencing the modal in testing
 * @param {string} buttonClass the type of formatting (from Bulma) to use on the button
 * @param {string} type the type of button to use
 * @param {boolean} disabled whether or not the button should be disabled
 * @param {*} onClick the function to execute when the button is pressed
 * @param {string} text the text to display inside the button
 * @param {string} icon the icon to display inside the button 
 */
function TextIconButton({ testId, buttonClass, type = "button", disabled = false, onClick, text, icon }) {
    return (
        <button data-testid={testId} className={"button " + buttonClass} type={type} disabled={disabled} onClick={onClick}>
            <TextIcon text={text} iconName={icon}></TextIcon>
        </button>
    );
}

export { TextIcon, Icon, TextIconButton };