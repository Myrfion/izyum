const { Command } = require('commander');
const program = new Command();

program
  .name('Izyum')
  .description('The Izyum is a simple SSG that converts .txt and .md files')
  .version('0.1.0');

program
  .option("-i, --input <path>", "covnerts .txt and md files of provided folder/file to .html")
  .option("-v, --version", "shows the version")
  .option("-h, --help", "shows the help message")
  .option("-c, --config <config>", "run with config")

program.parse(process.argv);

module.exports = program

