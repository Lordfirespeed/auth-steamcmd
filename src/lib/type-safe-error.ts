export default function typeSafeError<T>(error: unknown, handler: (error: Error) => T): T {
  if (!(error instanceof Error)) {
    if (error instanceof String) {
      return handler(new Error(error as string))
    }
    return handler(new Error('Unknown: thrown value not an Error'))
  }
  return handler(error)
}