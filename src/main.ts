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
      TE.bind('steamConfigDirectory', state =>
        this.ensureSteamConfigDirTaskEither(state)
      ),
      TE.bind('steamConfigFile', state =>
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
      return core.getInput(key, { required: true })
    } catch (error) {
      core.error(discernActionInputErrorReason(error, { inputKey: key }))
      throw error
    }
  }

  @ActionLogGroup('Getting inputs')
  async getInputs() {
    const configValveDataFormatBase64Encoded = this.getRequiredInput('steam_config_vdf')
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

    const steamHome = this.getRequiredInput('steam_home')
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

  @ActionLogGroup('Writing config file')
  async writeSteamConfigFile(
    steamConfigDirectory: string,
    configValveDataFormat: Buffer
  ) {
    const steamConfigFile = path.join(steamConfigDirectory, 'config.vdf')
    try {
      core.info(`Opening ${steamConfigFile} for writing...`)
      // will throw if file already exists
      const steamConfigFileHandle = await fs.open(steamConfigFile, 'wx')

      core.info(`Writing decoded contents...`)
      await steamConfigFileHandle.writeFile(configValveDataFormat, {
        encoding: 'ascii'
      })
      core.info('Done.')
      return steamConfigFile
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
    const loginExitCode = await exec.exec('steamcmd', ['+login', '+quit'], {
      ignoreReturnCode: true,
      input: Buffer.from('\u0004')
    })

    if (loginExitCode === 0) {
      console.info('Login succeeded.')
      return
    }

    console.error('Login failed!')
    throw new Error('Failed to login with SteamCMD')
  }
}
