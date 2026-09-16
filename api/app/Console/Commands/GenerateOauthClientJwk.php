<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Jose\Component\Core\JWK;
use Jose\Component\KeyManagement\JWKFactory;
use RuntimeException;

class GenerateOauthClientJwk extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'oauth:generate-client-jwk {--force : Overwrite an existing key}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a throwaway RSA signing key for this app, for local development only';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        if (config('app.vertical') === 'production') {
            $this->error('Refusing to generate a throwaway signing key in production.');

            return Command::FAILURE;
        }

        $path = config('oauth.client_jwk_path');

        if (file_exists($path) && ! $this->option('force')) {
            $this->info("A key already exists at {$path}. Pass --force to overwrite it.");

            return Command::SUCCESS;
        }

        $jwk = JWKFactory::createRSAKey(2048, ['use' => 'sig', 'alg' => 'RS256']);
        $kid = $jwk->thumbprint('sha256');
        $jwk = new JWK([...$jwk->all(), 'kid' => $kid]);

        if (! is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        if (file_put_contents($path, json_encode($jwk)) === false) {
            throw new RuntimeException("Failed to write JWK to {$path}");
        }

        $this->info("Generated a new signing key with kid {$kid} at {$path}.");

        return Command::SUCCESS;
    }
}
