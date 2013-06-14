#!/usr/bin/env node

/* Dependencies */

var cli = require('cli')
  , path = require('path')
  , util = require('util')
  , backup = require('../')
  , cronJob = require('cron').CronJob
  , pkg = require('../package.json')
  , options, config, crontab, timezone;

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
if(config.cron && config.cron.crontab) {
  crontab = config.cron.crontab;
} else {
  var time_toks = (config.cron && config.cron.time) ? config.cron.time.split(':') : [0,0];
  var hour = time_toks[0], minute = time_toks[1];
  crontab = util.format('%d %d * * *', minute, hour);
}
timezone = (config.cron && config.cron.timezone) ? config.cron.timezone : "America/New_York";

backup.log('MongoDB S3 Backup Successfully loaded');
new cronJob(crontab, function(){
  backup.sync(config.mongodb, config.s3);
}, null, true, timezone);
backup.log('MongoDB S3 Backup Successfully scheduled');

if(options.now) {
  backup.sync(config.mongodb, config.s3, function(err) {
    process.exit(err ? 127 : 0);
  });
}
