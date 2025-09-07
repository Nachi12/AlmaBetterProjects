import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./store";
import ChartComponent from "../components/ChartComponent";

const mockState = {
  crypto: {
    cryptos: [
      { id: "bitcoin", name: "Bitcoin" },
      { id: "ethereum", name: "Ethereum" },
    ],
    baseCurrency: "usd",
    filteredCryptos: [], // not needed here
  },
};

describe("ChartComponent", () => {
  test("renders chart component", () => {
    renderWithProviders(<ChartComponent />, { preloadedState: mockState });

    // Check placeholder
    expect(
      screen.getByText(/Select at least one cryptocurrency to view chart/i)
    ).toBeInTheDocument();
  });

  test("can select a cryptocurrency", () => {
    renderWithProviders(<ChartComponent />, { preloadedState: mockState });

    const selects = screen.getAllByRole("combobox");
    const cryptoSelect = selects[2]; // third dropdown = cryptocurrency

    fireEvent.change(cryptoSelect, { target: { value: "bitcoin" } });

    // ✅ Check option is actually selected
    expect(screen.getByRole("option", { name: /Bitcoin/i }).selected).toBe(true);
  });

  test("can change chart type via dropdown", () => {
    renderWithProviders(<ChartComponent />, { preloadedState: mockState });

    const selects = screen.getAllByRole("combobox");
    const chartTypeSelect = selects[1]; // second dropdown = chart type

    fireEvent.change(chartTypeSelect, { target: { value: "bar" } });

    expect(
      screen.getByRole("option", { name: /Bar Chart/i }).selected
    ).toBe(true);
  });
});
