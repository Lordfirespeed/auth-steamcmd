import * as core from '@actions/core'
import * as exec from '@actions/exec'
import path from 'path'
import fs from 'fs/promises'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import isBase64 from 'is-base64'

import {
  ActionLogGroup,
  discernFileSystemErrorReason,
  discernActionInputErrorReason
} from './lib'

export class AuthenticateSteamCMD {
  /**
   * The main function for the action.
   * @returns {Promise<void>} Resolves when the action is complete.
   */
  async run(): Promise<void> {
    const task = pipe(
      this.getInputsTaskEither(),
      TE.bindW('steamConfigDirectory', state =>
        this.ensureSteamConfigDirTaskEither(state)
      ),
      TE.bindW('steamConfigFile', state =>
        this.writeSteamConfigFileTaskEither(state)
      ),
      TE.tap(state => this.testLoginSucceedsTaskEither(state)),
      TE.getOrElse(error => {
        throw error
      })
    )
    await task()
  }

  getInputsTaskEither() {
    return TE.tryCatch(
      () => this.getInputs(),
      reason => reason
    )
  }

  getRequiredInput(key: string): string {
    try {
      return core.getInput(key, { required: true, trimWhitespace: true })
    } catch (error) {
      core.error(discernActionInputErrorReason(error, { inputKey: key }))
      throw error
    }
  }

  getInputOrDefault(key: string, fallback: () => string): string {
    const provided = core.getInput(key, { trimWhitespace: true })
    if (provided) return provided

    core.info(`Falling back to lazy default for ${key}`)
    return fallback()
  }

  async expandEnvVars(value: string): Promise<string> {
    return await exec
      .getExecOutput('bash', ['-c', `echo "${value}"`], {
        ignoreReturnCode: false
      })
      .then(result => result.stdout)
      .then(stdout => stdout.trim())
  }

  @ActionLogGroup('Getting inputs')
  async getInputs() {
    const configValveDataFormatBase64Encoded =
      this.getRequiredInput('steam_config_vdf')
    if (!isBase64(configValveDataFormatBase64Encoded)) {
      core.error(
        "Provided 'steam_config_vdf' input is not Base64 encoded. Aborting."
      )
      throw new Error("Encoding of 'steam_config_vdf' is not Base64.")
    }
    core.info('Decoding steam config.vdf contents...')
    const configValveDataFormat = Buffer.from(
      configValveDataFormatBase64Encoded,
      'base64'
    )
    core.info('Steam config.vdf decoded.')

    const steamHomeCompacted = this.getInputOrDefault(
      'steam_home',
      () => '$HOME/Steam'
    )
    const steamHome = await this.expandEnvVars(steamHomeCompacted)
    core.info(`Steam home is ${steamHome}`)

    const steamUsername = this.getRequiredInput('steam_username')
    core.info('Got steam username.')

    core.info('Done.')
    return { configValveDataFormat, steamHome, steamUsername }
  }

  ensureSteamConfigDirTaskEither({ steamHome }: { steamHome: string }) {
    return TE.tryCatch(
      () => this.ensureSteamConfigDir(steamHome),
      reason => reason
    )
  }

  @ActionLogGroup('Ensuring steam config directory')
  async ensureSteamConfigDir(steamHome: string) {
    const steamConfigDir = path.join(steamHome, 'config')
    try {
      core.info(`Ensuring directory ${steamConfigDir}...`)
      // will not throw if directory already exists
      await fs.mkdir(steamConfigDir, { recursive: true })
      core.info('Done.')
      return steamConfigDir
    } catch (error) {
      core.error(
        `Couldn't ensure steam config directory. Reason: ${discernFileSystemErrorReason(
          error,
          { file: steamConfigDir }
        )}`
      )
      throw error
    }
  }

  writeSteamConfigFileTaskEither({
    steamConfigDirectory,
    configValveDataFormat
  }: {
    steamConfigDirectory: string
    configValveDataFormat: Buffer
  }) {
    return TE.tryCatch(
      () =>
        this.writeSteamConfigFile(steamConfigDirectory, configValveDataFormat),
      reason => reason
    )
  }

  async writeFile(
    file: string,
    content: Buffer,
    options: Parameters<fs.FileHandle['writeFile']>[1] = null
  ) {
    if (typeof options === 'string') {
      options = {
        encoding: options
      }
    }

    let fileHandle: fs.FileHandle | undefined
    try {
      core.info(`Opening ${file} for writing...`)
      // will throw if file already exists
      fileHandle = await fs.open(file, 'w', options?.mode)

      core.info(`Writing contents...`)
      await fileHandle.writeFile(content, options)

      if (options?.mode) {
        core.info(`Setting file permissions...`)
        await fileHandle.chmod(options.mode)
      }
    } finally {
      if (fileHandle) {
        core.info(`Closing ${file}...`)
        await fileHandle.close()
      }
    }

    core.info('Done.')
    return file
  }

  @ActionLogGroup('Writing config file')
  async writeSteamConfigFile(
    steamConfigDirectory: string,
    configValveDataFormat: Buffer
  ) {
    const steamConfigFile = path.join(steamConfigDirectory, 'config.vdf')
    try {
      await this.writeFile(steamConfigFile, configValveDataFormat, {
        encoding: 'ascii',
        mode: 0o777
      })
    } catch (error) {
      core.error(
        `Failed to write Steam config. Reason: ${discernFileSystemErrorReason(
          error,
          { file: steamConfigFile }
        )}`
      )
      throw error
    }
  }

  testLoginSucceedsTaskEither({ steamUsername }: { steamUsername: string }) {
    return TE.tryCatch(
      () => this.testLoginSucceeds(steamUsername),
      reason => reason
    )
  }

  @ActionLogGroup('Testing login succeeds')
  async testLoginSucceeds(steamUsername: string) {
    core.info('Attempting SteamCMD login...')
    // U+0004: 'End of Transmission' - if prompted for a password, fail immediately
    const loginExitCode = await exec.exec(
      'steamcmd',
      ['+login', steamUsername, '+quit'],
      {
        ignoreReturnCode: true,
        input: Buffer.from('\u0004')
      }
    )

    if (loginExitCode === 0) {
      console.info('Login succeeded.')
      return
    }

    console.error('Login failed!')
    throw new Error('Failed to login with SteamCMD')
  }
}
