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

This repository tests 7 scenarios that test different structures of state. You can find the tests
in `src/reproduce.test.ts`. I outline the basic setup of each test and their results below.

### when `state.stocks` is a map, and stocks are `[immerable]`

```ts
type State = {
  stocks: Map<string, Stock>;
};
```

⚠️ This structure **reproduces** the issue described above.

### when `state.stocks` is an object, and stocks are `[immerable]`

```ts
type State = {
  stocks: { [key: string]: Stock };
};
```

⚠️ This structure **reproduces** the issue described above.

### when `state.stocks` is an array, and stocks are `[immerable]`

```ts
type State = {
  stocks: Stock[];
};
```

⚠️ This structure **reproduces** the issue described above.

### when `state.stock` is a single `[immerable]` class

```ts
type State = {
  stock: Stock;
};
```

⚠️ This structure **reproduces** the issue described above.

### when `state` is an array of `[immerable]` classes

```ts
type State = Stock[];
```

⚠️ This structure **reproduces** the issue described above.

### when `state` is an `[immerable]` class

```ts
type State = Stock;
```

✅ This structure **does not reproduce** the issue described above.

### when `state.stocks` is a map, and stocks are plain objects

```ts
type State = {
  stocks: Map<string, { ticker: string, name: string, priceHistory: number[] }>
}
```

✅ This structure **does not reproduce** the issue described above.