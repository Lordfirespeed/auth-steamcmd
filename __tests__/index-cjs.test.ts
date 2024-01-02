/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import AuthenticateSteamCMD from '../src/main'

// Mock the action's entrypoint
const mockRun = jest.fn()

// Mock the 'main' module
jest.mock('../src/main', () => {
  return jest.fn().mockImplementation(() => {
    return { run: mockRun }
  })
})

describe('index', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls run when require()d', async () => {
    const runComplete = Promise.resolve()
    mockRun.mockImplementation(async () => await runComplete)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/index')
    await runComplete

    expect(AuthenticateSteamCMD).toHaveBeenCalled()
    expect(mockRun).toHaveBeenCalled()
  })
})
