/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as exec from '@actions/exec'
import process from 'process'
import path from 'path'
import { PathLike } from 'fs'
import fs, { FileHandle } from 'fs/promises'

import AuthenticateSteamCMD from '../src/main'
import expandEnv from '../src/lib/expand-env'

// Mock the action's main function
let runner: AuthenticateSteamCMD
let runMock: jest.SpyInstance<ReturnType<AuthenticateSteamCMD['run']>, Parameters<AuthenticateSteamCMD['run']>>
let getInputsMock: jest.SpyInstance<
  ReturnType<AuthenticateSteamCMD['getInputs']>,
  Parameters<AuthenticateSteamCMD['getInputs']>
>
let writeFileMock: jest.SpyInstance<
  ReturnType<AuthenticateSteamCMD['writeFile']>,
  Parameters<AuthenticateSteamCMD['writeFile']>
>
let expandEnvVarsMock: jest.SpyInstance<
  ReturnType<AuthenticateSteamCMD['expandEnvVars']>,
  Parameters<AuthenticateSteamCMD['expandEnvVars']>
>

// Other utilities

// Mock the GitHub Actions core library
let _coreStartGroupMock: jest.SpyInstance
let _coreEndGroupMock: jest.SpyInstance
let _coreDebugMock: jest.SpyInstance
let _coreInfoMock: jest.SpyInstance
let _coreWarningMock: jest.SpyInstance
let _coreErrorMock: jest.SpyInstance
let _coreGetInputMock: jest.SpyInstance

// Mock the GitHub Actions execution library
let execExecMock: jest.SpyInstance
let execGetExecOutputMock: jest.SpyInstance

// Mock fs/promises module
jest.mock('fs/promises')
let _fsMkdirMock: jest.SpyInstance
let _fsOpenMock: jest.SpyInstance
let fsFileHandleWriteFileMock: jest.Mock
let fsFileHandleChmodMock: jest.Mock
let fsFileHandleCloseMock: jest.Mock

