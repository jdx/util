import * as fs from 'fs'

export function compact<T>(a: (T | undefined)[]): T[] {
  return a.filter((a): a is T => !!a)
}

export function flatMap<T, U>(arr: T[], fn: (i: T) => U[]): U[] {
  return arr.reduce((arr, i) => arr.concat(fn(i)), [] as U[])
}

export function mapValues<T extends object, TResult>(obj: {[P in keyof T]: T[P]}, fn: (i: T[keyof T], k: keyof T) => TResult): {[P in keyof T]: TResult} {
  return Object.entries(obj)
  .reduce((o, [k, v]) => {
    o[k] = fn(v, k as any)
    return o
  }, {} as any)
}

export function loadJSONSync(path: string): any {
  let loadJSON
  try { loadJSON = require('load-json-file') } catch {}
  if (loadJSON) return loadJSON.sync(path)
  return JSON.parse(fs.readFileSync(path, 'utf8'))
}

export function pickBy<T>(obj: T, fn: (i: T[keyof T]) => boolean): Partial<T> {
  return Object.entries(obj)
  .reduce((o, [k, v]) => {
    if (fn(v)) o[k] = v
    return o
  }, {} as any)
}

export function maxBy<T>(arr: T[], fn: (i: T) => number): T | undefined {
  let max: {element: T, i: number} | undefined
  for (let cur of arr) {
    let i = fn(cur)
    if (!max || i > max.i) {
      max = {i, element: cur}
    }
  }
  return max && max.element
}

export type SortTypes = string | number | undefined | boolean

export function sortBy<T>(arr: T[], fn: (i: T) => SortTypes | SortTypes[]): T[] {
  // function castType(t: SortTypes | SortTypes[]): string | number | SortTypes[] {
  //   if (t === undefined) return 0
  //   if (t === false) return 1
  //   if (t === true) return -1
  //   return t
  // }

  function compare(a: SortTypes | SortTypes[], b: SortTypes | SortTypes[]): number {
    a = a === undefined ? 0 : a
    b = b === undefined ? 0 : b

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length === 0 && b.length === 0) return 0
      let diff = compare(a[0], b[0])
      if (diff !== 0) return diff
      return compare(a.slice(1), b.slice(1))
    }

    if (a < b) return -1
    if (a > b) return 1
    return 0
  }

  return arr.sort((a, b) => compare(fn(a), fn(b)))
}
