import React, { useState } from "react";
import axios from "axios";

import { Request } from "./request";
import { TextIcon } from "./icon";

import "./workflow.css";

/**
 * Creates a workflow which contains a number of request elements.
 */
function Workflow() {
    const [requests, editRequests] = useState([]);
    const [responses, editResponses] = useState({});

    /**
     * Handles new submissions of information
     * @param {Object} event the event from the trigger
     */
    const handleSubmit = (event) => {
        const newRequest = {
            url: event.target.elements.url.value,
            method: event.target.elements.method.value,
            arguments: event.target.elements.arguments.value
        };

        editRequests(requests.concat([newRequest])); // adds the new data to the list in state
    };

    /**
     * Handles the updating of existing information
     * @param {*} event the event from the trigger
     * @param {number} index the index of the request to be updated
     */
    const handleEdit = (event, index) => {
        const modifiedRequest = {
            url: event.target.elements.url.value,
            method: event.target.elements.method.value,
            arguments: event.target.elements.arguments.value
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
     * Removes a specific request from the list
     * @param {number} index the index of the request to be removed from the list
     */
    const handleDelete = (index) => {
        editRequests(previous => {
            let newRequests = [...previous];
            newRequests.splice(index, 1);

            return newRequests;
        });

        editResponses(previous => {
            let newResponses = {};

            for (const [key, value] of Object.entries(previous)) {
                let keyInt = parseInt(key);

                if (keyInt > index) {
                    newResponses[keyInt - 1] = value;
                } else if (keyInt === index) {
                    continue;
                } else {
                    newResponses[keyInt] = value;
                }
            }

            return newResponses;
        });
    };

    /**
     * Run the whole workflow, sending the API requests and then saving the results in the state value
     */
    const runAllRequests = () => {
        editResponses(() => {
            return {};
        }); // reset stored responses before running

        let temp = requests.filter((request) => request.method === "get"); //temporarily restrict to GET requests
        temp.map((request, index) => {
            axios({ // make the request
                url: request.url,
                method: request.method
            }).then((response) => { // process values if all went well
                return {
                    data: response.data,
                    status: response.status,
                    statusText: response.statusText
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
            });

            return {};
        });
    };

    return (
        <div className="workflow">
            {requests.length > 0 && requests.map((value, index) => {
                return (
                    <Request
                        key={index}
                        handleSubmit={handleSubmit}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        url={value.url}
                        method={value.method}
                        args={value.arguments}
                        response={Object.keys(responses).length > 0 ? responses[index] : {}}
                        idx={index}
                    />
                );
            })} {/* displays when any request details have been provided */}

            {requests.length > 0 &&
                <div className="has-text-centered">
                    <button data-testid="run" className="button is-primary is-rounded is-medium run-button" onClick={runAllRequests}>
                        <TextIcon text="Run Workflow" iconName="fa-play" />
                    </button>
                </div>
            } {/* displays when any request details have been provided */}

            <Request handleSubmit={handleSubmit} newInput={true} />
        </div>
    );
}

export { Workflow };