describe('action', () => {
  const originalProcessEnv = process.env

  function mockInputs(inputs: Map<string, string>): void {
    for (const [key, value] of inputs) {
      // https://github.com/actions/toolkit/blob/8f1c589/packages/core/src/core.ts#L128
      process.env[`INPUT_${key.replace(/ /g, '_').toUpperCase()}`] = value
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()

    process.env['HOME'] = '/home/[runner]'

    mockInputs(
      new Map()
        // base-64 "IA==" <-> utf-8 " "
        .set('steam_config_vdf', 'IA==')
        .set('steam_home', '$HOME/Steam')
        .set('steam_username', 'username')
    )

    runner = new AuthenticateSteamCMD()
    runMock = jest.spyOn(AuthenticateSteamCMD.prototype, 'run')

    getInputsMock = jest.spyOn(AuthenticateSteamCMD.prototype, 'getInputs')
    writeFileMock = jest.spyOn(AuthenticateSteamCMD.prototype, 'writeFile')
    expandEnvVarsMock = jest.spyOn(AuthenticateSteamCMD.prototype, 'expandEnvVars')

    _coreStartGroupMock = jest.spyOn(core, 'startGroup').mockImplementation()
    _coreEndGroupMock = jest.spyOn(core, 'endGroup').mockImplementation()
    _coreDebugMock = jest.spyOn(core, 'debug').mockImplementation()
    _coreInfoMock = jest.spyOn(core, 'info').mockImplementation()
    _coreWarningMock = jest.spyOn(core, 'warning').mockImplementation()
    _coreErrorMock = jest.spyOn(core, 'error').mockImplementation()
    _coreGetInputMock = jest.spyOn(core, 'getInput')

    execExecMock = jest.spyOn(exec, 'exec').mockResolvedValue(0)
    execGetExecOutputMock = jest.spyOn(exec, 'getExecOutput').mockResolvedValue({
      exitCode: 0,
      stdout: '[stdout]',
      stderr: '[stderr]'
    })

    _fsMkdirMock = jest
      .spyOn(fs, 'mkdir')
      .mockImplementation(async (filename: PathLike, _options: Parameters<typeof fs.mkdir>[1]) => filename.toString())

    fsFileHandleWriteFileMock = jest.fn(async (..._args: Parameters<FileHandle['writeFile']>) => Promise.resolve())
    fsFileHandleChmodMock = jest.fn(async (..._args: Parameters<FileHandle['chmod']>) => Promise.resolve())
    fsFileHandleCloseMock = jest.fn(async (..._args: Parameters<FileHandle['close']>) => Promise.resolve())

    _fsOpenMock = jest.spyOn(fs, 'open').mockImplementation(async (..._args: Parameters<typeof fs.open>) => {
      return {
        fd: 0,
        appendFile: jest.fn(),
        chown: jest.fn(),
        chmod: fsFileHandleChmodMock,
        createReadStream: jest.fn(),
        createWriteStream: jest.fn(),
        datasync: jest.fn(),
        sync: jest.fn(),
        read: jest.fn(),
        readableWebStream: jest.fn(),
        readFile: jest.fn(),
        readLines: jest.fn(),
        stat: jest.fn(),
        truncate: jest.fn(),
        utimes: jest.fn(),
        writeFile: fsFileHandleWriteFileMock,
        write: jest.fn(),
        writev: jest.fn(),
        readv: jest.fn(),
        close: fsFileHandleCloseMock,
        [Symbol.asyncDispose]: jest.fn()
      }
    })
  })

  afterEach(() => {
    writeFileMock.mockClear()
    expandEnvVarsMock.mockClear()
    process.env = originalProcessEnv
  })

  it('calls writeFile to overwrite the steam config file', async () => {
    const steam_home = '/really/random/Steam'
    const roundTripValue = Buffer.from('Hello World!')
    const encodedRoundTripValue = roundTripValue.toString('base64')
    mockInputs(new Map().set('steam_home', steam_home).set('steam_config_vdf', encodedRoundTripValue))

    expandEnvVarsMock.mockImplementationOnce(async value => expandEnv(value))
    writeFileMock.mockImplementation()

    // eslint-disable-next-line github/no-then
    await runner.run().catch()
    expect(runMock).toHaveReturned()

    expect(writeFileMock).toHaveBeenCalledWith(
      path.join(steam_home, 'config', 'config.vdf'),
      roundTripValue,
      expect.objectContaining({
        encoding: 'ascii',
        mode: 0o777
      })
    )

    writeFileMock.mockRestore()
  })

  it("runs the steamCMD 'login' command with the provided steam_username input", async () => {
    const steam_username = 'some_really_random_username'
    mockInputs(new Map().set('steam_username', steam_username))

    // eslint-disable-next-line github/no-then
    await runner.run().catch()
    expect(runMock).toHaveReturned()

    expect(execExecMock).toHaveBeenCalledWith(
      'steamcmd',
      expect.arrayContaining(['+login', steam_username]),
      expect.anything()
    )
  })

  describe('getInputs', () => {
    it('rejects when no steam_username input is provided', async () => {
      mockInputs(new Map().set('steam_username', ''))

      await expect(runner.getInputs()).rejects.toThrow(/steam_username/i)
    })

    it('rejects when no steam_config_vdf input is provided', async () => {
      mockInputs(new Map().set('steam_config_vdf', ''))

      await expect(runner.getInputs()).rejects.toThrow(/steam_config_vdf/i)
    })

    it('rejects when provided steam_config_vdf input that is not base64 encoded', async () => {
      mockInputs(new Map().set('steam_config_vdf', 'Really really not base64 encoded, lol'))

      await expect(runner.getInputs()).rejects.toThrow(/Base64/i)
    })

    it('falls back to a best-guess when no steam_home input is provided', async () => {
      mockInputs(new Map().set('steam_home', ''))

      await runner.getInputs()
      expect(getInputsMock).toHaveReturned()
    })

    it('calls expandEnvVars with the provided steam_home input', async () => {
      const steam_home = '/some/path/with/env/variables'
      mockInputs(new Map().set('steam_home', steam_home))

      await runner.getInputs()
      expect(getInputsMock).toHaveReturned()

      expect(expandEnvVarsMock).toHaveBeenCalledWith(steam_home)
    })
  })

  describe('expandEnvVars', () => {
    it("gets execution output from passing an 'echo' command to bash", async () => {
      await runner.expandEnvVars('reallyFunValue')
      expect(expandEnvVarsMock).toHaveReturned()

      expect(execGetExecOutputMock).toHaveBeenCalledWith(
        'bash',
        expect.arrayContaining(['-c', expect.stringContaining('echo')]),
        expect.any(Object)
      )
    })
  })

  describe('writeFile', () => {
    it('opens file handle, writes contents, and closes the handle', async () => {
      // eslint-disable-next-line github/no-then
      await runner.writeFile('/some/interesting/file', 'really interesting contents').catch()
      expect(writeFileMock).toHaveReturned()

      expect(fs.open).toHaveBeenCalled()
      expect(fsFileHandleWriteFileMock).toHaveBeenCalled()
      expect(fsFileHandleCloseMock).toHaveBeenCalled()
    })

    it('opens the passed filename', async () => {
      const filename = '/golden/goose/files'

      // eslint-disable-next-line github/no-then
      await runner.writeFile(filename, 'really interesting contents').catch()
      expect(writeFileMock).toHaveReturned()

      expect(fs.open).toHaveBeenCalledWith(filename, expect.any(String), undefined)
    })

    it('passes through content and options to writeFile', async () => {
      const contents = 'According to all known laws of aviation, there is no way a bee should be able to fly.'
      const options: { encoding: BufferEncoding } = {
        encoding: 'ascii'
      }

      // eslint-disable-next-line github/no-then
      await runner.writeFile('/some/interesting/file', contents, options).catch()
      expect(writeFileMock).toHaveReturned()

      expect(fsFileHandleWriteFileMock).toHaveBeenCalledWith(contents, expect.any(Object))
      expect(fsFileHandleWriteFileMock.mock.lastCall[1]).toBe(options)
    })

    it('closes an open file handle when an error is thrown', async () => {
      fsFileHandleWriteFileMock.mockRejectedValue(new Error())

      await expect(runner.writeFile('/some/interesting/file', 'really interesting contents')).rejects.toThrow()

      expect(fs.open).toHaveBeenCalled()
      expect(fsFileHandleCloseMock).toHaveBeenCalled()
    })

    it('modifies file permissions when option is supplied', async () => {
      const fileMode = 0o111

      await runner
        .writeFile('/some/interesting/file', 'really interesting contents', {
          mode: fileMode
        })
        // eslint-disable-next-line github/no-then
        .catch()
      expect(writeFileMock).toHaveReturned()

      expect(fsFileHandleChmodMock).toHaveBeenCalledWith(fileMode)
    })

    it('does not modify file permissions when option is omitted', async () => {
      // eslint-disable-next-line github/no-then
      await runner.writeFile('/some/interesting/file', 'really interesting contents').catch()
      expect(writeFileMock).toHaveReturned()

      expect(fsFileHandleChmodMock).not.toHaveBeenCalled()
    })
  })
})
