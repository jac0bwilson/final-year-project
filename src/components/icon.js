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

export { TextIcon, Icon };