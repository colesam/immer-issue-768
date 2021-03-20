# Reproduction of Immer Issue #768

This repository reproduces the issue outlined in https://github.com/immerjs/immer/issues/768.

In short, I believe applying a `replace` patch on certain types of state causes undesirable
behavior when the result of that patch is passed to `produce`.

The error is that any subsequent updates using `produce` to the result of `applyPatch` will mutate 
the `produce` function's `base` parameter, which is undesirable for an immutability library.

## Project setup

```bash
npm install
npm start
```

## Test cases

This repository tests 9 scenarios that test different structures of state. You can find the tests
in `src/reproduce.test.ts`. I outline the basic setup of each test and their results below.

### TEST 1 - state.stocks is a map and stocks are plain objects, with patch replacing state.stocks ✅

```ts

type State = { 
  stocks: Map<string, { ticker: string; name: string; priceHistory: number[] }>;
};

const errorProducingPatch = [
  {
    op: "replace",
    path: ["stocks"],
    value: makeInitialState().stocks, // Map<string, {ticker: string; name: string; priceHistory: number[]>
  },
] as Patch[];
```

️This setup **does not reproduce** the issue described above.

### TEST 2 - state.stocks is a map of [immerable] classes, with patch replacing state.stocks ⚠️

```ts
type State = {
  stocks: Map<string, Stock>;
};

const errorProducingPatch = [
  {
    op: "replace",
    path: ["stocks"],
    value: makeInitialState().stocks, // Map<string, Stock>
  },
] as Patch[];
```

️This setup **reproduces** the issue described above.

### TEST 3 - state.stocks is a map of [immerable] classes, with patch replacing state root ✅

```ts
type State = {
  stocks: Map<string, Stock>;
};

const errorProducingPatch = [
  {
    op: "replace",
    path: [],
    value: makeInitialState(), // State
  },
] as Patch[];
```

️This setup **does not reproduce** the issue described above.

### TEST 4 - state.stocks is an object keying [immerable] classes, with patch replacing state.stocks ⚠️

```ts
type State = {
  stocks: { [key: string]: Stock };
};

const errorProducingPatch = [
  {
    op: "replace",
    path: ["stocks"],
    value: makeInitialState().stocks, // { [key: string]: Stock }
  },
] as Patch[];
```

️This setup **reproduces** the issue described above.

### TEST 5 - state.stocks is an array of [immerable] classes, with patch replacing state.stocks ⚠️

```ts
type State = {
  stocks: Stock[];
};

const errorProducingPatch = [
  {
    op: "replace",
    path: ["stocks"],
    value: makeInitialState().stocks, // Stock[]
  },
] as Patch[];
```

️This setup **reproduces** the issue described above.

### TEST 6 - state.stock is a single [immerable] class, with patch replacing state.stock ⚠️

```ts
type State = {
  stock: Stock;
};

const errorProducingPatch = [
  {
    op: "replace",
    path: ["stock"],
    value: makeInitialState().stock, // Stock
  },
] as Patch[];
```

️This setup **reproduces** the issue described above.

### TEST 7 - state is an array of [immerable] classes, with patch replacing state[0] ⚠️

```ts
type State = Stock[];

const errorProducingPatch = [
  {
    op: "replace",
    path: [0],
    value: makeInitialState()[0], // Stock
  },
] as Patch[];
```

️This setup **reproduces** the issue described above.

### TEST 8 - state is a map of [immerable] classes, with patch replacing state["INTC"] ⚠️

```ts
type State = Map<string, Stock>;

const errorProducingPatch = [
  {
    op: "replace",
    path: ["INTC"],
    value: makeInitialState().get("INTC"), // Stock
  },
] as Patch[];
```

️This setup **reproduces** the issue described above.

### TEST 9 - state is an [immerable] class, with patch replacing state root ✅

```ts
type State = Stock;

const errorProducingPatch = [
  {
    op: "replace",
    path: [],
    value: makeInitialState(), // Stock
  },
] as Patch[];
```

This setup **does not reproduce** the issue described above.