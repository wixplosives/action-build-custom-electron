import * as fs from 'fs'
import * as path from 'path'

export async function findFirstFileByExtension(
  dir: string,
  ext: string
): Promise<string> {
  const files = fs.readdirSync(dir)
  const targetFiles = files.filter(file => {
    return path.extname(file).toLowerCase() === ext
  })
  if (targetFiles.length > 0) {
    return targetFiles[0]
  }
  return ''
}

export function getPlatform(): string {
	switch (process.platform) {
		case "darwin":
			return "mac";
		case "win32":
			return "windows";
		default:
			return "linux";
	}
};

export function setEnv(name: string, value: string){
	if (value) {
		process.env[name.toUpperCase()] = value.toString();
	}
};

export function getResultExtension(): string[] {
  switch (process.platform) {
    case 'darwin':
      return ['.dmg']
    case 'win32':
      return ['.exe']
    default:
      return ['.deb', '.pacman']
  }
}

export function buildCmdParams( feature: string, featureConfig: string, publish: string): string[]{
  let cmdParams = []
  if (feature && feature.length !== 0){
    cmdParams.push('-f')
    cmdParams.push(feature)
  }
  if (featureConfig && featureConfig.length !== 0){
    cmdParams.push('-c')
    cmdParams.push(featureConfig)
  }
  if (publish && publish.length !== 0){
    cmdParams.push('--publish')
    cmdParams.push(publish)
  }
  return cmdParams
}
