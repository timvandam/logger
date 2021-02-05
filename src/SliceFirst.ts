export type SliceFirst<R> = R extends readonly [unknown, ...infer T] ? readonly [...T] : []
