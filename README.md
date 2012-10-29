# Node MongoDB / S3 Backup

This is a package that makes backing up your mongo databases to S3 simple.
The binary file is a node cronjob that runs at midnight every day and backs up
the database specified in the config file.

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
        "bucket": "s3_bucket_to_upload_to"
      }
    }

## Running

    mongodb_s3_backup <path to config file>
