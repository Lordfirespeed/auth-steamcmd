/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import * as core from '@actions/core'

// @ts-expect-error TS does not understand Jest mocking
import { runMock } from '../src/main'
import wrap_install from '../src/index'

jest.mock('../src/main')

// Mock the GitHub Actions core library
let setFailedMock: jest.SpyInstance

describe('index', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
  })

  it('reports failure on error', async () => {
    const runComplete = Promise.reject(new Error())
    runMock.mockImplementation(async () => await runComplete)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    try {
      await wrap_install()
    } catch {
      //https://stackoverflow.com/a/33458430/11045433
      Function.prototype()
    }

    expect(setFailedMock).toHaveBeenCalled()
  })
})
