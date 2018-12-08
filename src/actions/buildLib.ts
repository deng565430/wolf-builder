import { join, resolve } from 'path'
import {fs,getConfig,spawnSyncEx} from '../utils/index'

const root = process.cwd()
const projectDir = resolve(__dirname, '../')

export default async (env: string, options, onlyBuildLib = true) => {
  const { disableUglify = true, configDirectory } = options
  const cfg = getConfig(env, configDirectory)

  if (!cfg.libList) {
    // 跳过
  } else {
    fs.removeSync(join(root, 'build'))

    spawnSyncEx('node', [
      join(projectDir, 'scripts/build.js'),
      '--config',
      JSON.stringify({
        file: join(projectDir, 'webpack/lib.js'),
        isDev: env === 'local',
        env,
        disableUglify,
        configDirectory,
        onlyBuildLib: onlyBuildLib === true
      }),
    ])
  }
}
