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
        Log::debug('Debug log message');
        Log::info('Info log message');
        Log::notice('Notice log message');
        Log::warning('Warning log message');
        Log::error('Error log message');
        Log::critical('Critical log message');
        Log::alert('Alert log message');
        Log::emergency('Emergency log message');

        $this->info('Logging complete!');

        return Command::SUCCESS;
    }
}
