import * as core from '@actions/core'
import * as path from 'path'
import type childProcess from 'child_process'
import {findFirstFileByExtension} from './utils'
import {spawnSyncLogged} from './process'

function getResultExtension(): string[] {
  switch (process.platform) {
    case 'darwin':
      return ['.dmg']
    case 'win32':
      return ['.exe']
    default:
      return ['.deb', '.pacman']
  }
}

async function run(): Promise<void> {
  try {
    const packageFolder: string = core.getInput('packageFolder')
    const feature: string = core.getInput('feature')
    const featureConfig: string = core.getInput('featureConfig')
    const buildCmd: string = core.getInput('buildCmd')
    const buildFolder: string = core.getInput('buildFolder')
    core.debug(`Building ${feature} ${featureConfig} ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    // yarn
    const fullPathToPackage = path.resolve(packageFolder)
    core.info(`Running in ${fullPathToPackage}`)
    const featureSuffix = feature.replace('/', '-')
    const spawnOptions: childProcess.SpawnSyncOptions = {
      cwd: fullPathToPackage,
      stdio: 'inherit',
      shell: true,
      env: {...process.env, WCS_FEATURE_NAME: `-${featureSuffix}`}
    }
    spawnSyncLogged(
      buildCmd,
      ['-f', feature, '-c', featureConfig, '--publish', 'never'],
      spawnOptions
    )
    const extensions = getResultExtension()
    const fullPathToBuildFolder = path.join(fullPathToPackage, buildFolder)
    core.info(
      `Build folder - ${fullPathToBuildFolder}. Extension - ${extensions}`
    )
    if (extensions[0]) {
      const resultFileName = await findFirstFileByExtension(
        fullPathToBuildFolder,
        extensions[0]
      )
      core.info(`Result file - ${resultFileName}`)
      core.setOutput('packageFile', resultFileName)
    }
    if (extensions[1]) {
      const resultFileName = await findFirstFileByExtension(
        fullPathToBuildFolder,
        extensions[1]
      )
      core.info(`Result file 2 - ${resultFileName}`)
      core.setOutput('packageFile2', resultFileName)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
