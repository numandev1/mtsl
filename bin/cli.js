#! /usr/bin/env node
require = require('esm')(module);

const program = require('commander')
const { version } = require('../package.json');
const {add} = require('../src/controller/add');
const {remove} = require('../src/controller/remove');
const {list} = require('../src/controller/list');
const {removeall} = require('../src/controller/removeall');

program
  .storeOptionsAsProperties(true)
  .passCommandToAction(false)
  .version(version)

program
  .command('add')
  .description('run setup commands for all envs')
  .option('-s, --src <src>', 'source path')
  .option('-d, --desc <desc>', 'destination path')
  .action(({ src, desc }) => add( src, desc ))

program
  .command('remove [id]')
  .description('run setup commands for all envs')
  .action((id) => remove(id))

  program
  .command('list')
  .description('run setup commands for all envs')
  .action(list)

  program
  .command('removeall')
  .description('run setup commands for all envs')
  .action(removeall)

program.parse(process.argv)
