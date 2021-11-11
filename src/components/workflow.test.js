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

describe("Adding Information", () => {
    test("Submit Request", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.type(getByTestId("url-main"), "http://httpstat.us/404"); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("url-0")).toBeInTheDocument(); // new cell present
        expect(getByTestId("url-main")).toHaveTextContent(/$/); // URL input blank

        expect(getByTestId("run")).toBeInTheDocument(); // run button present
        expect(screen.getByText("Run Workflow")).toBeInTheDocument(); // run button says "Run Workflow"
    })
});