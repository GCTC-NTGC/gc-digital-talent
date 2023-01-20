<?php

namespace App\Notify;

use Illuminate\Support\Facades\Http;
use App\Exceptions\ApiKeyNotFoundException;
use App\Exceptions\EmailAttachmentException;
use App\Exceptions\NotFutureDateException;

/**
 * GC Notify Client
 *
 * Interacts with the GC Notify API
 *
 * @property string $apiKey API Key for auth
 */
class Client
{
    /**
     * API Key
     *
     * @property string $apiKey API Key for auth
     * @access  private
     */
    private $apiKey;

    /**
     * Base URL
     *
     * @const string GC Notify Base URL
     */
    const BASE_URL = "https://api.notification.canada.ca";

    /**
     * Endpoints
     *
     * @const string    Paths for API Endpoints
     */
    const ENDPOINT_NOTIFICATION_EMAIL = "/v2/notifications/email";
    const ENDPOINT_NOTIFICATION_SMS = "/v2/notifications/sms";
    const ENDPOINT_NOTIFICATION_BULK = "/v2/notifications/bulk";

    /**
     * Instantiate the class
     */
    public function __construct()
    {
        $config = config('notify.client');

        if (!$config['apiKey']) {
            throw new ApiKeyNotFoundException("GC Notify API key not found in config.");
        }

        $this->apiKey = $config['apiKey'];
    }

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
    public function sendEmail($to, $template, $personalisation = [], $reference = null, $replyTo = null, $attachment = null)
    {
        return $this->post(
            self::ENDPOINT_NOTIFICATION_EMAIL,
            $this->buildEmailPayload($to, $template, $personalisation, $reference, $replyTo, $attachment)
        );
    }

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
    public function sendSms($to, $template, $personalisation = [], $reference = null, $sender = null)
    {
        return $this->post(
            self::ENDPOINT_NOTIFICATION_SMS,
            $this->buildSmsPayload($to, $template, $personalisation, $reference, $sender)
        );
    }

    /**
     * Send Bulk Notification
     *
     * Send bulk SMS or Email with GC Notify
     *
     * @param string $name Used to identify this bulk of notifications later on.
     * @param array<mixed> $rows Array of arrays for messages to send
     * where first row is the headers. Header row first index indicates
     * whether to send an SMS (phone number) or Email (email address)
     * any following indices should match personalisation template tags
     * @param string $template ID of the template to use
     * @param Carbon\Carbon $scheduleFor (optional)
     * @param string $replyTo (optional) ID for a reply to email address
     */
    public function sendBulk($name, $rows, $template, $scheduleFor = null, $replyTo = null)
    {
        return $this->post(
            self::ENDPOINT_NOTIFICATION_BULK,
            $this->buildBulkPayload($name, $rows, $template, $scheduleFor, $replyTo)
        );
    }

    /**
     *  Build Payload
     *
     * Creates the payload for a request
     *
     * @access private
     * @param string $type  The type of payload to build
     * @param string $to The recipient of the notification
     * @param string $template Template of the notification
     * @param array<mixed> $personalisation (optional) Array of key => value pairs to be replaced in template
     * @param string $reference (optional) Add a reference key to identify the message
     * @return array<mixed> The partial payload
     */
    private function buildPayload($type, $to, $template, $personalisation = [], $reference = null)
    {
        $payload = ['template_id' => $template];

        if($type === "email") {
            $payload['email_address'] = $to;
        } else if($type === "sms") {
            $payload['phone_number'] = $to;
        }

        if(count($personalisation)) {
            $payload['personalisation'] = $personalisation;
        }

        if(!is_null($reference) && $reference !== '') {
            $payload['reference'] = $reference;
        }

        return $payload;
    }

    /**
     * Build Email Payload
     *
     * @param string $to Email address to send message to
     * @param string $template ID of the template to use
     * @param array<mixed> $personalisation (optional) Array of key => value pairs to be replaced in template
     * @param string $reference (optional) Add a reference key to identify the message
     * @param string $replyTo (optional) ID for a reply to email address
     * @param array<mixed> $attachment (optional) Array of key => value pairs to be replaced in template
     */
    private function buildEmailPayload($to, $template, $personalisation = [], $reference = null, $replyTo = null, $attachment = null)
    {

        $payload = $this->buildPayload('email', $to, $template, $personalisation, $reference);

        if(!is_null($replyTo) && $replyTo !== '') {
            $payload['email_reply_to_id'] = $replyTo;
        }

        if(!is_null($attachment)) {
            $payload['personalisation']['attachment'] = $this->buildEmailAttachmentFile($attachment);
        }

        return $payload;
    }

