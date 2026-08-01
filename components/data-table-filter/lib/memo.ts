export function memo<TDeps extends readonly any[], TResult>(
  getDeps: () => TDeps,
  compute: (deps: TDeps) => TResult,
  options: { key: string },
): () => TResult {
  let prevDeps: TDeps | undefined
  let cachedResult: TResult | undefined

  return () => {
    // console.log(`[memo] Calling memoized function: ${options.key}`)

    const deps = getDeps()

    // If no previous deps or deps have changed, recompute
    if (!prevDeps || !shallowEqual(prevDeps, deps)) {
      // console.log(`[memo] Cache MISS - ${options.key}`)
      cachedResult = compute(deps)
      prevDeps = deps
    } else {
      // console.log(`[memo] Cache HIT - ${options.key}`)
    }

    return cachedResult!
  }
}

function shallowEqual<T>(arr1: readonly T[], arr2: readonly T[]): boolean {
  if (arr1 === arr2) return true
  if (arr1.length !== arr2.length) return false

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}
