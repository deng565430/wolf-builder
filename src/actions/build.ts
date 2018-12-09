import { join, resolve } from 'path'
import {getConfig,spawnSyncEx} from '../utils/index'
import buildLib from './buildLib'

const root = process.cwd()
const projectDir = resolve(__dirname, '../')

export default async (env: string, options) => {
  const { modules, disableUglify, configDirectory } = options
  // const cfg = getConfig(env, configDirectory)

  // if (cfg.libList) {
  //   await buildLib(env, options, false)
  // }

  spawnSyncEx('node', [
    resolve(root, './node_modules/webpack/bin/webpack.js'),
    '--config',
    resolve(projectDir, 'webpack/prod.js'),
    '--env.env',
    env,
    '--env.moduleName',
    options.module,
    '--env.configDirectory',
    options.configDirectory
  ])
}

