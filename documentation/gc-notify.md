# GC Notify

## Introduction

[GC Notify](https://notification.canada.ca/) helps federal public servants send emails and texts, to their teams and members of the public. We integrate with this service to send emails to users of the app. The service dashboard can be reached at https://notification.canada.ca/sign-in.

## Local Testing

The integration with GC Notify can be set up for testing locally as well as running on deployed servers. This document if focused on the former.

### API Key

Connecting to the GC Notify service requires setting an API key in the environment variable named `GCNOTIFY_API_KEY`. Locally, set it in the `api/.env` file.

There are three different types of API keys you can use:

- **test**: Never sends a message but simulates success.
- **team**: Sends only to addresses in the safelist or belonging to a team member.
- **live**: Sends to any address.

Only the "test" or "team" API key should be used in testing. Refer to [the service documentation](https://documentation.notification.canada.ca/en/keys.html#key-types) for more details.

API keys are sensitive and protected. Ask a teammate if you need them provided and then safeguard them.

### Template IDs

Sending messages to the service requires the app to be configured with the template ID for each message type. These are saved in environment variables starting with the prefix `GCNOTIFY_TEMPLATE_`. Locally, set them in the `api/.env` file. The list of templates with their IDs can be found by logging into the service dashboard and navigating to https://notification.canada.ca/services/{service_id}/templates. A teammate could provide a bulk list to paste into the `.env` file, as well.

### Testing

After the `api/.env` file has been updated, the settings will need to be applied. A queue worker will also need to be started since messages are sent asynchronously from a queue.

1. If the API has been optimized, clear it with `artisan optimize:clear`
   - The makefile `refresh_api` shortcuts ([1](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/Makefile#L25) [2](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/Makefile.nix#L32)) will complete this.
2. Restart PHP-FPM with `pkill -o -USR2 php-fpm`
   - Alternatively, just restart the webserver container
   - The .nix makefile [refresh_api](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/Makefile.nix#L32) shortcut will complete steps 1 and 2.
3. Check the configuration by running `artisan tinker --execute="echo config('notify.client.apiKey')"`
4. Start a queue worker to send the messages. `runuser -u www-data -- php /home/site/wwwroot/api/artisan queue:work`
   - The make file `queue_work shortcuts ([1](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/Makefile#L53) [2](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/Makefile.nix#L64)) will complete this.
5. Send a test message with ` ./artisan send-notifications:test example@example.org`

### Troubleshooting

1. I never received a message.
   - Do you have the API key and template IDs set in your `api/.env` file?
   - Did you optimize:clear and restart FPM after setting your environment variables?
   - Did you start a queue worker?
   - Are you using the `team` API key or just the `test` one?
   - Is the email address you sent to either in the safelist or belonging to a team member?
   - Do you see any error messages in the `api/storage/logs/jobs.log` file?
   - Is your job showing with more than one attempt in the database `jobs` table?
   - Is your job showing in the database `failed_jobs` table?
