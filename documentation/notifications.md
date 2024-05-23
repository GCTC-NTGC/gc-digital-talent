# Notifications

Sometimes, it is necessary to communicate with our users outside of the application. In order to do that, we can send emails and SMS messages using [GC Notify](https://notification.canada.ca/). This is done on the server in the `api` Laravel project.

> [!NOTE]
> It may be useful to read the [GC Notify documentation](https://documentation.notification.canada.ca/) to get a better understanding of how the client operates.

We do this using the `App\Notify\Client` via a facade (`App\Facades\Notify`). This is bound as a singleton to the the service container.

## Configuration

You can find configuration in the `config/notify.php` file. It is required to have an environment variable to be set for `GCNOTIFY_API_KEY`.

### Templates

When sending a notification, we need to pass a template ID to the API. In order to make this a more pleasant experience, we have setup this config file to store a map of template IDs to make them more identifiable for developers. This is done by using an associative array where the key is the human readable identifier and the value is the ID from GC Notify.

### Using Templates

You can access these templates from the Laravel config like any other configuration value.

```php
// Getting all templates as array
$templates = config('notify.templates')
$emailTemplate = $templates['email'];

// Getting a single template
$emailTemplate = config('notify.templates.email');
```

### Reply To/Senders

Similar to templates, we can pass a sender ID to accept replies from users. We have set this up in an identical way to templates under the `replyTo` key.

```php
// Getting all senders as an array
$replyTo = config('notify.replyTo')
$emailTemplate = $replyTo['admin'];

// Getting a single sender
$adminReplyTo = config('notify.replyTo.admin')';
```

## Sending Notifications

You can send 4 different types of notifications using the client.

1. Single Email
2. Single SMS
3. Bulk Email
4. Bulk SMS

### Basic Usage

Before sending any of the above, you will need to import the facade. You can access methods statically, each method returns a `\Illuminate\Http\Client\Response`.

```php
<?php

  use App\Facades\Notify;
```

### Single Email

```php

/**
 * Send Email
 *
 * Send a single email with GC Notify
 *
 * @param string $to Email address to send message to
 * @param string $template ID of the template to use
 * @param array<mixed> $personalisation (optional) Array of key => value pairs to be replaced in template
 * @param string $reference (optional) Add a reference key to identify the message
 * @param string $replyTo (optional) ID for a reply to email address
 */
$response = Notify::sendEmail(
  'email@domain.com',
  $templateId,
  ['name' => 'First Last'],
  'EXAMPLE_EMAIL',
  $replyToId,
  [
    'file' => $file,
    'filename' => 'file.txt'
  ]
);
```

### Bulk Email

```php
/**
 * Send Bulk Email Notification
 *
 * Send bulk email with GC Notify
 *
 * @param string $name Used to identify this bulk of notifications later on.
 * @param array<mixed> $rows Array of arrays for messages to send
 * $rows = [
 *      [
 *          'email' => (string)  Email address of recipient
 *          'personalisation' => [
 *              'key' => (mixed) 'key' is replacement key, value is value to replace with
 *          ]
 *      ]
 * ]
 * @param string $template ID of the template to use
 * @param Carbon\Carbon $scheduleFor (optional)
 * @param string $replyTo (optional) ID for a reply to email address
 */
 $response = Notify::sendBulkEmail(
  'BULK_EMAIL',
  [
    [
      'email' => 'email+1@domain.com',
      'personalisation' => [
        'name' => 'Test User 1'
      ],
    ],
    [
      'email' => 'email+2@domain.com',
      'personalisation' => [
        'name' => 'Test User 2'
      ],
    ],
  ],
  $templateId,
  new Carbon\Carbon::now()->addDays(5),
  'replyto@email.com'
 );
```

## Single SMS

```php
/**
 * Send SMS
 *
 * Send a single SMS with GC Notify
 *
 * @param string $to Phone number to send message to
 * @param string $template ID of the template to use
 * @param array<mixed> $personalisation (optional) Array of key => value pairs to be replaced in template
 * @param string $reference (optional) Add a reference key to identify the message
 * @param string $sender (optional) ID for a sender number
 */
$response = Notify::sendSms(
  '+55555555555',
  $templateId,
  ['name' => 'First Last'],
  'EXAMPLE_SMS',
  $senderId
);
```

## Bulk SMS

```php
/**
 * Send Bulk SMS Notification
 *
 * Send bulk SMS with GC Notify
 *
 * @param string $name Used to identify this bulk of notifications later on.
 * @param array<mixed> $rows Array of arrays for messages to send
 *  $rows = [
 *      [
 *          'phone_number' => (string)  Phone number of recipient
 *          'personalisation' => [
 *              'key' => (mixed) 'key' is replacement key, value is value to replace with
 *          ]
 *      ]
 * ]
 * @param string $template ID of the template to use
 * @param Carbon\Carbon $scheduleFor (optional)
 * @param string $replyTo (optional) ID for a reply to email address
 */
$response = Notify::sendBulkSms(
  'BULK_SMS',
  [
    [
      'phone_number' => '+5555555555',
      'personalisation' => [
        'name' => 'Test User 1'
      ],
    ],
    [
      'phone_number' => '+4444444444',
      'personalisation' => [
        'name' => 'Test User 2'
      ],
    ],
  ],
  $templateId,
  new Carbon\Carbon::now()->addDays(5),
  'replyto@email.com'
 );
```
