type LiteralUnion<T extends string> = T | (Pick<string, never> & { _?: never });
export function named(name: LiteralUnion<"remote" | "base">): Symbol;
