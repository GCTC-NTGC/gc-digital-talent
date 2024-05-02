<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class LogFlagsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:log-flags';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Log the status of the feature flags.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('LogFlagsCommand running at '.Carbon::now()->toDateTimeString());

        $keys = ['feature.status_notifications', 'feature.directive_forms', 'feature.notifications', 'notify.client.apiKey', 'notify.templates.application_deadline_approaching_en', 'notify.templates.application_deadline_approaching_fr'];

        foreach ($keys as $key) {
            $this->info($key.' is ['.config($key).'].');
        }
    }
}
