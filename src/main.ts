import * as core from '@actions/core'
import * as exec from '@actions/exec'
import path from 'path'
import fs from 'fs/promises'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import isBase64 from 'is-base64'

import { ActionLogGroup, discernFileSystemErrorReason, discernActionInputErrorReason } from './lib'

type ActionInputs = {
  configValveDataFormat: Buffer
  steamHome: string
  steamUsername: string
}

export default class AuthenticateSteamCMD {
  /**
   * The main function for the action.
   * @returns {Promise<void>} Resolves when the action is complete.
   */
  async run(): Promise<void> {
    await pipe(
      this.getInputsTaskEither(),
      TE.bindW('steamConfigDirectory', state => this.ensureSteamConfigDirTaskEither(state)),
      TE.bindW('steamConfigFile', state => this.writeSteamConfigFileTaskEither(state)),
      TE.tap(state => this.testLoginSucceedsTaskEither(state)),
      TE.getOrElse(error => {
        throw error
      })
    )()
  }

  getInputsTaskEither(): TE.TaskEither<unknown, ActionInputs> {
    return TE.tryCatch(
      async () => await this.getInputs(),
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
    return (
      await exec.getExecOutput('bash', ['-c', `echo "${value}"`], {
        ignoreReturnCode: false
      })
    ).stdout.trim()
  }

  @ActionLogGroup('Getting inputs')
  async getInputs(): Promise<ActionInputs> {
    const configValveDataFormatBase64Encoded = this.getRequiredInput('steam_config_vdf').replaceAll(/\s+/g, '')
    if (!isBase64(configValveDataFormatBase64Encoded)) {
      core.error("Provided 'steam_config_vdf' input is not Base64 encoded. Aborting.")
      throw new Error("Encoding of 'steam_config_vdf' is not Base64.")
    }
    core.info('Decoding steam config.vdf contents...')
    const configValveDataFormat = Buffer.from(configValveDataFormatBase64Encoded, 'base64')
    core.info('Steam config.vdf decoded.')

    const steamHomeCompacted = this.getInputOrDefault('steam_home', () => '$HOME/Steam')
    const steamHome = await this.expandEnvVars(steamHomeCompacted)
    core.info(`Steam home is ${steamHome}`)

    const steamUsername = this.getRequiredInput('steam_username')
    core.info('Got steam username.')

    core.info('Done.')
    return { configValveDataFormat, steamHome, steamUsername }
  }

  ensureSteamConfigDirTaskEither({ steamHome }: { steamHome: string }): TE.TaskEither<unknown, string> {
    return TE.tryCatch(
      async () => await this.ensureSteamConfigDir(steamHome),
      reason => reason
    )
  }

  @ActionLogGroup('Ensuring steam config directory')
  async ensureSteamConfigDir(steamHome: string): Promise<string> {
    const steamConfigDir = path.join(steamHome, 'config')
    try {
      core.info(`Ensuring directory ${steamConfigDir}...`)
      await fs.mkdir(steamConfigDir, { recursive: true })
      core.info('Done.')
      return steamConfigDir
    } catch (error) {
      core.error(
        `Couldn't ensure steam config directory. Reason: ${discernFileSystemErrorReason(error, {
          file: steamConfigDir
        })}`
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
  }): TE.TaskEither<unknown, string> {
    return TE.tryCatch(
      async () => await this.writeSteamConfigFile(steamConfigDirectory, configValveDataFormat),
      reason => reason
    )
  }

  async writeFile(
    file: string,
    content: string | Uint8Array,
    options: Parameters<fs.FileHandle['writeFile']>[1] = null
  ): Promise<string> {
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
  async writeSteamConfigFile(steamConfigDirectory: string, configValveDataFormat: Buffer): Promise<string> {
    const steamConfigFile = path.join(steamConfigDirectory, 'config.vdf')
    try {
      return await this.writeFile(steamConfigFile, configValveDataFormat, {
        encoding: 'ascii',
        mode: 0o777
      })
    } catch (error) {
      core.error(
        `Failed to write Steam config. Reason: ${discernFileSystemErrorReason(error, { file: steamConfigFile })}`
      )
      throw error
    }
  }

  testLoginSucceedsTaskEither({ steamUsername }: { steamUsername: string }): TE.TaskEither<unknown, void> {
    return TE.tryCatch(
      async () => await this.testLoginSucceeds(steamUsername),
      reason => reason
    )
  }

  @ActionLogGroup('Testing login succeeds')
  async testLoginSucceeds(steamUsername: string): Promise<void> {
    core.info('Attempting SteamCMD login...')
    // U+0004: 'End of Transmission' - if prompted for a password, fail immediately
    const loginExitCode = await exec.exec(
      'steamcmd',
      ['+set_steam_guard_code', 'INVALID', '+login', `${steamUsername}`, '+quit'],
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
