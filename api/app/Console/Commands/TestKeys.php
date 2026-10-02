<?php

namespace App\Console\Commands;

use App\Contracts\KeyService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:test-keys')]
#[Description('Test the key service.')]
class TestKeys extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(KeyService $keyService)
    {
        $this->info($keyService->getKeys() ?? 'No keys found.');

        return Command::SUCCESS;

    }
}
