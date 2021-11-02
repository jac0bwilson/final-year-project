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
            url: event.target.url.value,
            method: event.target.method.value
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
            url: event.target.url.value,
            method: event.target.method.value
        };

        let newRequests = [...requests];
        newRequests[index] = modifiedRequest;

        editRequests(newRequests);

        // remove response when the request is edited
        let newResponses = { ...responses };
        newResponses[index] = {};

        editResponses(newResponses);
    };

    /**
     * Removes a specific request from the list
     * @param {number} index the index of the request to be removed from the list
     */
    const handleDelete = (index) => {
        let newRequests = [...requests];
        newRequests.splice(index, 1);

        editRequests(newRequests);

        // TODO: shuffle all response keys down to adjust for the item being removed
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
                console.log(response);

                return {
                    data: response.data,
                    status: response.status,
                    statusText: response.statusText
                };
            }).catch((error) => { // if an error was thrown, save the status code and description
                // console.log(error.toJSON());
                console.log(error.response);

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
                        response={Object.keys(responses).length > 0 ? responses[index] : {}}
                        idx={index}
                    />
                );
            })} {/* displays when any request details have been provided */}

            {requests.length > 0 &&
                <button className="button is-primary is-rounded is-medium" onClick={runAllRequests}>
                    <TextIcon text="Run Workflow" iconName="fa-play" />
                </button>
            } {/* displays when any request details have been provided */}

            <Request handleSubmit={handleSubmit} newInput={true} />
        </div>
    );
}

export { Workflow };