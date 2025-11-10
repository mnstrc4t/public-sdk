# Public.com TypeScript SDK

Minimal TypeScript SDK for the Public Trading REST API.

## Installation

```typescript
import {
  createClient,
  InstrumentType,
  OrderSide,
  OrderType,
} from "jsr:@public/deno-sdk";
```

## Quick Start

```typescript
const client = createClient({
  auth: { apiKey: "YOUR_SECRET_KEY" },
  accountId: "YOUR_ACCOUNT_ID",
});

// Get quotes
const quotes = await client.getQuotes([
  { symbol: "AAPL", type: InstrumentType.EQUITY },
]);

// Place order
await client.placeOrder({
  orderId: crypto.randomUUID(),
  instrument: { symbol: "AAPL", type: InstrumentType.EQUITY },
  orderSide: OrderSide.BUY,
  orderType: OrderType.LIMIT,
  quantity: 10,
  limitPrice: "150.00",
  expiration: { timeInForce: TimeInForce.DAY },
});
```

## Authentication

**API Key:**

```typescript
createClient({
  auth: { apiKey: "YOUR_SECRET_KEY", validityMinutes: 15 },
  accountId: "YOUR_ACCOUNT_ID",
});
```

**OAuth:**

```typescript
createClient({
  auth: {
    oauth: {
      clientId: "YOUR_CLIENT_ID",
      redirectUri: "http://localhost:8000/callback",
    },
  },
});
```

## API Methods

| Method                                      | HTTP   | Description                 |
| ------------------------------------------- | ------ | --------------------------- |
| `getAccounts()`                             | GET    | Get all accounts            |
| `getPortfolio(accountId?)`                  | GET    | Get portfolio holdings      |
| `getHistory(request?, accountId?)`          | GET    | Get transaction history     |
| `getQuotes(instruments[], accountId?)`      | POST   | Get real-time quotes        |
| `getAllInstruments(request?)`               | GET    | List tradable instruments   |
| `getInstrument(symbol, type)`               | GET    | Get instrument details      |
| `getOptionExpirations(request, accountId?)` | POST   | Get option expiration dates |
| `getOptionChain(request, accountId?)`       | POST   | Get option chain            |
| `getOptionGreeks(osiSymbol, accountId?)`    | GET    | Get option Greeks           |
| `preflightOrder(request, accountId?)`       | POST   | Simulate order              |
| `preflightMultiLeg(request, accountId?)`    | POST   | Simulate multi-leg order    |
| `placeOrder(request, accountId?)`           | POST   | Place single-leg order      |
| `placeMultiLegOrder(request, accountId?)`   | POST   | Place multi-leg order       |
| `getOrder(orderId, accountId?)`             | GET    | Get order status            |
| `cancelOrder(orderId, accountId?)`          | DELETE | Cancel order                |
