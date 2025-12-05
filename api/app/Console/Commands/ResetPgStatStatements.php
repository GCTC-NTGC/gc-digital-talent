<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetPgStatStatements extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:reset-pg-stat-statements';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset the cumulative pg_stat_statements view.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::statement('select pg_stat_statements_reset();');

        return Command::SUCCESS;
    }
}
