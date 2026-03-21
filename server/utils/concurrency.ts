// Concurrent task limiter — worker pool pattern
// Replaces Promise.allSettled for large URL lists
// Zero dependencies

export async function withConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number = 10,
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = new Array(tasks.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < tasks.length) {
      const index = nextIndex++
      try {
        const value = await tasks[index]()
        results[index] = { status: 'fulfilled', value }
      } catch (reason) {
        results[index] = { status: 'rejected', reason }
      }
    }
  }

  // Spawn workers up to the limit (or fewer if less tasks)
  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => worker(),
  )
  await Promise.all(workers)

  return results
}
