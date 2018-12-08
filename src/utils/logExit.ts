import chalk from 'chalk'

export default (...args) => {
  console.log(chalk.red(...args))
  process.exit(1)
}
