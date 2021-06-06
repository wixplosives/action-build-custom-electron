import {findFirstFileByExtension} from '../src/utils'
import {join} from 'path'

const fixturesRoot = join(__dirname, 'fixtures')

test('Find first file with specific extension in folder', async () => {
  const buildFolder = join(fixturesRoot, 'package1/build')
  const resultFileName = await findFirstFileByExtension(buildFolder, '.dmg')
  expect(resultFileName).toBe('WcsElectron-some.dmg')
})
