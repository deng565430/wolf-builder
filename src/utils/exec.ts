import { exec, execSync } from 'child_process'

const execSyncEx = (...argus) => {
  try {
    (execSync as any)(...argus, {
      stdio: 'inherit',
    })
  } catch (error) {
    process.exit(1)
  }
}


export { exec, execSync, execSyncEx }
