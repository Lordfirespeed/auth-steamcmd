import isErrnoException from './is.errno.exception'

type fileSystemErrorContext = {
  file: string
}

// https://nodejs.org/api/errors.html#common-system-errors
function reasonBySystemErrorCode(
  errorCode: string,
  context: fileSystemErrorContext
): string | undefined {
  switch (errorCode) {
    case 'EACCESS':
      return `Permission denied to ${context.file}. Access of the requested type is forbidden by file permissions.`
    case 'EEXIST':
      return `${context.file} already exists and conflicts with the requested operation.`
    case 'EISDIR':
      return `${context.file} is unexpectedly a directory.`
    case 'EMFILE':
      return `Too many file handles are open concurrently.`
    case 'ENOENT':
      return `The file or directory ${context.file} does not exist.`
    case 'ENOTDIR':
      return `${context.file} is unexpectedly not a directory.`
    case 'ENOTEMPTY':
      return `The directory ${context.file} is not empty.`
    case 'EPERM':
      return `The requested operation requires elevated privileges.`
    case 'ETIMEDOUT':
      return `The requested operation timed out.`
  }
}

export default function discernFileSystemErrorReason(
  error: unknown,
  context: fileSystemErrorContext
): string {
  if (!(error instanceof Error)) {
    if (error instanceof String) return `Unknown: ${error}}`
    return 'Unknown: thrown value not an Error'
  }

  if (isErrnoException(error) && error.code) {
    const reason = reasonBySystemErrorCode(error.code, context)
    if (reason) return `${error.name}: ${error.code}: ${reason}`

    return `${error.name}: ${error.code}: ${error.message}`
  }

  return `${error.name}: ${error.message}`
}
