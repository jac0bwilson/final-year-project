import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Workflow } from "../components/workflow";

import { formatJSON } from "../utilities";

/**
 * The URL.createObjectURL() function is not available in the testing implementation.
 * The function must be 'mocked' to provide an implementation for use.
 * https://stackoverflow.com/questions/52968969/jest-url-createobjecturl-is-not-a-function
 */
window.URL.createObjectURL = jest.fn();

afterEach(() => {
    window.URL.createObjectURL.mockReset();
});

describe("Submitting Requests", () => {
    test("Submit Request", () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "http://httpstat.us/404";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present
        expect(getByTestId("url-0")).toHaveDisplayValue(URL); // URL in field
        expect(getByTestId("url-main")).toHaveDisplayValue(/^$/); // URL input blank

        expect(getByTestId("run")).toBeInTheDocument(); // run button present
        expect(screen.getByText("Run Workflow")).toBeInTheDocument(); // run button says "Run Workflow"
    });

    test("Submit Request with Arguments", () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "http://httpstat.us/404";
        const ARGS = "{\"a\":\"abc\"}";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.selectOptions(getByTestId("method-main"), "post"); // select post
        userEvent.type(getByTestId("arguments-main"), ARGS); // type arguments
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present
        expect(getByTestId("url-0")).toHaveDisplayValue(URL); // URL in field
        expect(getByTestId("arguments-0")).toHaveDisplayValue(formatJSON(ARGS)); // arguments in field
        expect(getByTestId("url-main")).toHaveDisplayValue(/^$/); // URL input blank
        expect(getByTestId("arguments-main")).toHaveDisplayValue(/^$/); // arguments input blank

        expect(getByTestId("run")).toBeInTheDocument(); // run button present
        expect(screen.getByText("Run Workflow")).toBeInTheDocument(); // run button says "Run Workflow"
    });
});

describe("Editing Requests", () => {
    test("Edit Request URL", () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "http://httpstat.us/404";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("edit-0")); // click edit
        userEvent.type(getByTestId("url-0"), "{backspace}0"); // change url
        userEvent.click(getByTestId("done-0")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // same cell present
        expect(getByTestId("url-0")).toHaveDisplayValue("http://httpstat.us/400"); // new URL in field
    });

    test("Edit Request Method", () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "http://httpstat.us/404";
        const METHOD = "post";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("edit-0")); // click edit
        userEvent.selectOptions(getByTestId("method-0"), METHOD); // select post
        userEvent.click(getByTestId("done-0")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // same cell present
        expect(getByTestId("method-0")).toHaveDisplayValue(METHOD.toUpperCase()); // new method in field
    });

    test("Edit Request Arguments", () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "http://httpstat.us/404";
        const ARGS_1 = "{\"a\":\"abc\"}";
        const ARGS_2 = "{\"a\":\"def\"}";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.selectOptions(getByTestId("method-main"), "post"); // select post
        userEvent.type(getByTestId("arguments-main"), ARGS_1); // type arguments
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("edit-0")); // click edit
        userEvent.clear(getByTestId("arguments-0")); // clear arguments
        userEvent.type(getByTestId("arguments-0"), ARGS_2); // change arguments
        userEvent.click(getByTestId("done-0")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // same cell present
        expect(getByTestId("arguments-0")).toHaveDisplayValue(formatJSON(ARGS_2)); // new arguments in field
    });
});

