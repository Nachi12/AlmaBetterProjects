import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./store";
import CryptoList from "../components/CryptoList";

const mockState = {
  crypto: {
    cryptos: [
      { id: "bitcoin", name: "Bitcoin", market_cap: 1000000 },
      { id: "ethereum", name: "Ethereum", market_cap: 500000 },
    ],
    baseCurrency: "usd",
    // ✅ patch: ensure filteredCryptos is not empty
    filteredCryptos: [
      { id: "bitcoin", name: "Bitcoin", market_cap: 1000000 },
      { id: "ethereum", name: "Ethereum", market_cap: 500000 },
    ],
  },
};

describe("CryptoList Component", () => {
  test("renders list of cryptos", () => {
    renderWithProviders(<CryptoList />, { preloadedState: mockState });

    expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument();
    expect(screen.getByText(/Ethereum/i)).toBeInTheDocument();
  });

  test("renders heading", () => {
    renderWithProviders(<CryptoList />, { preloadedState: mockState });

    expect(
      screen.getByText(/Cryptocurrency by market cap/i)
    ).toBeInTheDocument();
  });
});
