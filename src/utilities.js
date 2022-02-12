const matchSavedValuesJSON = /![a-zA-Z0-9]+/gm; // TODO: may want to reject if prefixed with quotes
const matchSavedValuesURL = /![a-zA-Z0-9]+(:raw)?!/gm;

/**
 * Fills in the saved values where they are referenced in a request's arguments
 * @param {string} args the string containing the request arguments
 * @param {Object} saved the set of saved values from earlier responses
 * @returns the processed version of the arguments
 */
function processSavedValuesJSON(args, saved) {
    const matches = args.match(matchSavedValuesJSON);

    if (matches) {
        matches.forEach((match) => {
            const name = match.slice(1); // remove "!" from value reference

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
 * Fills in the saved values where they are referenced in a request's URL
 * @param {string} url the string containing the request URL
 * @param {Object} saved the set of saved values from earlier responses
 * @returns the processed version of the string
 */
function processSavedValuesURL(url, saved) {
    const matches = url.match(matchSavedValuesURL);

    if (matches) {
        matches.forEach((match) => {
            const components = match.slice(1, -1).split(":");

            if (components[0] in saved) {
                const newValue = saved[components[0]]["data"];

                if (components.length > 1 && components[1] === "raw") { // option present
                    url = url.replace(match, newValue); // don't URL encode characters
                } else {
                    url = url.replace(match, encodeURIComponent(newValue));
                }

            }
        });
    }

    return url;
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
        let matches = toFormat.match(matchSavedValuesJSON);

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

/**
 * Extract response data that is defined by a multi-level key
 * @param {string} key the multi-level key to be decomposed and processed
 * @param {Object} response the response object to extract the data from
 * @returns the extracted data, or null if no data is available
 */
function extractNestedResponseData(key, response) {
    let levels = key.split("/");

    if (response.data) {
        let data = response.data;

        while (levels.length > 0) { // repeatedly remove first element, narrowing down data
            let key = levels.shift();

            if (key in data) {
                data = data[key];
            } else {
                return null;
            }
        }

        return data;
    }

    return null;
};

export { processSavedValuesJSON, processSavedValuesURL, formatJSON, customFormatJSON, extractNestedResponseData }