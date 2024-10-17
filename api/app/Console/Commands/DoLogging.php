<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DoLogging extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'do-logging';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Do some file logging';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $onDemandLog = Log::build([
            'driver' => 'single',
            'path' => '/home/LogFiles/command.log',
        ]);
        $onDemandLog->error('Command ran - error');
        $onDemandLog->warning('Command ran - warning');
    }
}
