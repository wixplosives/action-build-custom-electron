import * as core from '@actions/core'
import {findFirstFileByExtension} from './utils'
import {spawnSyncLogged} from './process'
import type childProcess from 'child_process'
import * as path from 'path'

function getPlatform(): string {
  switch (process.platform) {
    case 'darwin':
      return 'mac'
    case 'win32':
      return 'windows'
    default:
      return 'linux'
  }
}

function getResultExtension(platform: string): string {
  switch (platform) {
    case 'mac':
      return '.dmg'
    case 'win32':
      return '.exe'
    default:
      return '.deb'
  }
}

async function run(): Promise<void> {
  try {
    const packageFolder: string = core.getInput('packageFolder')
    const feature: string = core.getInput('feature')
    const featureConfig: string = core.getInput('featureConfig')
    const buildCmd: string = core.getInput('buildCmd')
    const buildFolder: string = core.getInput('buildFolder')
    const platform = getPlatform()
    core.debug(`Building ${feature} ${featureConfig} ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    // yarn
    const fullPathToPackage = path.resolve(packageFolder)
    core.info(`Running in ${fullPathToPackage}`)
    const featureSuffix = feature.replace('/', '-')
    const spawnOptions: childProcess.SpawnSyncOptions = {
      cwd: fullPathToPackage,
      stdio: 'inherit',
      shell: true,
      env: {...process.env, WCS_FEATURE_NAME: featureSuffix}
    }
    spawnSyncLogged(
      buildCmd,
      ['-f', feature, '-c', featureConfig],
      spawnOptions
    )
    const extension = getResultExtension(platform)
    const fullPathToBuildFolder = path.join(fullPathToPackage, buildFolder)
    core.info(
      `Build folder - ${fullPathToBuildFolder}. Extension - ${extension}`
    )
    const resultFileName = await findFirstFileByExtension(
      fullPathToBuildFolder,
      extension
    )
    core.info(`Result file - ${resultFileName}`)
    core.setOutput('packageFile', resultFileName)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
