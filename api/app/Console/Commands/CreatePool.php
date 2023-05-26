<?php

namespace App\Console\Commands;

use App\Models\Pool;
use Illuminate\Console\Command;

class CreatePool extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-pool {--state=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new pool';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $state = $this->option('state');
        if (empty($state)) {
            Pool::factory()
                ->create();
        } else {
            Pool::factory()
                ->$state()
                ->create();
        }
    }
}
