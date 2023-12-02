/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import AuthenticateSteamCMD from '../src/main'
import * as core from '@actions/core'

// Mock the action's entrypoint
const mockRun = jest.fn()

// Mock the 'main' module
jest.mock("../src/main", () => {
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

  it('calls run when imported and reports failure when an error is thrown', async () => {
    const runComplete = Promise.reject();
    mockRun.mockImplementation(() => runComplete)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/index')
    await runComplete.catch(() => { return });

    expect(AuthenticateSteamCMD).toHaveBeenCalled()
    expect(mockRun).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalled()
  })
})
