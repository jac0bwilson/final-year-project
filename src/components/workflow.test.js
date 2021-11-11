import { render, screen, waitFor } from "@testing-library/react";

import { Workflow } from "./workflow";

describe("Workflow Instantiation", () => {
    test("URL Input", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("url-main")).toBeInTheDocument();
    })

    test("HTTP Method", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("method-main")).toBeInTheDocument();
        expect(screen.getByText("GET")).toBeInTheDocument();
    });

    test("Done Button", () => {
        const { getByTestId } = render(<Workflow />);

        expect(getByTestId("done-main")).toBeInTheDocument();
        expect(screen.getByText("Done")).toBeInTheDocument();
    });
});