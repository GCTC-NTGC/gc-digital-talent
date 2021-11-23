<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\JwksService;
use App\Services\Contracts\KeySetInterface;

class KeySetServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        $this->app->bind(KeySetInterface::class, JwksService::class);
    }
}
