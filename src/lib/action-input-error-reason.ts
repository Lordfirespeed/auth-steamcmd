type actionInputErrorContext = {
  inputKey: string
}

export default function discernActionInputErrorReason(error: unknown, _context: actionInputErrorContext): string {
  if (!(error instanceof Error)) {
    if (error instanceof String) return `Unknown: ${error}}`
    return 'Unknown: thrown value not an Error'
  }

  return `${error.name}: ${error.message}`
}
