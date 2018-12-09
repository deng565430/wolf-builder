import { join } from "path"
import extend  from './extend'
import omit from 'lodash.omit'
import fs from 'fs-extra'
import logExit from './logExit'

const configProps = [
  // 'appName', 放开
  'devHost',
  'devPort',
  'proxy',
  'entry',
  'libList',
  'useLib',
  'libAssetsName',
  'projectAssetsName',
  'publicPath',
  'resolveAlias',
  'sassImports',
  'customWebpack'
]

export interface SlothConfg {
  appName?: string
  devHost?: string
  devPort?: number
  proxy?: object
  entry?: string | ((moduleName) => string)
  libList?: Array<string>
  useLib?: boolean
  libAssetsName?: string
  projectAssetsName?: string
  publicPath?: string
  resolveAlias?: object
  sassImports?: Array<string>
  customWebpack?: any
}

const defaultConfig = {
  devHost: '0.0.0.0',
  devPort: 8888,
  entry: './src/index.tsx',
  libAssetsName: 'lib-config.json',
  projectAssetsName: 'wolf-config.json',
  publicPath: '/',
  customWebpack: config => config
}

let baseConfigs = {

}

let config: SlothConfg

const loadConfg = (name = 'default', dir = 'config/') => {
  const cfg = baseConfigs[name]

  if (typeof cfg !== 'undefined') {
    return cfg
  }

  const path = join(process.cwd(), `${dir}config.${name}.js`)
  if (fs.existsSync(path)) {
    try {
      const gc = require(path)
      baseConfigs[name] = gc({})
      return baseConfigs[name]
    } catch (err) {
      logExit(`get ${name} Config Error\n` + err)
    }
  } else {
    return {}
  }
}

const getConfig = (env: string, dir?: string) => {

  if (typeof config !== 'undefined') {
    return config
  }

  const defaultCfg = loadConfg('default', dir)
  const envCfg = loadConfg(env, dir)

  config = extend(true, defaultConfig, defaultCfg, envCfg)

  if (typeof config.appName === 'undefined') {
    logExit('get Config Error: appName is undefined')
  }

  return config
}

export const getSysConfig = (env: string, dir?: string) => {
  const cfg = getConfig(env, dir)
  return omit(cfg, configProps)
}

export default getConfig
