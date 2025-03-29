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
): // @ts-ignore
asserts ctx is Mutate<TCtx, { [wasFunctionCalledSymbol]: true }> {
  // implementation
}

declare const globalContext: Create<{ [wasFunctionCalledSymbol]: false }>;

// ✅ First call
allowOneCall(globalContext);

// ❌ Second call — compile-time error
allowOneCall(globalContext);
