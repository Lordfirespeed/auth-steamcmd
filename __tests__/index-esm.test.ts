/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import * as core from '@actions/core'

import wrap_install from '../src/index'

// Mock the action's entrypoint
const mockRun = jest.fn()

// Mock the 'main' module
jest.mock('../src/main', () => {
  return jest.fn().mockImplementation(() => {
    return { run: mockRun }
  })
})

// Mock the GitHub Actions core library
let setFailedMock: jest.SpyInstance

describe('index', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
  })

  it('reports failure on error', async () => {
    const runComplete = Promise.reject(new Error())
    mockRun.mockImplementation(async () => await runComplete)

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
