import React, { useState } from "react";
import axios from "axios";

import { Request } from "./request";
import { Icon, TextIconButton } from "./icon";
import { Sidebar } from "./sidebar";

import { processSavedValues, extractNestedResponseData } from "../utilities";

import "./workflow.css";

/**
 * Creates a workflow which contains a number of request elements.
 */
function Workflow() {
    const [requests, editRequests] = useState([]);
    const [responses, editResponses] = useState({});
    const [savedValues, editSavedValues] = useState({});
    const [sidebar, setSidebar] = useState(false);

    const sidebarWidth = 4;

    /**
     * Toggles the visibility of the sidebar element
     */
    const toggleSidebar = () => {
        setSidebar(previous => {
            return !previous;
        });
    };

    /**
     * Handles new submissions of information, on submission of the form
     * @param {Object} event the event from the trigger
     */
    const handleSubmit = (event) => {
        const newRequest = {
            url: event.target.elements.url.value,
            method: event.target.elements.method.value,
            arguments: event.target.elements.arguments.value,
            headers: event.target.elements.headers.value
        };

        editRequests(requests.concat([newRequest])); // adds the new data to the list in state
    };

    /**
     * Handles the updating of existing item information
     * @param {*} event the event from the trigger
     * @param {number} index the index of the item to be updated
     */
    const handleEdit = (event, index) => {
        const modifiedRequest = {
            url: event.target.elements.url.value,
            method: event.target.elements.method.value,
            arguments: event.target.elements.arguments.value,
            headers: event.target.elements.headers.value
        };

        editRequests(previous => {
            let newRequests = [...previous];
            newRequests[index] = modifiedRequest;

            return newRequests;
        });

        editResponses(previous => {
            let newResponses = { ...previous };
            newResponses[index] = {};

            return newResponses;
        });
    };

    /**
     * Removes a specific item from the list
     * @param {number} index the index of the item to be removed
     */
    const handleDelete = (index) => {
        editRequests(previous => {
            let newRequests = [...previous];
            newRequests.splice(index, 1);

            return newRequests;
        });

        editResponses(previous => { // re-index responses to ensure they match to the correct request
            let newResponses = {};

            for (const [key, value] of Object.entries(previous)) {
                let keyInt = parseInt(key);

                if (keyInt > index) { // if response came after item to be deleted, decrement key
                    newResponses[keyInt - 1] = value;
                } else if (keyInt === index) { // if item is the one to be deleted, don't include
                    continue;
                } else { // if item came before one to be deleted, add as normal
                    newResponses[keyInt] = value;
                }
            }

            return newResponses;
        });

        editSavedValues(previous => {
            let newValues = {};

            for (const [key, value] of Object.entries(previous)) {
                let comparison = value.availableFrom;

                if (comparison > index) {
                    let newValue = { ...value };
                    newValue.availableFrom = comparison - 1;

                    newValues[key] = newValue;
                } else if (comparison === index) {
                    continue;
                } else {
                    newValues[key] = value;
                }
            }

            return newValues;
        });
    };

    /**
     * Saves a specific value from an executed request
     * @param {*} config the information about the value to be saved 
     */
    const handleSave = (config) => {
        editSavedValues(previous => {
            let newValues = { ...previous };
            newValues[config.name] = {
                data: config.data,
                key: config.key,
                availableFrom: config.availableFrom
            };

            return newValues;
        });
    };

    /**
     * Perform the specified HTTP request, saving the returned value to the state for the workflow
     * @param {Object} request the values for the specific request
     * @param {number} index the index of the request being run
     */
    const runRequest = (request, index) => {
        let config = {
            url: request.url,
            method: request.method,
            headers: request.headers.length > 0 ? JSON.parse(request.headers) : {}
        };

        if (request.method !== "get") {
            config["data"] = processSavedValues(request.arguments, filterSavedValues(index));
        }

        axios(
            config
        ).then((response) => { // process values if all went well
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            };
        }).catch((error) => { // if an error was thrown, save the status code and description
            // console.log(error.response);

            return {
                status: error.response.status,
                statusText: error.response.statusText
            };
        }).then((values) => {
            // add responses to an object with the index of the request used as the key for the responses
            // this prevents the order being corrupted due to any asynchronous weirdness 
            editResponses(previous => {
                let newResponses = { ...previous };
                newResponses[index] = values;

                return newResponses;
            });

            editSavedValues(previous => {
                let newValues = { ...previous };

                if ("data" in values) { // check if request went well
                    for (const [key, value] of Object.entries(previous)) { // iterate through saved values
                        if (value.availableFrom === index) { // if value defined in this request
                            let updatedValue = extractNestedResponseData(value.key, values); // extract new value

                            if (updatedValue !== null) {
                                newValues[key]["data"] = updatedValue;
                            }
                        }
                    }
                }

                return newValues;
            });
        }).catch(() => { // likely a CORS error
            console.log("Likely CORS error");
        });
    };

    /**
     * Run the whole workflow
     */
    const runAllRequests = () => {
        editResponses(() => {
            return {};
        }); // reset stored responses before running

        let temp = requests;
        temp.map((request, index) => {
            runRequest(request, index);

            return {};
        });
    };

    /**
     * Run an individual request
     * @param {number} startIndex the index of the request to be run
     * @param {boolean} onwards whether or not to run all after this point
     */
    const runSomeRequests = (startIndex, onwards) => {
        let temp = requests;

        if (onwards) {
            for (let i = 0; i < temp.length; i++) {
                runRequest(temp[i], i);
            }
        } else {
            runRequest(temp[startIndex], startIndex);
        }
    };

    /**
     * Finds the available saved values for a request
     * @param {number} index the index of the request
     * @returns the reduced object containing available saved values
     */
    const filterSavedValues = (index) => {
        let available = {};

        for (const [key, value] of Object.entries(savedValues)) {
            let comp = value.availableFrom;

            if (index > comp) { // if value is available after the index of the item, allow it
                available[key] = value;
            }
        }

        return available;
    };

    /**
     * Checks to see if the name of a variable already exists or not
     * @param {string} name the name of the variable to check
     * @returns whether the name is already in use or not
     */
    const checkForVariableConflicts = (name) => {
        return name in savedValues;
    };

    return (
        <div className="content columns is-fullheight">
            {sidebar &&
                <aside data-testid="sidebar" className={`sidebar column is-${sidebarWidth} is-fullheight`}>
                    <Sidebar savedValues={savedValues} />
                </aside>
            }
            <div className={"workflow column" + (sidebar ? ` is-${12 - sidebarWidth} blurred` : "")}>
                {requests.length > 0 && requests.map((value, index) => {
                    return (
                        <Request
                            key={index}
                            handleSubmit={handleSubmit}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            handleSave={handleSave}
                            runSomeRequests={runSomeRequests}
                            checkForVariableConflicts={checkForVariableConflicts}
                            url={value.url}
                            method={value.method}
                            args={value.arguments}
                            headers={value.headers}
                            response={responses[index] ? responses[index] : {}}
                            saved={filterSavedValues(index)}
                            idx={index}
                        />
                    );
                })} {/* displays when any request details have been provided */}

                {requests.length > 0 &&
                    <div className="has-text-centered">
                        <TextIconButton testId="run" buttonClass="is-primary is-rounded is-medium run-button" onClick={runAllRequests} text="Run Workflow" icon="fa-play" />
                    </div>
                } {/* displays when any request details have been provided */}

                <Request handleSubmit={handleSubmit} saved={savedValues} newInput={true} />

            </div>
            <button data-testid="show-sidebar" className="show-sidebar has-background-primary" onClick={toggleSidebar}>
                <Icon iconName="fa-info" />
            </button>
        </div>
    );
}

export { Workflow };