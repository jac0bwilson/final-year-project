import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Workflow } from "../components/workflow";

import { extractNestedResponseData } from "../utilities";

/**
 * The URL.createObjectURL() function is not available in the testing implementation.
 * The function must be 'mocked' to provide an implementation for use.
 * https://stackoverflow.com/questions/52968969/jest-url-createobjecturl-is-not-a-function
 */
window.URL.createObjectURL = jest.fn();

describe("HTTP Methods", () => {
    test("GET", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present
    });

    test("POST", async () => {
        const { getByTestId } = render(<Workflow />);
        const METHOD = "post";
        const URL = "https://httpbin.org/" + METHOD;
        const DATA = "{\"abc\":\"def\"}";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.selectOptions(getByTestId("method-main"), METHOD); // select method
        userEvent.type(getByTestId("arguments-main"), DATA); // type arguments
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present
    });

    test("DELETE", async () => {
        const { getByTestId } = render(<Workflow />);
        const METHOD = "delete";
        const URL = "https://httpbin.org/" + METHOD;
        const DATA = "{\"abc\":\"def\"}";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.selectOptions(getByTestId("method-main"), METHOD); // select method
        userEvent.type(getByTestId("arguments-main"), DATA); // type arguments
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present
    });

    test("PUT", async () => {
        const { getByTestId } = render(<Workflow />);
        const METHOD = "put";
        const URL = "https://httpbin.org/" + METHOD;
        const DATA = "{\"abc\":\"def\"}";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.selectOptions(getByTestId("method-main"), METHOD); // select method
        userEvent.type(getByTestId("arguments-main"), DATA); // type arguments
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present
    });

    test("PATCH", async () => {
        const { getByTestId } = render(<Workflow />);
        const METHOD = "patch";
        const URL = "https://httpbin.org/" + METHOD;
        const DATA = "{\"abc\":\"def\"}";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.selectOptions(getByTestId("method-main"), METHOD); // select method
        userEvent.type(getByTestId("arguments-main"), DATA); // type arguments
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present
    });

    test("HEAD", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.selectOptions(getByTestId("method-main"), "head"); // select method
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present
    });

    test("OPTIONS", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.selectOptions(getByTestId("method-main"), "options"); // select method
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present
    });
});

describe("Refined Controls", () => {
    test("Run Individual Request", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-1")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run-individual-0")); // click run individual

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present
        await waitFor(() => expect(screen.queryByTestId("response-data-1")).not.toBeInTheDocument()); // JSON response not present
    });

    test("Run from Point Onwards", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-1")).toBeInTheDocument(); // new cell present

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-2")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run-onwards-1")); // click run individual

        await waitFor(() => expect(screen.queryByTestId("response-data-0")).not.toBeInTheDocument()); // JSON response not present
        await waitFor(() => expect(getByTestId("response-data-1")).toBeInTheDocument()); // JSON response present
        await waitFor(() => expect(getByTestId("response-data-2")).toBeInTheDocument()); // JSON response present
    });
});

