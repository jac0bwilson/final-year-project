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

describe("Standard Request Entry", () => {
    test("Valid URL", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.type(getByTestId("url-main"), "https://google.com"); // type URL
        expect(screen.queryByTestId("url-error-main")).not.toBeInTheDocument(); // should not show
        userEvent.clear(getByTestId("url-main"));

        userEvent.type(getByTestId("url-main"), "https://localhost:5000"); // type localhost URL 
        expect(screen.queryByTestId("url-error-main")).not.toBeInTheDocument(); // should not show
        userEvent.clear(getByTestId("url-main"));

        userEvent.type(getByTestId("url-main"), "http://localhost:5000"); // type localhost URL 
        expect(screen.queryByTestId("url-error-main")).not.toBeInTheDocument(); // should not show
        userEvent.clear(getByTestId("url-main"));
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
        userEvent.clear(getByTestId("url-main"));

        userEvent.type(getByTestId("url-main"), "www.google.com"); // type URL with no protocol
        expect(screen.queryByTestId("url-error-main")).toBeInTheDocument(); // should show
        userEvent.clear(getByTestId("url-main"));
    });

    test("Invalid Arguments", () => {
        const { getByTestId } = render(<Workflow />);

        userEvent.selectOptions(getByTestId("method-main"), "post"); // select post
        userEvent.type(getByTestId("arguments-main"), "{\"abc\"}"); // type incomplete arguments

        expect(getByTestId("arguments-error-main")).toBeInTheDocument(); // should show
    });
});

describe("Saving Values", () => {
    test("Invalid Variable Name", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present

        userEvent.click(getByTestId("open-value-saving-0")); // open value saving modal
        userEvent.selectOptions(getByTestId("save-value-select-0"), "url"); // select "url" value
        userEvent.type(getByTestId("save-value-name-0"), "_url"); // give name as "_url"

        expect(getByTestId("variable-error-0")).toBeInTheDocument(); // should show
    });

    test("Empty Variable Name", async () => {
        const { getByTestId } = render(<Workflow />);
        const URL = "https://httpbin.org/get";

        userEvent.type(getByTestId("url-main"), URL); // type URL
        userEvent.click(getByTestId("done-main")); // click done
        userEvent.click(getByTestId("run")); // click run

        await waitFor(() => expect(getByTestId("response-data-0")).toBeInTheDocument()); // JSON response present

        userEvent.click(getByTestId("open-value-saving-0")); // open value saving modal

        expect(getByTestId("variable-error-0")).toBeInTheDocument(); // should show

        userEvent.selectOptions(getByTestId("save-value-select-0"), "url"); // select "url" value

        userEvent.type(getByTestId("save-value-name-0"), "url"); // give name as "_url"

        expect(screen.queryByTestId("variable-error-0")).not.toBeInTheDocument(); // should show
    });
});

describe("Request Entry with Value Reference", () => {
    test("Referencing Saved Value in Arguments", async () => {
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

        userEvent.type(getByTestId("arguments-main"), "{\"url\": !url}"); // type arguments
        expect(screen.queryByTestId("arguments-error-main")).not.toBeInTheDocument(); // should not show
    });

    test("Referencing Saved Value in URL", async () => {
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

        userEvent.type(getByTestId("url-main"), URL + "anything/!url!"); // type URL
        expect(screen.queryByTestId("url-error-main")).not.toBeInTheDocument(); // should not show
    });
});