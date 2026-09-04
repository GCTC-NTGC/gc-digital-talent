<?php

namespace Tests\Unit;

use App\Listeners\LogArtisanCommand;
use Illuminate\Console\Events\CommandFinished;
use Illuminate\Console\Events\CommandStarting;
use Illuminate\Support\Facades\Log;
use Mockery;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\NullOutput;
use Tests\TestCase;

class LogArtisanCommandTest extends TestCase
{
    public function testLogsToCliChannelExplicitly(): void
    {
        $input = new ArgvInput(['artisan', 'migrate', '--force']);
        $output = new NullOutput();

        Log::shouldReceive('channel')->with('cli')->andReturnSelf();
        Log::shouldReceive('info')->once()->with('Artisan command starting', [
            'command' => 'migrate',
            'arguments' => (string) $input,
        ]);
        Log::shouldReceive('info')->once()->with('Artisan command finished', Mockery::on(function ($context) {
            return $context['command'] === 'migrate'
                && $context['exitCode'] === 0
                && is_int($context['durationMs'])
                && $context['durationMs'] >= 0;
        }));

        $listener = new LogArtisanCommand();
        $listener->started(new CommandStarting('migrate', $input, $output));
        $listener->finished(new CommandFinished('migrate', $input, $output, 0));
    }

    public function testFinishedWithoutStartingStillLogsWithNullDuration(): void
    {
        $input = new ArgvInput(['artisan', 'migrate']);
        $output = new NullOutput();

        Log::shouldReceive('channel')->with('cli')->andReturnSelf();
        Log::shouldReceive('info')->once()->with('Artisan command finished', Mockery::on(function ($context) {
            return $context['durationMs'] === null;
        }));

        $listener = new LogArtisanCommand();
        $listener->finished(new CommandFinished('migrate', $input, $output, 0));
    }
}
