import spawn from 'cross-spawn'

const spawnSync = spawn.sync

const spawnSyncEx = (...argus) => {
  const spawnSyncReturns = spawnSync(...argus, {
    stdio: 'inherit',
  })
  const { status } = spawnSyncReturns
  if (status === 1) {
    process.exit(1)
  }
}

export { spawn, spawnSync, spawnSyncEx }
