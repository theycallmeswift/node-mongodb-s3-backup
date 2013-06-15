# Node MongoDB / S3 Backup

This is a package that makes backing up your mongo databases to S3 simple.
The binary file is a node cronjob that runs at midnight every day and backs up
the database specified in the config file.

## Installation

    npm install mongodb_s3_backup -g

## Configuration

To configure the backup, you need to pass the binary a JSON configuration file.
There is a sample configuration file supplied in the package (`config.sample.json`).
The file should have the following format:

    {
      "mongodb": {
        "host": "localhost",
        "port": 27017,
        "username": false,
        "password": false,
        "db": "database_to_backup"
      },
      "s3": {
        "key": "your_s3_key",
        "secret": "your_s3_secret",
        "bucket": "s3_bucket_to_upload_to",
        "destination": "/"
      },
      "cron": {
        "time": "11:59",
      }
    }

### Crontabs

You may optionally substitute the cron "time" field with an explicit "crontab"
of the standard format `0 0 * * *`.

      "cron": {
        "crontab": "0 0 * * *"
      }

*Note*: The version of cron that we run supports a sixth digit (which is in seconds) if
you need it.

### Timezones

The optional "timezone" allows you to specify timezone-relative time regardless
of local timezone on the host machine. 

      "cron": {
        "time": "00:00",
        "timezone": "America/New_York"
      }

You must first `npm install time` to use "timezone" specification.

## Running

To start a long-running process with scheduled cron job:

    mongodb_s3_backup <path to config file>

To execute a backup immediately and exit:

    mongodb_s3_backup -n <path to config file>
