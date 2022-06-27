import {findFirstFileByExtension, buildCmdParams} from '../src/utils'
import {join} from 'path'

const fixturesRoot = join(__dirname, 'fixtures')

test('Find first file with specific extension in folder .arm64.dmg', async () => {
  const buildFolder = join(fixturesRoot, 'package1/build')
  const resultFileName = await findFirstFileByExtension(
    buildFolder,
    '.arm64.dmg'
  )
  expect(resultFileName).toBe('WcsElectron-some.arm64.dmg')
})

test('Find first file with specific extension in folder .x64.dmg', async () => {
  const buildFolder = join(fixturesRoot, 'package1/build')
  const resultFileName = await findFirstFileByExtension(buildFolder, '.x64.dmg')
  expect(resultFileName).toBe('WcsElectron-some.x64.dmg')
})

test('Build command for regular build', async () => {
  const resultArray = buildCmdParams('feature1', 'featureConfig', 'always')
  expect(resultArray).toContain('-f')
  expect(resultArray).toContain('feature1')
  expect(resultArray).toContain('-c')
  expect(resultArray).toContain('featureConfig')
  expect(resultArray).toContain('--publish')
  expect(resultArray).toContain('always')
})

test('Build command no feature', async () => {
  const resultArray = buildCmdParams('', '', 'always')
  expect(resultArray).toHaveLength(2)
  expect(resultArray).toContain('--publish')
  expect(resultArray).toContain('always')
})

test('Build command no publish, no feature', async () => {
  const resultArray = buildCmdParams('', '', '')
  expect(resultArray).toHaveLength(0)
})
