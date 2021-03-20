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

describe("when state.stocks is a map and stocks are [immerable]", () => {
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

describe("when state.stocks is an object and stocks are [immerable]", () => {
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

describe("when state.stocks is an array and stocks are [immerable]", () => {
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

describe("when state.stock is a single [immerable] class", () => {
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

describe("when state is an array of [immerable] classes", () => {
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

describe("when state is an [immerable] class", () => {
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

describe("when state.stocks is a map and stocks are plain objects", () => {
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
