import {spawnSync, SpawnSyncOptions, SpawnSyncReturns} from 'child_process'
import {log, logError} from './log'
import {isString} from './language-helpers'

export const spawnSyncSafe = ((...args: Parameters<typeof spawnSync>) => {
  const spawnResult = spawnSync(...args)
  if (spawnResult.status !== 0) {
    throw new Error(
      `Command "${args
        .filter(isString)
        .join(' ')}" failed with exit code ${String(spawnResult.status)}.`
    );
  }
  return spawnResult
}) as typeof spawnSync

export function spawnSyncLogged(
  command: string,
  args: string[],
  options: SpawnSyncOptions,
  label = options.cwd || process.cwd()
): SpawnSyncReturns<Buffer> {
  log(`${label}: ${command} ${args.join(' ')}`)
  return spawnSyncSafe(command, args, options)
}

export function reportProcessError(message: unknown): void {
  logError(message)
  process.exitCode = 1
}
