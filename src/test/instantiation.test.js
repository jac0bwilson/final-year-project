import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Workflow } from "../components/workflow";

/**
 * The URL.createObjectURL() function is not available in the testing implementation.
 * The function must be 'mocked' to provide an implementation for use.
 * https://stackoverflow.com/questions/52968969/jest-url-createobjecturl-is-not-a-function
 */
window.URL.createObjectURL = jest.fn();

afterEach(() => {
    window.URL.createObjectURL.mockReset();
});

describe("Request Entry Elements", () => {
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
    });

    test("Edit Button", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("edit-0")).toBeInTheDocument(); // edit button present
    });
});

describe("Submitted Request Elements", () => {
    test("Run Individual Button", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("run-individual-0")).toBeInTheDocument(); // run individual button present
    });

    test("Run From Point Button", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("run-onwards-0")).toBeInTheDocument(); // run onwards button present
    });

    test("Save Values Button", async () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.type(getByTestId("url-main"), "https://httpbin.org/get"); // type URL

        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")) // click run

        await waitFor(() => expect(getByTestId("open-value-saving-0")).toBeInTheDocument()); // save values button present
    });

    test("Save Values Modal", async () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.type(getByTestId("url-main"), "https://httpbin.org/get"); // type URL

        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")) // click run

        await waitFor(() => expect(getByTestId("open-value-saving-0")).toBeInTheDocument()); // save values button present

        userEvent.click(getByTestId("open-value-saving-0")); // click save values

        expect(getByTestId("value-saving-0")).toBeInTheDocument(); // save values modal present
        expect(getByTestId("save-value-select-0")).toBeInTheDocument(); // save values selection present
        expect(getByTestId("save-value-name-0")).toBeInTheDocument(); // save values naming present
        expect(getByTestId("save-value-0")).toBeInTheDocument(); // save values button present
    });

    test("Payload/Header Toggle", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("toggle-payload-main")).toBeInTheDocument(); // payload toggle present
        expect(getByTestId("toggle-headers-main")).toBeInTheDocument(); // headers toggle present
    });
});

describe("Workflow Elements", () => {
    test("Run Workflow Button", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("run")).toBeInTheDocument(); // run button present
    });

    test("Insert Below Button", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("insert-0")).toBeInTheDocument(); // run button present
    });

    test("Sidebar Toggle Button", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("show-sidebar")).toBeInTheDocument(); // sidebar toggle present
    });
});

describe("Navbar Elements", () => {
    test("Workflow Upload Button", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("upload")).toBeInTheDocument(); // upload button present
    });

    test("Workflow Download Button", () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("download")).toBeInTheDocument(); // download button present
    });

    test("Workflow Reset Button", () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done

        expect(getByTestId("reset")).toBeInTheDocument(); // reset button present
    });

    test("Help Button", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("help-toggle")).toBeInTheDocument(); // help button present
    });
});