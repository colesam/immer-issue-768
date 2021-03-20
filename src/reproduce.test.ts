import {
  produce,
  applyPatches,
  enableMapSet,
  enablePatches,
  Patch,
} from "immer";
import { Stock } from "./Stock";

// Test setup
enableMapSet();
enablePatches();

describe("TEST 1 - state.stocks is a map and stocks are plain objects, with patch replacing state.stocks", () => {
  type State = {
    stocks: Map<
      string,
      { ticker: string; name: string; priceHistory: number[] }
    >;
  };

  const makeInitialState = () => ({
    stocks: new Map([
      ["INTC", { ticker: "INTC", name: "Intel", priceHistory: [100] }],
    ]),
  });

  let resetState: State;
  let updatedState: State;
  beforeEach(() => {
    // Set up conditions to produce the error
    const errorProducingPatch = [
      {
        op: "replace",
        path: ["stocks"],
        value: makeInitialState().stocks,
      },
    ] as Patch[];

    // Start with modified state
    const state = produce(makeInitialState(), (draft) => {
      draft.stocks.get("INTC")!.priceHistory.push(101);
    });

    // Use patch to "replace" stocks
    resetState = applyPatches(state, errorProducingPatch);

    // Problems come in when resetState is modified
    updatedState = produce(resetState, (draft) => {
      draft.stocks.get("INTC").priceHistory.push(200);
    });
  });

  // Test for referential equality
  test("`updatedState` does not equal `resetState`", () => {
    expect(resetState).not.toBe(updatedState);
  });
  test("`updatedState.stocks` does not equal `resetState.stocks`", () => {
    expect(resetState.stocks).not.toBe(updatedState.stocks);
  });
  test('`updatedState.stocks.get("INTC") does not equal `resetState.stocks.get("INTC")`', () => {
    expect(resetState.stocks.get("INTC")).not.toBe(
      updatedState.stocks.get("INTC")
    );
  });

  // Test for mutations
  test("stock's price history in `resetState` does not get mutated", () => {
    expect(resetState.stocks.get("INTC")!.priceHistory).toEqual([100]); // mutated
  });
  test("stock's price history in `updatedState` has the updated values", () => {
    expect(updatedState.stocks.get("INTC")!.priceHistory).toEqual([100, 200]);
  });
});

describe("TEST 2 - state.stocks is a map of [immerable] classes, with patch replacing state.stocks", () => {
  type State = {
    stocks: Map<string, Stock>;
  };

  const makeInitialState = () => ({
    stocks: new Map([["INTC", new Stock("INTC", "Intel", [100])]]),
  });

  let resetState: State;
  let updatedState: State;
  beforeEach(() => {
    // Set up conditions to produce the error
    const errorProducingPatch = [
      {
        op: "replace",
        path: ["stocks"],
        value: makeInitialState().stocks,
      },
    ] as Patch[];

    // Start with modified state
    const state = produce(makeInitialState(), (draft) => {
      draft.stocks.get("INTC")!.pushPrice(101);
    });

    // Use patch to "replace" stocks
    resetState = applyPatches(state, errorProducingPatch);

    // Problems come in when resetState is modified
    updatedState = produce(resetState, (draft) => {
      draft.stocks.get("INTC").pushPrice(200);
    });
  });

  // Test for referential equality
  test("`updatedState` does not equal `resetState`", () => {
    expect(resetState).not.toBe(updatedState);
  });
  test("`updatedState.stocks` does not equal `resetState.stocks`", () => {
    expect(resetState.stocks).not.toBe(updatedState.stocks);
  });
  test('`updatedState.stocks.get("INTC") does not equal `resetState.stocks.get("INTC")`', () => {
    expect(resetState.stocks.get("INTC")).not.toBe(
      updatedState.stocks.get("INTC")
    );
  });

  // Test for mutations
  test("stock's price history in `resetState` does not get mutated", () => {
    expect(resetState.stocks.get("INTC")!.priceHistory).toEqual([100]); // mutated
  });
  test("stock's price history in `updatedState` has the updated values", () => {
    expect(updatedState.stocks.get("INTC")!.priceHistory).toEqual([100, 200]);
  });
});

describe("TEST 3 - state.stocks is a map of [immerable] classes, with patch replacing state root", () => {
  type State = {
    stocks: Map<string, Stock>;
  };

  const makeInitialState = () => ({
    stocks: new Map([["INTC", new Stock("INTC", "Intel", [100])]]),
  });

  let resetState: State;
  let updatedState: State;
  beforeEach(() => {
    // Set up conditions to produce the error
    const errorProducingPatch = [
      {
        op: "replace",
        path: [],
        value: makeInitialState(),
      },
    ] as Patch[];

    // Start with modified state
    const state = produce(makeInitialState(), (draft) => {
      draft.stocks.get("INTC")!.pushPrice(101);
    });

    // Use patch to "replace" stocks
    resetState = applyPatches(state, errorProducingPatch);

    // Problems come in when resetState is modified
    updatedState = produce(resetState, (draft) => {
      draft.stocks.get("INTC").pushPrice(200);
    });
  });

  // Test for referential equality
  test("`updatedState` does not equal `resetState`", () => {
    expect(resetState).not.toBe(updatedState);
  });
  test("`updatedState.stocks` does not equal `resetState.stocks`", () => {
    expect(resetState.stocks).not.toBe(updatedState.stocks);
  });
  test('`updatedState.stocks.get("INTC") does not equal `resetState.stocks.get("INTC")`', () => {
    expect(resetState.stocks.get("INTC")).not.toBe(
      updatedState.stocks.get("INTC")
    );
  });

  // Test for mutations
  test("stock's price history in `resetState` does not get mutated", () => {
    expect(resetState.stocks.get("INTC")!.priceHistory).toEqual([100]); // mutated
  });
  test("stock's price history in `updatedState` has the updated values", () => {
    expect(updatedState.stocks.get("INTC")!.priceHistory).toEqual([100, 200]);
  });
});

