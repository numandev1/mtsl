#! /usr/bin/env node
require = require('esm')(module)

const program = require('commander')
const { version } = require('../package.json')
const { add } = require('../src/controller/add')
const { remove } = require('../src/controller/remove')
const { list } = require('../src/controller/list')
const { removeall } = require('../src/controller/removeall')
const { start } = require('../src/controller/start')

program
  .storeOptionsAsProperties(true)
  .passCommandToAction(false)
  .version(version)

program
  .command('add')
  .description('run setup commands for all envs')
  .option('-s, --src <src>', 'source path')
  .option('-d, --dest <dest>', 'destination path')
  .option(
    '-sp, --skip-prompt <skip>',
    'Skips the prompt asking to setup ignored folders',
    false
  )
  .action(({ src, dest, skip }) => add(src, dest, skip))

program
  .command('remove [id]')
  .description('remove link by id')
  .action((id) => remove(id))

program.command('list').description('show list of link').action(list)

program.command('removeall').description('remove all link').action(removeall)

program
  .command('start [id]')
  .description('start link by id')
  .action((id) => start(id))

program
  .command('startwithoutadd')
  .description('start link without add link')
  .option('-s, --src <src>', 'source path')
  .option('-d, --dest <dest>', 'destination path')
  .action(({ src, dest }) =>
    start(true,true, {
      src: src,
      dest: dest,
    })
  )

program.parse(process.argv)
