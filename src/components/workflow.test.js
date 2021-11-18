import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Workflow } from "./workflow";

describe("Workflow Instantiation", () => {
    test("URL", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("url-main")).toBeInTheDocument(); // URL input present
    });

    test("HTTP Method", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("method-main")).toBeInTheDocument(); // method input present
        expect(screen.getByText("GET")).toBeInTheDocument(); // method defaults to GET
    });

    test("Arguments", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("arguments-main")).toBeInTheDocument(); // arguments input present
    });

    test("Done Button", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("done-main")).toBeInTheDocument(); // done button present
        expect(screen.getByText("Done")).toBeInTheDocument(); // done button says "Done"
    });
});

describe("Data Validation", () => {
    test("Valid URL", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.type(getByTestId("url-main"), "https://google.com"); // type URL

        expect(screen.queryByTestId("url-error-main")).not.toBeInTheDocument(); // should not show
    });

    test("Valid Arguments", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.type(getByTestId("arguments-main"), "{\"abc\":\"def\"}"); // type arguments

        expect(screen.queryByTestId("arguments-error-main")).not.toBeInTheDocument(); // should not show
    });

    test("Invalid URL", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.type(getByTestId("url-main"), "https://google"); // type incomplete URL

        expect(screen.queryByTestId("url-error-main")).toBeInTheDocument(); // should show
    });

    test("Invalid Arguments", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.type(getByTestId("arguments-main"), "{\"abc\"}"); // type incomplete arguments

        expect(screen.queryByTestId("arguments-error-main")).toBeInTheDocument(); // should show
    });
});

describe("Interaction", () => {
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
        userEvent.type(getByTestId("arguments-main"), ARGS); // type arguments
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present
        expect(getByTestId("url-0")).toHaveDisplayValue(URL); // URL in field
        expect(getByTestId("arguments-0")).toHaveDisplayValue(JSON.stringify(JSON.parse(ARGS), null, 2)); // arguments in field
        expect(getByTestId("url-main")).toHaveDisplayValue(/^$/); // URL input blank
        expect(getByTestId("arguments-main")).toHaveDisplayValue(/^$/); // arguments input blank

        expect(getByTestId("run")).toBeInTheDocument(); // run button present
        expect(screen.getByText("Run Workflow")).toBeInTheDocument(); // run button says "Run Workflow"
    });

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
        userEvent.type(getByTestId("arguments-main"), ARGS_1); // type arguments
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("edit-0")); // click edit
        userEvent.clear(getByTestId("arguments-0")); // clear arguments
        userEvent.type(getByTestId("arguments-0"), ARGS_2); // change arguments
        userEvent.click(getByTestId("done-0")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // same cell present
        expect(getByTestId("arguments-0")).toHaveDisplayValue(JSON.stringify(JSON.parse(ARGS_2), null, 2)); // new arguments in field
    });

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

        expect(screen.queryByTestId("url-0")).toBeInTheDocument(); // 0 removed, 1 set to 0
        expect(screen.queryByTestId("method-0")).toBeInTheDocument(); // 0 removed, 1 set to 0
        expect(screen.queryByDisplayValue(URL_2)).toBeInTheDocument(); // second URL present
        expect(getByTestId("method-0")).toHaveDisplayValue(METHOD_2.toUpperCase()); // method present
    });
});

describe("Running Requests", () => {
    test("404 Error", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "http://httpstat.us/404";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("error-0")).toBeInTheDocument()); // 404 error present
    });

    test("Successful GET Request", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://yesno.wtf/api";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present

        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present
    });

    test("Successful POST Request", async () => {
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

    test("Successful DELETE Request", async () => {
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

    test("Successful PUT Request", async () => {
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