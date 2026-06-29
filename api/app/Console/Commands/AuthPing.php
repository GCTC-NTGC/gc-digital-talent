<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
        $url = config('oauth.token_uri');
        // client credentials payload for OIDC token endpoint
        $data = [
            'grant_type' => 'client_credentials',
            'client_id' => config('oauth.client_id'),
            'client_secret' => config('oauth.client_secret'),
        ];

        $results = $this->pingTokenUri($url, $data);
        $avgTransferTime = $results->avg('transferTime');
        $maxTransferTime = $results->max('transferTime');
        $percentageSuccess = $results->percentage(fn ($r) => $r['success']);

        $this->info('Average transfer time: '.$avgTransferTime.' ms');
        $this->info('Max transfer time: '.$maxTransferTime.' ms');
        $this->info('Percentage success: '.$percentageSuccess.'%');

        Log::channel('jobs')->info('Auth ping complete',
            [
                'AvgTransferTime' => $avgTransferTime,
                'MaxTransferTime' => $maxTransferTime,
                'PercentageSuccess' => $percentageSuccess,
            ]);

        return Command::SUCCESS;
    }

    private function pingTokenUri($url, $data): Collection
    {
        $results = collect();
        for ($i = 0; $i < 10; $i++) {
            try {
                $response = Http::asForm()->post($url, $data);
                $transferStats = $response->transferStats;
                $results->push([
                    'transferTime' => $transferStats->getTransferTime() * 1000, // s -> ms
                    // success: 200 response with an access_token present
                    'success' => $response->successful() && ! is_null($response->json('access_token')),
                ]);
            } catch (\Throwable $_) {
                $results->push([
                    'transferTime' => null,
                    'success' => false,
                ]);
            }

        }

        return $results;
    }
}