    /**
     * Build SMS Payload
     *
     * @param string $to Phone number to send message to
     * @param string $template ID of the template to use
     * @param array<mixed> $personalisation (optional) Array of key => value pairs to be replaced in template
     * @param string $reference (optional) Add a reference key to identify the message
     * @param string $sender (optional) ID for a sender number
     */
    private function buildSmsPayload($to, $template, $personalisation = [], $reference = null, $sender = null)
    {
        $payload = $this->buildPayload('sms', $to, $template, $personalisation, $reference);

        if(!is_null($sender) && $sender !== '') {
            $payload['sms_sender_id'] = $sender;
        }

        return $payload;
    }

    /**
     * Build Bulk Payload
     *
     * @param string $name Used to identify this bulk of notifications later on.
     * @param array<string> $rows The recipient of the notification
     * @param string $template Template of the notification
     * @param Carbon\Carbon $scheduleFor (optional)
     * @param string $replyTo (optional) ID for a reply to email address
     * @return array<mixed> The partial payload
     */
    private function buildBulkPayload($name, $rows, $template, $scheduleFor = null, $replyTo = null)
    {
        $payload = [
            'template_id' => $template,
            'name' => $name,
            'rows' => $rows,
        ];

        if(!is_null($scheduleFor)) {
            if(!$scheduleFor->isFuture()) {
                throw new NotFutureDateException("Schedule for date must be a date in the future.");
            }
            $payload['schedule_for'] = $scheduleFor->toIso8601String();
        }

        if(!is_null($replyTo) && $replyTo !== '') {
            $payload['reply_to_id'] = $replyTo;
        }

        return $payload;
    }

    /**
     * Build Headers
     *
     * Build headers for the request including
     * the authorization and content types by default
     *
     * @param array<mixed> $additionalHeaders (optional) Additional headers to add
     * @return array<mixed>
     */
    private function buildHeaders($additionalHeaders = [])
    {
        $headers = [
            'Authorization' => 'ApiKey-v1 ' . $this->apiKey,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ];

        if(count($additionalHeaders)) {
            $headers = array_merge($headers, $additionalHeaders);
        }

        return $headers;
    }

    /**
     * Build Email Attachment
     *
     * Add an attachment file to an email payload
     *
     * @param array<mixed> $attachment The attachment file array [file => string, filename => string]
     * @return array<mixed> The new payload
     */
    private function buildEmailAttachmentFile($attachment)
    {
        if(!isset($attachment['filename']) || !isset($attachment['file'])) {
            throw new EmailAttachmentException("Missing attachment filename or file.");
        }

        if(base64_decode($attachment['file'], true) === false) {
            throw new EmailAttachmentException("Attachment file must be base64 encoded");
        }

        $attachment['sending_method'] = 'attach';

        return $attachment;
    }

    /**
     * POST
     *
     * Make a POST request to the GC Notify API
     *
     * @access private
     * @param string $endpoint URL to make request to
     * @param array<mixed> $payload Parameters passed to request
     * @param array<mixed> $headers (optional) Headers to add to request
     * @throws
     * @return  \Illuminate\Http\Client\Response,
     */
    private function post($endpoint, $payload, $headers = [])
    {
        return Http::withHeaders($this->buildHeaders($headers))
            ->post(self::BASE_URL . $endpoint, $payload);
    }

    /**
     * GET
     *
     * Make a GET request to the GC Notify API
     *
     * @access private
     * @param string $endpoint URL to make request to
     * @param array<mixed> $payload Parameters passed to request
     * @param array<mixed> $headers (optional) Headers to add to request
     * @throws
     * @return  \Illuminate\Http\Client\Response,
     */
    private function get($endpoint, $payload, $headers = [])
    {
        return Http::withHeaders($this->buildHeaders($headers))
            ->get(self::BASE_URL . $endpoint, $payload);
    }
}