describe("Deleting Requests", () => {
    test("Delete Entered Request", () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "http://httpstat.us/404";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("edit-0")); // click edit
        userEvent.click(getByTestId("delete-0")); // click delete

        expect(screen.queryByTestId("url-0")).not.toBeInTheDocument(); // should be removed
    });

    test("Delete First of Multiple", () => {
        const { getByTestId } = render(<Workflow />);
        const URL_1 = "http://httpstat.us/404";
        const URL_2 = "http://httpstat.us/400";
        const METHOD_2 = "post";

        userEvent.type(getByTestId("url-main"), URL_1); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.type(getByTestId("url-main"), URL_2); // type URL
        userEvent.selectOptions(getByTestId("method-main"), METHOD_2); // select post
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-1")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("edit-0")); // click edit
        userEvent.click(getByTestId("delete-0")); // click delete

        expect(screen.queryByTestId("url-1")).not.toBeInTheDocument(); // 0 removed, 1 set to 0
        expect(screen.queryByTestId("method-1")).not.toBeInTheDocument(); // 0 removed, 1 set to 0
        expect(screen.queryByDisplayValue(URL_1)).not.toBeInTheDocument(); // first URL removed

        expect(screen.getByTestId("url-0")).toBeInTheDocument(); // 0 removed, 1 set to 0
        expect(screen.getByTestId("method-0")).toBeInTheDocument(); // 0 removed, 1 set to 0
        expect(screen.getByDisplayValue(URL_2)).toBeInTheDocument(); // second URL present
        expect(getByTestId("method-0")).toHaveDisplayValue(METHOD_2.toUpperCase()); // method present
    });
});

describe("Navbar", () => {
    test("Workflow Uploading", async () => {
        window.confirm = jest.fn().mockReturnValue(true);
        window.alert = jest.fn();

        const { getByTestId } = render(<Workflow />);
        const file = new File([`
        {
            "requests": [
                {
                    "identifier": "vCVdZf4fec0lZjZpSIl2H",
                    "url": "https://httpbin.org/get",
                    "method": "get",
                    "arguments": "",
                    "headers": ""
                }
            ],
            "responses": {},
            "saved": {}
        }`], "basic.json", { type: "application/json" }); // create JSON file

        userEvent.upload(getByTestId("upload"), file); // upload JSON file

        expect(getByTestId("upload").files).toHaveLength(1); // one file present
        expect(window.confirm).toHaveBeenCalledTimes(1); // confirmation asked for once

        await waitFor(() => expect(getByTestId("request-0")).toBeInTheDocument()); // request present
    });

    test("Workflow Downloading", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("download")).not.toHaveAttribute("href", ""); // link present
        expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1); // file turned into URL once
    });

    test("Workflow Reset", async () => {
        window.confirm = jest.fn().mockReturnValue(true);

        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // request submitted

        userEvent.click(getByTestId("reset")); // click reset

        await waitFor(() => expect(screen.queryByTestId("request-0")).not.toBeInTheDocument()); // workflow cleared
    });

    test("Help Screen", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("help")).not.toHaveClass("is-active"); // not showing help screen

        userEvent.click(getByTestId("help-toggle")); // click help button

        expect(getByTestId("help")).toHaveClass("is-active"); // showing help screen
    });
});

describe("Other", () => {
    test("Insert New Request", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.click(getByTestId("done-main")); // add blank request
        userEvent.click(getByTestId("done-main")); // add another blank request

        expect(getByTestId("request-0")).toBeInTheDocument();
        expect(getByTestId("request-1")).toBeInTheDocument();

        userEvent.click(getByTestId("insert-0")); // insert new request in the middle

        expect(getByTestId("request-0")).toBeInTheDocument();
        expect(getByTestId("request-1")).toBeInTheDocument();
        expect(getByTestId("request-2")).toBeInTheDocument();
    });

    test("Toggle to Headers", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present

        userEvent.click(getByTestId("toggle-headers-0")); // click headers switch

        const { getByText } = within(getByTestId("response-data-text-0"));
        expect(getByText("\"content-type\": \"application/json\"", { exact: false })).toBeInTheDocument(); // header string present
    });

    test("Opening Sidebar", async () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.click(getByTestId("show-sidebar")); // show the sidebar

        await waitFor(() => expect(getByTestId("sidebar")).toBeInTheDocument()); // sidebar present

        userEvent.click(getByTestId("show-sidebar")); // hide the sidebar

        await waitFor(() => expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument()); // sidebar not present
    });
});