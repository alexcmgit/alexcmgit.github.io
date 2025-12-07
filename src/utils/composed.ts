type Fn<I, O> = (input: I) => O;

type Composed = {
  <T>(value: T): {
    <Next>(fn: Fn<T, Next>): ComposedReturn<Next>;
    (): T;
  };
};

type ComposedReturn<T> = {
  <Next>(fn: Fn<T, Next>): ComposedReturn<Next>;
  (): T;
};

export const composed: Composed = <T>(value: T) => {
  const chain = (v: any) => {
    const next = (fn?: any) => {
      // If called as ()
      if (typeof fn !== 'function') return v;

      const out = fn(v);
      return chain(out);
    };
    return next;
  };
  return chain(value);
};
