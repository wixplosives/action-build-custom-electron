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
