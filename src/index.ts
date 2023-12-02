/**
 * The entrypoint for the action.
 */
import * as core from '@actions/core'

import { AuthenticateSteamCMD } from './main'

async function wrap_install() {
  await (new AuthenticateSteamCMD).run().catch(error => core.setFailed(error))
}

void wrap_install()
