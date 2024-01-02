/**
 * The entrypoint for the action.
 */
import * as core from '@actions/core'

import AuthenticateSteamCMD from './main'
import typeSafeError from './lib/type-safe-error'

export default async function wrap_install(): Promise<void> {
  try {
    await new AuthenticateSteamCMD().run()
  } catch (error) {
    typeSafeError(error, core.setFailed)
  }
}

void wrap_install()