describe("TEST 4 - state.stocks is an object keying [immerable] classes, with patch replacing state.stocks", () => {
  type State = {
    stocks: { [key: string]: Stock };
  };

  const makeInitialState = () => ({
    stocks: {
      INTC: new Stock("INTC", "Intel", [100]),
    },
  });

  let resetState: State;
  let updatedState: State;
  beforeEach(() => {
    // Set up conditions to produce the error
    const errorProducingPatch = [
      {
        op: "replace",
        path: ["stocks"],
        value: makeInitialState().stocks,
      },
    ] as Patch[];

    // Start with modified state
    const state = produce(makeInitialState(), (draft) => {
      draft.stocks["INTC"].pushPrice(101);
    });

    // Use patch to "replace" stocks
    resetState = applyPatches(state, errorProducingPatch);

    // Problems come in when resetState is modified
    updatedState = produce(resetState, (draft) => {
      draft.stocks["INTC"].pushPrice(200);
    });
  });

  // Test for referential equality
  test("`updatedState` does not equal `resetState`", () => {
    expect(resetState).not.toBe(updatedState);
  });
  test("`updatedState.stocks` does not equal `resetState.stocks`", () => {
    expect(resetState.stocks).not.toBe(updatedState.stocks);
  });
  test('`updatedState.stocks.get("INTC") does not equal `resetState.stocks.get("INTC")`', () => {
    expect(resetState.stocks["INTC"]).not.toBe(updatedState.stocks["INTC"]);
  });

  // Test for mutations
  test("stock's price history in `resetState` does not get mutated", () => {
    expect(resetState.stocks["INTC"].priceHistory).toEqual([100]); // mutated
  });
  test("stock's price history in `updatedState` has the updated values", () => {
    expect(updatedState.stocks["INTC"].priceHistory).toEqual([100, 200]);
  });
});

describe("TEST 5 - state.stocks is an array of [immerable] classes, with patch replacing state.stocks", () => {
  type State = {
    stocks: Stock[];
  };

  const makeInitialState = () => ({
    stocks: [new Stock("INTC", "Intel", [100])],
  });

  let resetState: State;
  let updatedState: State;
  beforeEach(() => {
    // Set up conditions to produce the error
    const errorProducingPatch = [
      {
        op: "replace",
        path: ["stocks"],
        value: makeInitialState().stocks,
      },
    ] as Patch[];

    // Start with modified state
    const state = produce(makeInitialState(), (draft) => {
      draft.stocks[0].pushPrice(101);
    });

    // Use patch to "replace" stocks
    resetState = applyPatches(state, errorProducingPatch);

    // Problems come in when resetState is modified
    updatedState = produce(resetState, (draft) => {
      draft.stocks[0].pushPrice(200);
    });
  });

  // Test for referential equality
  test("`updatedState` does not equal `resetState`", () => {
    expect(resetState).not.toBe(updatedState);
  });
  test("`updatedState.stocks` does not equal `resetState.stocks`", () => {
    expect(resetState.stocks).not.toBe(updatedState.stocks);
  });
  test("`updatedState.stocks[0] does not equal `resetState.stocks[0]`", () => {
    expect(resetState.stocks[0]).not.toBe(updatedState.stocks[0]);
  });

  // Test for mutations
  test("stock's price history in `resetState` does not get mutated", () => {
    expect(resetState.stocks[0].priceHistory).toEqual([100]); // mutated
  });
  test("stock's price history in `updatedState` has the updated values", () => {
    expect(updatedState.stocks[0].priceHistory).toEqual([100, 200]);
  });
});

