#!/usr/bin/env node

/* Dependencies */

var cli = require('cli')
  , path = require('path')
  , util = require('util')
  , backup = require('../')
  , cronJob = require('cron').CronJob
  , pkg = require('../package.json')
  , options, config;

cli
  .enable('version')
  .setApp(pkg.name, pkg.version)
  .setUsage(cli.app + ' [OPTIONS] <path to json config>');

options = cli.parse({
  now:   ['n', 'Run sync on start']
});

if(cli.args.length !== 1) {
  return cli.getUsage();
}

config = require(path.resolve(process.cwd(), cli.args[0]));

util.log('[info] MongoDB S3 Backup Successfully loaded');
new cronJob('0 0 * * *', function(){
  backup.sync(config.mongodb, config.s3);
}, null, true, "America/New_York");
util.log('[info] MongoDB S3 Backup Successfully scheduled');

if(options.now) {
  backup.sync(config.mongodb, config.s3, function() {
    process.exit();
  });
}
