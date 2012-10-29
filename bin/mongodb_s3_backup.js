#!/usr/bin/env node

/* Dependencies */

var cli = require('cli')
  , path = require('path')
  , backup = require('../')
  , cronJob = require('cron').CronJob
  , pkg = require('../package.json')
  , options, config;

cli
  .enable('version')
  .setApp(pkg.name, pkg.version)
  .setUsage(cli.app + ' [OPTIONS] <path to json config>');

options = cli.parse();

if(cli.args.length !== 1) {
  return cli.getUsage();
}

config = require(path.resolve(process.cwd(), cli.args[0]));

new cronJob('* * * * *', function(){
  backup.sync(config.mongodb, config.s3);
}, null, true, "America/New_York");
