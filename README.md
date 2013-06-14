# Node MongoDB / S3 Backup

This is a package that makes backing up your mongo databases to S3 simple.
The binary file is a node cronjob that runs at the specified time every day
and backs up the database specified in the config file.

## Installation

    npm install mongodb_s3_backup -g

## Configuration

To configure the backup, you need to pass the binary a JSON configuration file.
There is a sample `config.json` file supplied in the package. The file should 
have the following format:

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
        "secret": "your_s3_bucket",
        "bucket": "s3_bucket_to_upload_to",
        "destination": "/backups"
      },
      "cron": {
        "time": "00:00",
        "timezone": "America/New_York"
      }
    }

You may optionally substitute the cron "time" field with an explicit "crontab"
of the standard format `00 00 * * *`.

The optional "timezone" allows you to specify timezone-relative time regardless
of local timezone on the host machine.

## Running

To start a long-running process with scheduled cron job:

    mongodb_s3_backup <path to config file>

To execute a backup immediately and exit:

    mongodb_s3_backup -n <path to config file>
