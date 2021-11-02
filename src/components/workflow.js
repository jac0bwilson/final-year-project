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
     * @param {*} index the index of the request to be updated
     */
    const handleEdit = (event, index) => {
        const modifiedRequest = {
            url: event.target.url.value,
            method: event.target.method.value
        };

        let newRequests = [...requests];
        newRequests[index] = modifiedRequest;

        editRequests(newRequests);
    };

    /**
     * Removes a specific request from the list
     * @param {*} index the index of the request to be removed from the list
     */
    const handleDelete = (index) => {
        let newRequests = [...requests];
        newRequests.splice(index, 1);

        editRequests(newRequests);
    };

    /**
     * Run the whole workflow, sending the API requests and then saving the results
     */
    const runAllRequests = () => {
        editResponses({}); // reset stored responses before running

        let temp = requests.filter((request) => request.method === "get"); //temporarily restrict to GET requests
        temp.map((request, index) => {
            axios({
                url: request.url,
                method: request.method
            }).then((response) => {
                console.log(response);

                return {
                    data: response.data,
                    status: response.status,
                    statusText: response.statusText
                };
            }).catch((error) => {
                // console.log(error.toJSON());
                console.log(error.response);

                return {
                    status: error.response.status,
                    statusText: error.response.statusText
                };
            }).then((values) => {
                let newResponses = {...responses};

                newResponses[index] = values;
                editResponses(newResponses);
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