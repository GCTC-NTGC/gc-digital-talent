<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Jose\Component\Core\JWK;
use Jose\Component\KeyManagement\JWKFactory;
use RuntimeException;

class GenerateLocalKey extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'key:generate-local {use : What the key is for (sign or encrypt)} {--force : Overwrite an existing key}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate an RSA signing or encryption key for this app. Intended for development use only.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $use = $this->argument('use');

        $keyTypes = [
            'sign' => [
                'label' => 'signing',
                'path' => config('keys.local.signing_key_path'),
                'values' => ['use' => 'sig', 'alg' => 'RS256'],
            ],
            'encrypt' => [
                'label' => 'encryption',
                'path' => config('keys.local.encryption_key_path'),
                'values' => ['use' => 'enc', 'alg' => 'RSA-OAEP-256'],
            ],
        ];

        if (! array_key_exists($use, $keyTypes)) {
            $this->error("Invalid use \"{$use}\". Expected one of: ".implode(', ', array_keys($keyTypes)).'.');

            return Command::INVALID;
        }

        ['label' => $label, 'path' => $path, 'values' => $values] = $keyTypes[$use];

        if (! is_dir(dirname($path))) {
            mkdir(dirname($path));
        }

        $jwk = JWKFactory::createRSAKey(2048, $values);
        $kid = $jwk->thumbprint('sha256');
        $jwk = new JWK([...$jwk->all(), 'kid' => $kid]);

        if (file_put_contents($path, json_encode($jwk)) === false) {
            throw new RuntimeException("Failed to write JWK to {$path}");
        }

        $this->info("Generated a new {$label} key with kid {$kid} at {$path}.");

        return Command::SUCCESS;
    }
}