describe("Saved Values", () => {
    test("Using Saved Value in Arguments", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/";
        const METHOD = "get";
        const METHOD_2 = "post";

        userEvent.type(getByTestId("url-main"), URL + METHOD); // type URL
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present

        userEvent.click(getByTestId("open-value-saving-0")); // open value saving modal
        userEvent.selectOptions(getByTestId("save-value-select-0"), "url"); // select "url" value
        userEvent.type(getByTestId("save-value-name-0"), "url"); // give name as "url"
        userEvent.click(getByTestId("save-value-0")); // click save value

        userEvent.type(getByTestId("url-main"), URL + METHOD_2); // type URL
        userEvent.selectOptions(getByTestId("method-main"), METHOD_2); // select method
        userEvent.type(getByTestId("arguments-main"), "{\"url\": !url!}"); // type arguments
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-1")).toBeInTheDocument()); // JSON response present
    });

    test("Using Saved Value in Headers", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/";
        const METHOD = "get";

        userEvent.type(getByTestId("url-main"), URL + METHOD); // type URL
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present

        userEvent.click(getByTestId("open-value-saving-0")); // open value saving modal
        userEvent.selectOptions(getByTestId("save-value-select-0"), "url"); // select "url" value
        userEvent.type(getByTestId("save-value-name-0"), "url"); // give name as "url"
        userEvent.click(getByTestId("save-value-0")); // click save value

        userEvent.type(getByTestId("url-main"), URL + METHOD); // type URL
        userEvent.type(getByTestId("headers-main"), "{\"url\": !url!}"); // type arguments
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-1")).toBeInTheDocument()); // JSON response present
    });

    test("Regular Expression Replacement in Arguments", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/";
        const METHOD = "get";
        const METHOD_2 = "post";

        userEvent.type(getByTestId("url-main"), URL + METHOD); // type URL
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present

        userEvent.click(getByTestId("open-value-saving-0")); // open value saving modal
        userEvent.selectOptions(getByTestId("save-value-select-0"), "url"); // select "url" value
        userEvent.type(getByTestId("save-value-name-0"), "url"); // give name as "url"
        userEvent.click(getByTestId("save-value-0")); // click save value

        userEvent.type(getByTestId("url-main"), URL + METHOD_2); // type URL
        userEvent.selectOptions(getByTestId("method-main"), METHOD_2); // select method
        userEvent.type(getByTestId("arguments-main"), "{\"url\": !url:https:http!}"); // type arguments with replacement https -> http
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-1")).toBeInTheDocument()); // JSON response present

        const { getByText } = within(getByTestId("response-data-text-1"));

        expect(getByText("http://httpbin.org/get", { exact: false })).toBeInTheDocument(); // variable with replaced text should be returned
    });

    test("Regular Expression Removal in Arguments", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/";
        const METHOD = "get";
        const METHOD_2 = "post";

        userEvent.type(getByTestId("url-main"), URL + METHOD); // type URL
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present

        userEvent.click(getByTestId("open-value-saving-0")); // open value saving modal
        userEvent.selectOptions(getByTestId("save-value-select-0"), "url"); // select "url" value
        userEvent.type(getByTestId("save-value-name-0"), "url"); // give name as "url"
        userEvent.click(getByTestId("save-value-0")); // click save value

        userEvent.type(getByTestId("url-main"), URL + METHOD_2); // type URL
        userEvent.selectOptions(getByTestId("method-main"), METHOD_2); // select method
        userEvent.type(getByTestId("arguments-main"), "{\"url\": !url:https:!}"); // type arguments with replacement https -> http
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-1")).toBeInTheDocument()); // JSON response present

        const { getByText } = within(getByTestId("response-data-text-1"));

        expect(getByText("://httpbin.org/get", { exact: false })).toBeInTheDocument(); // variable with replaced text should be returned
    });

    test("Updating Saved Value", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/";
        const METHOD = "get";
        const METHOD_2 = "post";
        const KEY = "headers/X-Amzn-Trace-Id";

        userEvent.type(getByTestId("url-main"), URL + METHOD); // type URL
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present

        userEvent.click(getByTestId("open-value-saving-0")); // open value saving modal
        userEvent.selectOptions(getByTestId("save-value-select-0"), KEY); // select value
        userEvent.type(getByTestId("save-value-name-0"), "trace"); // give name
        userEvent.click(getByTestId("save-value-0")); // click save value

        let trace1 = extractNestedResponseData(KEY, { "data": JSON.parse(getByTestId("response-data-text-0").innerHTML) }); // save the value for comparison

        userEvent.click(getByTestId("run"));
        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present

        let trace2 = extractNestedResponseData(KEY, { "data": JSON.parse(getByTestId("response-data-text-0").innerHTML) }); // save the value for comparison

        trace1 = trace1.split("=")[1];
        trace2 = trace2.split("=")[1];

        userEvent.type(getByTestId("url-main"), URL + METHOD_2); // type URL
        userEvent.selectOptions(getByTestId("method-main"), METHOD_2); // select method
        userEvent.type(getByTestId("arguments-main"), "{\"check\": !trace!}"); // type arguments
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run-individual-1")); // click run

        await waitFor(() => expect(getByTestId("response-data-1")).toBeInTheDocument()); // JSON response present

        const { queryByText, getByText } = within(getByTestId("response-data-text-1"));

        expect(queryByText(trace1, { exact: false })).not.toBeInTheDocument();
        expect(getByText(trace2, { exact: false })).toBeInTheDocument();
    });

    test("Using Saved Value in URL", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/";
        const METHOD = "get";

        userEvent.type(getByTestId("url-main"), URL + METHOD); // type URL
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present

        userEvent.click(getByTestId("open-value-saving-0")); // open value saving modal
        userEvent.selectOptions(getByTestId("save-value-select-0"), "url"); // select "url" value
        userEvent.type(getByTestId("save-value-name-0"), "url"); // give name as "url"
        userEvent.click(getByTestId("save-value-0")); // click save value

        userEvent.type(getByTestId("url-main"), URL + "anything/!url!"); // type URL
        userEvent.selectOptions(getByTestId("method-main"), METHOD); // select method
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-1")).toBeInTheDocument()); // JSON response present

        const { getByText } = within(getByTestId("response-data-text-1"));
        expect(getByText(URL + METHOD, { exact: false })).toBeInTheDocument();
    });

    test("Requesting Previously Saved URL", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present

        userEvent.click(getByTestId("open-value-saving-0")); // open value saving modal
        userEvent.selectOptions(getByTestId("save-value-select-0"), "url"); // select "url" value
        userEvent.type(getByTestId("save-value-name-0"), "url"); // give name as "url"
        userEvent.click(getByTestId("save-value-0")); // click save value

        userEvent.type(getByTestId("url-main"), "!url:raw!"); // reference URL
        expect(screen.queryByTestId("url-error-main")).not.toBeInTheDocument(); // should not show

        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-1")).toBeInTheDocument()); // JSON response present
    });

    test("Regular Expression Replacement in URL", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/";
        const METHOD = "post"

        userEvent.type(getByTestId("url-main"), URL + METHOD); // type URL
        userEvent.selectOptions(getByTestId("method-main"), METHOD); // select method
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present

        userEvent.click(getByTestId("open-value-saving-0")); // open value saving modal
        userEvent.selectOptions(getByTestId("save-value-select-0"), "url"); // select "url" value
        userEvent.type(getByTestId("save-value-name-0"), "url"); // give name as "url"
        userEvent.click(getByTestId("save-value-0")); // click save value

        userEvent.type(getByTestId("url-main"), "!url:raw:post:get!"); // reference URL

        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-1")).toBeInTheDocument()); // JSON response present

        const { getByText } = within(getByTestId("response-data-text-1"));
        expect(getByText(URL + "get", { exact: false })).toBeInTheDocument();
    });

    test("Arbitrary Value Saving in Sidebar", async () => {
        const { getByTestId } = render(<Workflow />);
    
        userEvent.click(getByTestId("show-sidebar")); // show the sidebar
    
        await waitFor(() => expect(getByTestId("sidebar")).toBeInTheDocument()); // sidebar present

        userEvent.type(getByTestId("save-value-data-main"), "https://httpbin.org/get");
        userEvent.type(getByTestId("save-value-name-main"), "url");
        userEvent.click(getByTestId("save-value-main")); // click save value

        userEvent.click(getByTestId("show-sidebar")); // hide the sidebar

        await waitFor(() => expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument()); // sidebar not present

        userEvent.type(getByTestId("url-main"), "!url:raw!"); // reference URL
        expect(screen.queryByTestId("url-error-main")).not.toBeInTheDocument(); // should not show
    });
});

describe("Other", () => {
    test("404 Error", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/status/404";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("error-0")).toBeInTheDocument()); // 404 error present
    });
})