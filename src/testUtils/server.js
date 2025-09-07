// src/__tests__/server.js
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
  rest.get('https://api.example.com/cryptos', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 'btc', name: 'Bitcoin' },
        { id: 'eth', name: 'Ethereum' },
      ])
    );
  })
);

// Enable API mocking before tests
beforeAll(() => server.listen());
// Reset after each test
afterEach(() => server.resetHandlers());
// Clean up after tests
afterAll(() => server.close());
