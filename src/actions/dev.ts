import { join, resolve } from 'path'
import {spawnSyncEx} from '../utils/index'
const root = process.cwd()
const projectDir = resolve(__dirname, '../')
export default async (options) => {
  const env = options.env ? options.env : 'local'
  console.log(env, projectDir)

  spawnSyncEx('node', [
    resolve(root, './node_modules/webpack-dev-server/bin/webpack-dev-server.js'),
    '--config',
    resolve(projectDir, 'webpack/dev.js'),
    '--env.env',
    env,
    '--env.moduleName',
    options.module,
    '--env.configDirectory',
    options.configDirectory
  ])
}
