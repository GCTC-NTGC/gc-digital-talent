<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;

class AuthPing extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auth:ping';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ping the auth server';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $successCount = 0;
        $failureCount = 0;

        $url = config('oauth.token_uri');
        $data = [
            'grant_type' => 'authorization_code',
            'client_id' => config('oauth.client_id'),
            'client_secret' => config('oauth.client_secret'),
            'redirect_uri' => config('oauth.redirect_uri'),
            'code' => '1', // not a real code, of course
        ];

        $results = $this->pingTokenUri($url, $data);
        $this->info('Average transfer time: '.$results->avg('transferTime').' ms');
        $this->info('Max transfer time: '.$results->max('transferTime').' ms');
        $this->info('Percent success: '.$results->percentage(fn ($r) => $r['success']).'%');

        return Command::SUCCESS;
    }

    private function pingTokenUri($url, $data): Collection
    {
        $results = collect();
        for ($i = 0; $i < 10; $i++) {
            $response = Http::asForm()->post($url, $data);

            $transferStats = $response->transferStats;

            $transferTime = $transferStats->getTransferTime() * 1000; // s->ms

            $this->info('Transfer time: '.$transferTime.' ms');
            $this->info('Status: '.$response->status());
            $this->info('Error message: '.$response->json('error'));
            $results->push([
                'transferTime' => $transferTime,
                'success' => $response->status() == 400 && $response->json('error') == 'invalid_grant',
            ]);
        }

        return $results;
    }
}
