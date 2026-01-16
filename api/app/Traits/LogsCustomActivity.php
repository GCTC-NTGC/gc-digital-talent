<?php

namespace App\Traits;

use App\Enums\ActivityEvent;
use App\Enums\ActivityLog;
use Closure;
use Illuminate\Support\Facades\Auth;

/**
 * Provides methods for logging model activity events with customizable log names.
 *
 * @property-read string|null $customLogName Default log name for the model
 */
trait LogsCustomActivity
{
    /**
     * The log name to be used for the next activity log, set via logName().
     */
    private ?string $nextLogName = null;

    /**
     * Flag for suppressing logging the next update.
     */
    protected bool $disableNextLogEvent = false;

    /**
     * Set a custom log name for the next call to logActivity().
     * Enables method chaining.
     *
     * @param  string  $logName  The log name to use for the next activity log
     * @return static
     */
    public function logName(string $logName): self
    {
        $this->nextLogName = $logName;

        return $this;
    }

    /**
     * Call this to skip the log on the next update/save.
     *
     * @return $this
     */
    public function disableCustomLogging(Closure $callback)
    {
        $original = $this->disableNextLogEvent;
        $this->disableNextLogEvent = true;

        try {
            return $callback($this);
        } finally {
            // Always restore the original value, even if exception occurs.
            $this->disableNextLogEvent = $original;
        }
    }

    /**
     * Allows a model to customize activity properties before logging.
     * Models can override this to add custom data, e.g. user name.
     *
     * @param  array  $properties  Properties to log (by reference)
     * @param  \App\Enums\ActivityEvent  $event  The event type
     */
    protected function customizeActivityProperties(array &$properties, ActivityEvent $event): void
    {
        // Default: do nothing. Model can override.
    }

    /**
     * Log a model activity event.
     *
     * @param  \App\Enums\ActivityEvent  $event  The activity event to record
     * @param  array|null  $atts  Attribute changes (optional)
     * @param  array|null  $old  Old attributes prior to change (optional)
     */
    public function logActivity(ActivityEvent $event, ?array $atts = [], ?array $old = []): void
    {
        if ($this->disableNextLogEvent) {
            $this->disableNextLogEvent = false;

            return;
        }

        $properties = [];
        if (! empty($atts)) {
            $properties['attributes'] = $atts;
        }

        if (! empty($old)) {
            $properties['old'] = $old;
        }

        $this->customizeActivityProperties($properties, $event);

        /** @var string|null $logName */
        $logName = $this->nextLogName ?? $this->customLogName ?? ActivityLog::DEFAULT->name;

        activity($logName)
            ->causedBy(Auth::user())
            ->performedOn($this)
            ->event($event->value)
            ->withProperties($properties)
            ->log($event->value);

        // Reset temporary override
        $this->nextLogName = null;
    }
}
