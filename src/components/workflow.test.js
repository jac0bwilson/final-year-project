import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Workflow } from "./workflow";

describe("Workflow Instantiation", () => {
    test("URL Input", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("url-main")).toBeInTheDocument(); // URL input present
    })

    test("HTTP Method", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("method-main")).toBeInTheDocument(); // method input present
        expect(screen.getByText("GET")).toBeInTheDocument(); // method defaults to GET
    });

    test("Done Button", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("done-main")).toBeInTheDocument(); // done button present
        expect(screen.getByText("Done")).toBeInTheDocument(); // done button says "Done"
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

    test("Edit Request URL", () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "http://httpstat.us/404";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("request-0")).toBeInTheDocument(); // new cell present
        expect(getByTestId("url-0")).toHaveDisplayValue(URL); // URL in field
        expect(getByTestId("url-main")).toHaveDisplayValue(/^$/); // URL input blank

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
        expect(getByTestId("method-0")).toHaveDisplayValue(METHOD.toUpperCase()); // new URL in field
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
});