describe("TEST 6 - state.stock is a single [immerable] class, with patch replacing state.stock", () => {
  type State = {
    stock: Stock;
  };

  const makeInitialState = () => ({
    stock: new Stock("INTC", "Intel", [100]),
  });

  let resetState: State;
  let updatedState: State;
  beforeEach(() => {
    // Set up conditions to produce the error
    const errorProducingPatch = [
      {
        op: "replace",
        path: ["stock"],
        value: makeInitialState().stock,
      },
    ] as Patch[];

    // Start with modified state
    const state = produce(makeInitialState(), (draft) => {
      draft.stock.pushPrice(101);
    });

    // Use patch to "replace" stocks
    resetState = applyPatches(state, errorProducingPatch);

    // Problems come in when resetState is modified
    updatedState = produce(resetState, (draft) => {
      draft.stock.pushPrice(200);
    });
  });

  // Test for referential equality
  test("`updatedState` does not equal `resetState`", () => {
    expect(resetState).not.toBe(updatedState);
  });
  test("`updatedState.stock` does not equal `resetState.stock`", () => {
    expect(resetState.stock).not.toBe(updatedState.stock);
  });

  // Test for mutations
  test("stock's price history in `resetState` does not get mutated", () => {
    expect(resetState.stock.priceHistory).toEqual([100]); // mutated
  });
  test("stock's price history in `updatedState` has the updated values", () => {
    expect(updatedState.stock.priceHistory).toEqual([100, 200]);
  });
});

describe("TEST 7 - state is an array of [immerable] classes, with patch replacing state[0]", () => {
  type State = Stock[];

  const makeInitialState = () => [new Stock("INTC", "Intel", [100])];

  let resetState: State;
  let updatedState: State;
  beforeEach(() => {
    // Set up conditions to produce the error
    const errorProducingPatch = [
      {
        op: "replace",
        path: [0],
        value: makeInitialState()[0],
      },
    ] as Patch[];

    // Start with modified state
    const state = produce(makeInitialState(), (draft) => {
      draft[0].pushPrice(101);
    });

    // Use patch to "replace" stocks
    resetState = applyPatches(state, errorProducingPatch);

    // Problems come in when resetState is modified
    updatedState = produce(resetState, (draft) => {
      draft[0].pushPrice(200);
    });
  });

  // Test for referential equality
  test("`updatedState` does not equal `resetState`", () => {
    expect(resetState).not.toBe(updatedState);
  });
  test("`updatedState.stock` does not equal `resetState.stock`", () => {
    expect(resetState[0]).not.toBe(updatedState[0]);
  });

  // Test for mutations
  test("stock's price history in `resetState` does not get mutated", () => {
    expect(resetState[0].priceHistory).toEqual([100]); // mutated
  });
  test("stock's price history in `updatedState` has the updated values", () => {
    expect(updatedState[0].priceHistory).toEqual([100, 200]);
  });
});

describe('TEST 8 - state is a map of [immerable] classes, with patch replacing state["INTC"]', () => {
  type State = Map<string, Stock>;

  const makeInitialState = () =>
    new Map([["INTC", new Stock("INTC", "Intel", [100])]]);

  let resetState: State;
  let updatedState: State;
  beforeEach(() => {
    // Set up conditions to produce the error
    const errorProducingPatch = [
      {
        op: "replace",
        path: ["INTC"],
        value: makeInitialState().get("INTC"),
      },
    ] as Patch[];

    // Start with modified state
    const state = produce(makeInitialState(), (draft) => {
      draft.get("INTC").pushPrice(101);
    });

    // Use patch to "replace" stocks
    resetState = applyPatches(state, errorProducingPatch);

    // Problems come in when resetState is modified
    updatedState = produce(resetState, (draft) => {
      draft.get("INTC").pushPrice(200);
    });
  });

  // Test for referential equality
  test("`updatedState` does not equal `resetState`", () => {
    expect(resetState).not.toBe(updatedState);
  });
  test('`updatedState.get("INTC")` does not equal `resetState.get("INTC")`', () => {
    expect(resetState.get("INTC")).not.toBe(updatedState.get("INTC"));
  });

  // Test for mutations
  test("stock's price history in `resetState` does not get mutated", () => {
    expect(resetState.get("INTC").priceHistory).toEqual([100]); // mutated
  });
  test("stock's price history in `updatedState` has the updated values", () => {
    expect(updatedState.get("INTC").priceHistory).toEqual([100, 200]);
  });
});

describe("TEST 9 - state is an [immerable] class, with patch replacing state root", () => {
  type State = Stock;

  const makeInitialState = () => new Stock("INTC", "Intel", [100]);

  let resetState: State;
  let updatedState: State;
  beforeEach(() => {
    // Set up conditions to produce the error
    const errorProducingPatch = [
      {
        op: "replace",
        path: [],
        value: makeInitialState(),
      },
    ] as Patch[];

    // Start with modified state
    const state = produce(makeInitialState(), (draft) => {
      draft.pushPrice(101);
    });

    // Use patch to "replace" stocks
    resetState = applyPatches(state, errorProducingPatch);

    // Problems come in when resetState is modified
    updatedState = produce(resetState, (draft) => {
      draft.pushPrice(200);
    });
  });

  // Test for referential equality
  test("`updatedState` does not equal `resetState`", () => {
    expect(resetState).not.toBe(updatedState);
  });

  // Test for mutations
  test("stock's price history in `resetState` does not get mutated", () => {
    expect(resetState.priceHistory).toEqual([100]); // mutated
  });
  test("stock's price history in `updatedState` has the updated values", () => {
    expect(updatedState.priceHistory).toEqual([100, 200]);
  });
});
