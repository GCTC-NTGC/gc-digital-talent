<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \Illuminate\Http\Client\Response sendEmail(string $to, string $template, array<mixed>$personalisation = [], string $reference = null, string $replyTo = null, array<mixed> $attachment = null)
 *
 * @see App\Notify\Client
 */
class Notify extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'notify';
    }
}
