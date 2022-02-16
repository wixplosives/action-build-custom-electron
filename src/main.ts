import * as core from '@actions/core'
import { findFirstFileByExtension, setEnv, getPlatform, getResultExtension, buildCmdParams } from './utils'
import { spawnSyncLogged } from './process'
import type childProcess from 'child_process'
import * as path from 'path'



function setEnvVars() : void{

  const feature: string = core.getInput('feature')
  const githubToken: string = core.getInput("githubToken")
  if (githubToken && githubToken.length !== 0){
    setEnv('GH_TOKEN', githubToken);
  }
  if (feature && feature.length > 0) {
    const featureSuffix = feature.replace('/', '-')
    setEnv("WCS_FEATURE_NAME", `-${featureSuffix}`);
  }
  const platform = getPlatform()
  if (platform === "mac") {
    setEnv("CSC_LINK", core.getInput("macCerts"));
    setEnv("CSC_KEY_PASSWORD", core.getInput("macCertsPassword"));
  } else if (platform === "windows") {
    setEnv("CSC_LINK", core.getInput("windowsCerts"));
    setEnv("CSC_KEY_PASSWORD", core.getInput("windowsCertsPassword"));
  }
}

async function run(): Promise<void> {
  try {
    const packageFolder: string = core.getInput('packageFolder')
    const feature: string = core.getInput('feature')
    const featureConfig: string =  core.getInput('featureConfig')
    const buildCmd: string = core.getInput('buildCmd')
    const publish: string = core.getInput('publish')
    const buildFolder: string = core.getInput('buildFolder')

    core.debug(`Building ${feature} ${featureConfig} ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    // yarn
    const fullPathToPackage = path.resolve(packageFolder)
    core.info(`Running in ${fullPathToPackage}`)

    setEnvVars()
    
    const spawnOptions: childProcess.SpawnSyncOptions = {
      cwd: fullPathToPackage,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env }
    }
    const buildParams = buildCmdParams(feature, featureConfig, publish)

    core.info(`Run build command:  "${buildCmd} ${buildParams.join(' ')}"`  )

    spawnSyncLogged(
      buildCmd,
      buildParams,
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
