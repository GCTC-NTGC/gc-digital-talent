<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TestLogging extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-logging';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test logging outputs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $log = Log::channel('scheduledJobs');

        $log->debug('Debug log message');
        $log->info('Info log message');
        $log->notice('Notice log message');
        $log->warning('Warning log message');
        $log->error('Error log message');
        $log->critical('Critical log message');
        $log->alert('Alert log message');
        $log->emergency('Emergency log message');

        $this->info('Logging complete!');

        return Command::SUCCESS;
    }
}
