# ts-mutable-type

An experimental setup for tracking **mutations** at TypeScript compile-time.

This package is **not recommended for production use**, but is ideal for researchers and type system enthusiasts exploring the boundaries of TypeScript.

## 📦 Installation

```bash
npm install ts-mutable-type
```
  
## 🚀 Usage

The following are the types defined by the `ts-mutable-type` module:
- **`Create<T>`**  
  Wraps a value `T` in a mutable container whose state can be tracked at the type level.

- **`Current<T>`**  
  Extracts the type of the current static value of a mutable type `T`.

- **`Mutate<T, New>`**  
  Used in a mutating function's return type declaration as a type to which the argument is asserted (asserts arg is Mutate<Arg, NewType>)

### Toggle Function

#### Define:

```ts
type Not<A extends boolean> = A extends true ? false : true;

function create<T extends boolean>(value: T): Create<T> {
  return { runtimeValue: value } as any;
}

function toggle<T extends Mutable<boolean>>(
  value: T
  // @ts-ignore
): asserts value is Mutate<T, Not<Current<T>>> {
  (value as any).runtimeValue = !(value as any).runtimeValue;
}

function get<T extends Mutable<boolean>>(value: T): Current<T> {
  return (value as any).runtimeValue;
}
```

#### Use:

```ts
const booleanValue = create(false);

toggle(booleanValue);
const a = get(booleanValue); // true inferred at compile-time

toggle(booleanValue);
const b = get(booleanValue); // false inferred at compile-time
```

### One-Time Function

#### Define:

```ts
declare const wasFunctionCalledSymbol: unique symbol;

type Ctx = {
  [wasFunctionCalledSymbol]: boolean;
};

type OptionalArgsError<T> = Current<T> extends {
  [wasFunctionCalledSymbol]: true;
}
  ? ['Error: this function can be called only once']
  : [];

function allowOneCall<T extends Mutable<any>>(
  ctx: T,
  ...error: OptionalArgsError<T>
  // @ts-ignore
): asserts ctx is Mutate<TCtx, { [wasFunctionCalledSymbol]: true }> {
  // implementation
}

declare const globalContext: Create<{ [wasFunctionCalledSymbol]: false }>;
```

#### Use:

```ts
// ✅ First call
allowOneCall(globalContext);

// ❌ Second call — compile-time error
allowOneCall(globalContext);
```
