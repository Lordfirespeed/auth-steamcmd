// https://github.com/taterbase/node-expandenv/blob/56ec358f/index.js#L3
export default function expandEnv(value: string, env: Map<string, string> | undefined = undefined): string {
  const mergedEnv = mapUnion(new Map(), env?.entries() || [])

  return value.replace(/\$\w+/g, match => {
    return mergedEnv.get(match.replace('$', '')) || match
  })
}

// https://stackoverflow.com/a/41328397/11045433
function mapUnion<K, V>(map: Map<K, V>, ...iterables: (Iterable<[K, V]> | [K, V][])[]): Map<K, V> {
  for (const iterable of iterables) {
    for (const item of iterable) {
      map.set(...item)
    }
  }
  return map
}
