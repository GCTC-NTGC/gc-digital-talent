<?php

declare(strict_types=1);

namespace App\Logging;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Monolog\LogRecord;
use Monolog\Processor\ProcessorInterface;

/**
 * Injects fields required by the TBS logging standard
 */
class TbsLoggingStandardProcessor implements ProcessorInterface
{
    /**
     * {@inheritDoc}
     */
    public function __invoke(LogRecord $record): LogRecord
    {
        $record->extra['ApplicationID'] = config('app.url');
        $record->extra['SourceIP'] = Request::ip();
        $record->extra['XForwardedIP'] = Request::header('X-Forwarded-For');
        $record->extra['CorrelationID'] = Request::cookie('ai_session');
        $record->extra['SourceUserID'] = Auth::user()?->getAuthIdentifier();

        return $record;
    }
}
