# auth-steamcmd

[![GitHub Super-Linter](https://github.com/Lordfirespeed/auth-steamcmd/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/Lordfirespeed/auth-steamcmd/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/Lordfirespeed/auth-steamcmd/actions/workflows/check-dist.yml/badge.svg)](https://github.com/Lordfirespeed/auth-steamcmd/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/Lordfirespeed/auth-steamcmd/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Lordfirespeed/auth-steamcmd/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This action helps you to login to Steam with the **Steam Console Client** for
use in actions.

## Usage

The following example will install and validate the app with ID 1337, which
can be any Steam application licensed to the logged-in Steam account.

```yaml
steps:
  - name: Setup SteamCMD
    uses: Lordfirespeed/setup-steamcmd@v2

  - name: Populate SteamCMD profile config
    uses: Lordfirespeed/auth-steamcmd@v1
    with:
      steam_config_vdf: ${{ secrets.steam_config_vdf }}
      steam_username: ${{ secrets.steam_username }}

  - name: Update licensed app
    run: steamcmd +login ${{ secrets.steam_username }} \
      +app_update 1337 validate +quit
```

## Inputs

|       name       |           description            |             default              |
|:----------------:|:--------------------------------:|:--------------------------------:|
| steam_config_vdf | Base64 encoded `config.vdf` file | :warning: **required** :warning: |
|  steam_username  | username of account to login as  | :warning: **required** :warning: |
|    steam_home    |  steam configuration directory   |          `$HOME/Steam`           |

## Acknowledgements

- [game-ci/steam-deploy](https://github.com/game-ci/steam-deploy/blob/main/steam_deploy.sh)
  for specifics on using the `config.vdf` file to authenticate with SteamCMD

## Todo

[ ] Update the Action Metadata
[ ] Update the Action Code
[ ] Validate/Test the action
[ ] Publish release
