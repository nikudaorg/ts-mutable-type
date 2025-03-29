declare const afterSymbol: unique symbol;
declare const valueSymbol: unique symbol;

type Mutable<T> =
  | {
      [valueSymbol]: T;
    }
  | {
      [valueSymbol]: never;
      [afterSymbol]: Mutable<T>;
    };

type Current<T> = T extends { [afterSymbol]: infer A }
  ? Current<A>
  : typeof valueSymbol extends keyof T
  ? T[typeof valueSymbol]
  : never;

type Create<T> = {
  [valueSymbol]: T;
};

type Mutate<T, NewValue> = T extends { [afterSymbol]: infer A }
  ? {
      [valueSymbol]: never;
      [afterSymbol]: Mutate<A, NewValue>;
    }
  : {
      [valueSymbol]: never;
      [afterSymbol]: Create<NewValue>;
    };
