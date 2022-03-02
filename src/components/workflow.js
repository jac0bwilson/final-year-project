import React, { useState, useEffect } from "react";
import axios from "axios";

import { Request } from "./request";
import { Icon, TextIconButton } from "./icon";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { Modal } from "./modal";

import { processSavedValuesJSON, processSavedValuesURL, extractNestedResponseData } from "../utilities";

import "./workflow.css";

/**
 * Creates a workflow which contains a number of request elements.
 */
function Workflow() {
    const [requests, editRequests] = useState([]);
    const [responses, editResponses] = useState({});
    const [savedValues, editSavedValues] = useState({});
    const [sidebar, setSidebar] = useState(false);
    const [help, setHelp] = useState(false);
    const [fileUrl, setFileUrl] = useState("");

    const sidebarWidth = 4;

    /**
     * When any of the data that comprises the workflow changes, a new downloadable file is required to be generated
     */
    useEffect(() => {
        if (requests.length > 0 || Object.keys(responses).length > 0 || Object.keys(savedValues).length > 0) { // won't happen if all empty 
            let output = {};

            output["requests"] = requests;
            output["responses"] = responses;
            output["saved"] = savedValues;

            const outString = JSON.stringify(output, null, 2); // turn object into string
            const blob = new Blob([outString]);
            const downloadUrl = URL.createObjectURL(blob); // create a URL where the file can be downloaded from

            setFileUrl(downloadUrl);
        } else {
            setFileUrl(""); // will remove the URL if the workflow is cleared
        }
    }, [requests, responses, savedValues]);

    /**
     * Prompts the user for confirmation that they wish to clear the workflow, then does it
     */
    const resetWorkflow = () => {
        if (window.confirm("Resetting the workflow will cause any unsaved work to be lost. Do you wish to continue?")) {
            editRequests([]);
            editResponses({});
            editSavedValues({});
        }
    };

    /**
     * Takes an uploaded file and parses it to overwrite the currently open workflow
     * @param {Object} event the event from the trigger
     */
    const uploadWorkflow = (event) => {
        if (window.confirm("Opening a workflow will overwrite the current workflow. Do you wish to continue?")) {
            // reset the workflow
            editRequests([]);
            editResponses({});
            editSavedValues({});

            const file = event.target.files[0]; // get the file from the input
            let reader = new FileReader();

            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result); // parse file

                    // set all needed components
                    editRequests(data["requests"]);
                    editResponses(data["responses"]);
                    editSavedValues(data["saved"]);
                } catch (e) {
                    window.alert("This file does not seem to be a valid workflow.");
                }
            };

            reader.readAsText(file);
        }
    };

    /**
     * Toggles the visibility of the help modal
     */
    const toggleHelp = () => {
        setHelp(previous => {
            return !previous;
        });
    };

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
     * Recompute the indexes of responses when inserting a request or deleting one
     * @param {Object} previous the previous set of responses 
     * @param {boolean} inserting true if inserting a new item, false if deleting 
     * @param {number} index the index of the item to change indexes around 
     * @returns the new set of responses
     */
    const reIndexResponses = (previous, inserting, index) => {
        let newResponses = {};
        const modifier = inserting ? 1 : -1;

        for (const [key, value] of Object.entries(previous)) {
            let keyInt = parseInt(key);

            if (keyInt > index) { // if response came after target, increment/decrement key
                newResponses[keyInt + modifier] = value;
            } else if (!inserting && keyInt === index) { // if item is to be deleted, don't include
                continue;
            } else { // if item came before target, add as normal
                newResponses[keyInt] = value;
            }
        }

        return newResponses;
    };

    /**
     * Recompute the indexes of saved values when inserting a request or deleting one
     * @param {Object} previous the previous set of saved values 
     * @param {boolean} inserting true if inserting a new item, false if deleting 
     * @param {number} index the index of the item to change indexes around 
     * @returns the new set of saved values
     */
    const reIndexSaved = (previous, inserting, index) => {
        let newValues = {};
        const modifier = inserting ? 1 : -1;

        for (const [key, value] of Object.entries(previous)) {
            let comparison = value.availableFrom;

            if (comparison > index) {
                let newValue = { ...value };
                newValue.availableFrom = comparison + modifier;

                newValues[key] = newValue;
            } else if (!inserting && comparison === index) {
                continue;
            } else {
                newValues[key] = value;
            }
        }

        return newValues;
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
            return reIndexResponses(previous, false, index);
        });

        editSavedValues(previous => {
            return reIndexSaved(previous, false, index);
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
     * Inserts a new request into the workflow in a location other than just the end
     * @param {number} index the index of the item to be followed by a new request 
     */
    const handleInsert = (index) => {
        const newIndex = index + 1;

        editRequests(previous => {
            let newRequests = [...previous];
            newRequests.splice(newIndex, 0, {
                "url": "",
                "method": "get",
                "arguments": "",
                "headers": ""
            });

            return newRequests;
        });

        editResponses(previous => {
            return reIndexResponses(previous, true, index);
        });

        editSavedValues(previous => {
            return reIndexSaved(previous, true, index);
        });
    };

    /**
     * Perform the specified HTTP request, saving the returned value to the state for the workflow
     * @param {Object} request the values for the specific request
     * @param {number} index the index of the request being run
     */
    const runRequest = (request, index) => {
        const availableSaved = filterSavedValues(index);

        let config = {
            url: processSavedValuesURL(request.url, availableSaved),
            method: request.method,
            headers: request.headers.length > 0 ? JSON.parse(request.headers) : {}
        };

        if (!["get", "head", "options"].includes(config.method)) {
            config["data"] = processSavedValuesJSON(request.arguments, availableSaved);
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
        <div className="full-height">
            <Navbar upload={uploadWorkflow} downloadUrl={fileUrl} reset={resetWorkflow} help={toggleHelp} />

            <Modal testId="help" active={help} title="Help" close={toggleHelp}>
                <div className="content">
                    <h3>Making Requests</h3>
                    <h4>Providing Information</h4>
                    <p>
                        To make a request, at a minimum you must supply a URL and a HTTP method to use.
                        Some methods will allow a JSON payload to be provided, which can be entered into
                        the input box on the left, when in editing mode. You can reach editing mode either
                        by typing into a new request input, or by pressing the 'Edit' button on an existing
                        request.
                    </p>
                    <h4>Running Requests</h4>
                    <p>
                        There are a number of different options available for running requests. You can
                        execute the entire workflow, by pressing the 'Run Workflow' button after the final
                        request. Alternatively you may use the buttons on the left of the control bar at
                        the bottom of each request, and either run the individual request or that one and
                        all others after it.
                    </p>
                    <h3>Saving & Using Values</h3>
                    <h4>Saving Values</h4>
                    <p>
                        When a request (or the whole workflow) has been run, you are able to extract values
                        from the returned payload. This can be done by pressing the 'Save Values' button,
                        then selecting a value to save and assigning it a name.
                    </p>
                    <h4>Seeing Saved Values</h4>
                    <p>
                        To see the values that have been saved, use the button in the bottom left of the
                        screen to open the sidebar.
                    </p>
                    <h4>Using Saved Values</h4>
                    <h5>In Arguments</h5>
                    <p>
                        When editing the payload of a request, you can reference a saved value by providing
                        the name of the value, preceded and followed by an exclamation mark. An example is
                        shown below.
                    </p>
                    <pre>
                        <code>
                            &#123;
                            "example": !exampleData
                            &#125;
                        </code>
                    </pre>
                    <h5>In URLs</h5>
                    <p>
                        When editing a URL, you can reference a saved value by providing the name of the
                        value, preceded and followed by an exclamation mark. An example is shown below.
                    </p>
                    <pre>
                        <code>
                            https://example.com/!dataReference!
                        </code>
                    </pre>
                    <p>
                        You may wish to extract a URL from a request and then make requests to this URL,
                        in which case you should indicate this when referencing the value by adding the
                        option ':raw' after the variable name. This will prevent the contents from being
                        encoded in such a way that they can be used after the domain name in a URL. An
                        example of this in use is shown below.
                    </p>
                    <pre>
                        <code>
                            !previouslySavedURL:raw!
                        </code>
                    </pre>
                    <h3>Managing Workflows</h3>
                    <h4>Saving Workflows</h4>
                    <p>
                        To save a workflow as a file, press the 'Save' button in the menu bar of the
                        application. This will trigger a file download of the workflow.
                    </p>
                    <h4>Opening a Saved Workflow</h4>
                    <p>
                        To open a saved workflow file, press the 'Open' button in the menu bar of the
                        application. Then select the workflow file you wish to upload. If prompted to confirm
                        overwriting the current workflow, make your decision. If you choose to proceed the
                        current workflow will be cleared, and the one from the file will be loaded to the
                        state it was in when it was saved.
                    </p>
                    <h4>Resetting the Current Workflow</h4>
                    <p>
                        To clear all data in the current workflow, press the 'Reset' button in the menu bar
                        of the application. You will be asked to confirm that you understand the workflow will
                        be completely overwritten.
                    </p>
                </div>
            </Modal>

            <div className="content columns full-height">
                {sidebar &&
                    <aside data-testid="sidebar" className={`sidebar column is-${sidebarWidth} is-fullheight`}>
                        <Sidebar savedValues={savedValues} />
                    </aside>
                }

                <div className={"workflow column" + (sidebar ? ` is-${12 - sidebarWidth} blurred stop-scrolling` : "") + (help ? " stop-scrolling" : "")}>
                    {requests.length > 0 && requests.map((value, index) => {
                        return (
                            <Request
                                key={index}
                                handleSubmit={handleSubmit}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                handleSave={handleSave}
                                handleInsert={handleInsert}
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
        </div>
    );
}

export { Workflow };