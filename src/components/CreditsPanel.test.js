import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreditsPanel from "./CreditsPanel";

jest.mock("framer-motion", () => {
  const React = require("react");
  const motion = new Proxy(
    {},
    {
      get(_, tag) {
        return ({
          children,
          animate,
          initial,
          exit,
          variants,
          transition,
          ...props
        }) => React.createElement(tag, props, children);
      },
    },
  );
  return {
    motion,
    AnimatePresence: ({ children }) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock("../utils/sounds", () => ({
  sfx: { navHover: jest.fn() },
}));

const onClose = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("CreditsPanel", () => {
  test("renders CREDITS title", () => {
    render(<CreditsPanel onClose={onClose} />);
    expect(screen.getByText("══ CREDITS ══")).toBeInTheDocument();
  });

  test("shows website credit", () => {
    render(<CreditsPanel onClose={onClose} />);
    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("Anjoelo Calderon")).toBeInTheDocument();
  });

  test("BACK button calls onClose", () => {
    render(<CreditsPanel onClose={onClose} />);
    fireEvent.click(screen.getByText("▶ BACK"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clicking overlay calls onClose", () => {
    render(<CreditsPanel onClose={onClose} />);
    fireEvent.click(document.querySelector(".settings-overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
