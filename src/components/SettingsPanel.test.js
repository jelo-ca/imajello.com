import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SettingsPanel from "./SettingsPanel";

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
  sfx: { toggle: jest.fn() },
}));

const defaults = {
  onClose: jest.fn(),
  darkMode: false,
  setDarkMode: jest.fn(),
  scanlines: false,
  setScanlines: jest.fn(),
  sfxVol: 0.7,
  setSfxVol: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe("SettingsPanel", () => {
  test("renders OPTIONS title", () => {
    render(<SettingsPanel {...defaults} />);
    expect(screen.getByText("══ OPTIONS ══")).toBeInTheDocument();
  });

  test("shows DARK MODE toggle as OFF", () => {
    render(<SettingsPanel {...defaults} darkMode={false} />);
    const toggles = screen.getAllByText("[ OFF ]");
    expect(toggles.length).toBeGreaterThanOrEqual(1);
  });

  test("shows DARK MODE toggle as ON when darkMode=true", () => {
    render(<SettingsPanel {...defaults} darkMode={true} />);
    // RTL normalizes whitespace; use regex to match "[ ON  ]" (two spaces)
    const onToggles = screen.getAllByText(/\[ ON\s+\]/);
    expect(onToggles.length).toBeGreaterThanOrEqual(1);
  });

  test("SFX volume slider has the correct value", () => {
    render(<SettingsPanel {...defaults} sfxVol={0.7} />);
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(1);
    expect(sliders[0]).toHaveValue("0.7");
  });

  test("displays SFX volume as a percentage", () => {
    render(<SettingsPanel {...defaults} sfxVol={0.7} />);
    expect(screen.getByText("70")).toBeInTheDocument();
  });

  test("displays coming soon label for music", () => {
    render(<SettingsPanel {...defaults} />);
    expect(screen.getByText("► MUSIC: COMING SOON")).toBeInTheDocument();
  });

  test("clicking RESUME calls onClose", () => {
    render(<SettingsPanel {...defaults} />);
    fireEvent.click(screen.getByText("▶ RESUME"));
    expect(defaults.onClose).toHaveBeenCalledTimes(1);
  });

  test("clicking DARK MODE row calls setDarkMode", () => {
    render(<SettingsPanel {...defaults} />);
    fireEvent.click(screen.getByText("► DARK MODE"));
    expect(defaults.setDarkMode).toHaveBeenCalled();
  });

  test("clicking SCANLINES row calls setScanlines", () => {
    render(<SettingsPanel {...defaults} />);
    fireEvent.click(screen.getByText("► SCANLINES"));
    expect(defaults.setScanlines).toHaveBeenCalled();
  });

  test("changing SFX slider calls setSfxVol", () => {
    render(<SettingsPanel {...defaults} />);
    const sliders = screen.getAllByRole("slider");
    fireEvent.change(sliders[0], { target: { value: "0.5" } });
    expect(defaults.setSfxVol).toHaveBeenCalledWith(0.5);
  });

  test("clicking overlay calls onClose", () => {
    render(<SettingsPanel {...defaults} />);
    fireEvent.click(document.querySelector(".settings-overlay"));
    expect(defaults.onClose).toHaveBeenCalledTimes(1);
  });
});
