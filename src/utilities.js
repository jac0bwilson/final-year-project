const matchSavedValues = /![a-zA-Z0-9]+/gm; // TODO: may want to reject if prefixed with quotes

/**
 * Fills in the saved values where they are referenced in a request's arguments
 * @param {string} args the string containing the request arguments
 * @param {Object} saved the set of saved values from earlier responses
 * @returns the processed version of the arguments
 */
function processSavedValues(args, saved) {
    let matches = args.match(matchSavedValues);

    if (matches) {
        matches.forEach((match) => {
            let name = match.slice(1); // remove "!" from value reference

            if (name in saved) {
                let newValue = saved[name]["data"];

                if (typeof newValue === "object") { // objects need to be handled separately to print properly
                    newValue = JSON.stringify(newValue);
                } else if (typeof newValue === "string") {
                    newValue = "\"" + String(newValue) + "\"";
                } else {
                    newValue = String(newValue);
                }

                args = args.replace(match, newValue); // replace reference with string of the value
            }
        });
    }

    return args;
}

/**
 * Runs a standard JSON formatting process
 * @param {string} toFormat
 * @returns the JSON formatted string
 */
function formatJSON(toFormat) {
    let parsed = JSON.parse(toFormat);

    return JSON.stringify(parsed, null, 2);
}

/**
 * Formats a JSON-like string, including when it makes use of custom saved values
 * @param {string} toFormat the string to be formatted in JSON style
 * @returns the JSON formatted string
 */
function customFormatJSON(toFormat) {
    let output = "";

    try { // if input is valid standard JSON this will all work
        output = formatJSON(toFormat);
    } catch (e) { // if input is using additional saved values
        const placeholder = "\"SAVED_VALUE_PLACEHOLDER_123\"";
        let matches = toFormat.match(matchSavedValues);

        let saved = [];

        matches.forEach((match) => {
            saved.push(match); // add order of saved values to an array

            toFormat = toFormat.replace(match, placeholder); // replace saved value references with a placeholder
        });

        output = formatJSON(toFormat); // format in the standard manner

        saved.forEach((value) => {
            output = output.replace(placeholder, value); // do inverse replacement to add back the value references
        });
    }

    return output;
}

export { processSavedValues, formatJSON, customFormatJSON }