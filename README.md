# auth-steamcmd

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This action helps you to login to Steam with the **Steam Console Client** for use in actions.

## Usage

The following example will install and validate the app with ID 1337, which can be any Steam application licensed
to the logged-in Steam account.

```yaml
steps:
  - name: Setup SteamCMD
    uses: Lordfirespeed/setup-steamcmd@v2

  - name: Populate SteamCMD profile config
    uses: Lordfirespeed/auth-steamcmd@v1
    with:
      steam_config_vdf: ${{ secrets.steam_config_vdf }}

  - name: Update licensed app
    run: steamcmd +login ${{ secrets.steam_username }} +app_update 1337 validate +quit
```

## Outputs

| name | description |
|:----:|:-----------:|

## Todo

[] Update the Action Metadata
[] Update the Action Code
[] Validate/Test the action
[] Publish release
