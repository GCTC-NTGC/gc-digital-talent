# Activitylog

A record of database events is recorded using the package spatie/laravel-activitylog [`found here`](https://spatie.be/docs/laravel-activitylog/v4/introduction).
Configuration file is present at /api/config/activitylog.php
Configuration properties of note include deletion date range, on/off toggle, and soft deletion fetching.

# Logged models

Logging currently on User, Pool, PoolCandidate, and PoolCandidateSearchRequest models.
Can track caused-by activity for a user.

# Record deletion

In config, deletion set to 365 days mark. This means running the clean command removes records >365 days old.
Clean command is executed by running

php artisan activitylog:clean

Laravel scheduler in kernel can be set to run clean on a regular basis if needed.
