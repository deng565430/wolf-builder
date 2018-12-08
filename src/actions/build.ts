import { join, resolve } from 'path'
import {getConfig,spawnSyncEx} from '../utils/index'
import buildLib from './buildLib'

const root = process.cwd()
const projectDir = resolve(__dirname, '../')

export default async (env: string, options) => {
  const { modules, disableUglify, configDirectory } = options
  const cfg = getConfig(env, configDirectory)

  if (cfg.libList) {
    await buildLib(env, options, false)
  }

  spawnSyncEx('node', [
    join(projectDir, 'scripts/build'),
    '--config',
    JSON.stringify({
      file:  resolve(projectDir, 'webpack/prod.js'),
      isDev: false,
      env,
      modules,
      disableUglify,
      configDirectory,
    }),
  ])
}
