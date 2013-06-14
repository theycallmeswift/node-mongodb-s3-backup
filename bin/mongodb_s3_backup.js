#!/usr/bin/env node

/* Dependencies */

var cli = require('cli')
  , path = require('path')
  , util = require('util')
  , backup = require('../')
  , cronJob = require('cron').CronJob
  , pkg = require('../package.json')
  , crontab = "0 0 * * *"
  , timezone = "America/New_York"
  , time = [0, 0]
  , options, configPath, config;

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

/* Configuration */

configPath = path.resolve(process.cwd(), cli.args[0]);
backup.log('Loading config file (' + configPath + ')');
config = require(configPath);

if(options.now) {
  backup.sync(config.mongodb, config.s3, function(err) {
    process.exit(err ? 1 : 0);
  });
} else {
  // If the user overrides the default cron behavior
  if(config.cron) {
    if(config.cron.crontab) {
      crontab = config.cron.crontab
    } else if(config.cron.time) {
      time = config.cron.time.split(':')
      crontab = util.format('%d %d * * *', time[0], time[1]);
    }

    if(config.cron.timezone) {
      try {
        require('time'); // Make sure the user has time installed
      } catch(e) {
        backup.log(e, "error");
        backup.log("Module 'time' is not installed by default, install it with `npm install time`", "error");
        process.exit(1);
      }

      timezone = config.cron.timezone;
      backup.log('Overriding default timezone with "' + timezone + '"');
    }
  }

  new cronJob(crontab, function(){
    backup.sync(config.mongodb, config.s3);
  }, null, true, timezone);
  backup.log('MongoDB S3 Backup Successfully scheduled (' + crontab + ')');
}
