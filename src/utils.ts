import * as fs from 'fs'
import * as path from 'path'

export async function findFirstFileByExtension(
  dir: string,
  ext: string
): Promise<string> {
  const files = fs.readdirSync(dir)
  const targetFiles = files.filter(file => {
    return path.basename(file).toLowerCase().endsWith(ext)
  })
  if (targetFiles.length > 0) {
    return targetFiles[0]
  }

  return ''
}

export function getPlatform(): string {
  switch (process.platform) {
    case 'darwin':
      return 'mac'
    case 'win32':
      return 'windows'
    default:
      return 'linux'
  }
}

export function setEnv(name: string, value: string): void {
  if (value) {
    process.env[name.toUpperCase()] = value
  }
}

export function getResultExtension(): string[] {
  switch (process.platform) {
    case 'darwin':
      return ['.x64.dmg', '.arm64.dmg']
    case 'win32':
      return ['.exe']
    default:
      return ['.deb', '.pacman']
  }
}

export function buildCmdParams(
  feature: string,
  featureConfig: string,
  publish: string
): string[] {
  const cmdParams = []
  if (feature && feature.length !== 0) {
    cmdParams.push('-f')
    cmdParams.push(feature)
  }
  if (featureConfig) {
    cmdParams.push('-c')
    cmdParams.push(featureConfig)
  }
  if (publish) {
    cmdParams.push('--publish')
    cmdParams.push(publish)
  }
  return cmdParams
}
