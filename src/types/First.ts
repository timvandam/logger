export type First<R> = R extends readonly [unknown, ...unknown[]] ? R[0] : never
