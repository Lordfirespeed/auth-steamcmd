import * as core from '@actions/core'

export default function ActionLogGroup(groupTitle: string) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const oldFunction = descriptor.value

    descriptor.value = async function (...args: unknown[]) {
      core.startGroup(groupTitle)
      try {
        return await oldFunction.apply(target, args)
      } finally {
        core.endGroup()
      }
    }
  }
}
