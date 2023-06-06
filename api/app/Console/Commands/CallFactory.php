<?php

namespace App\Console\Commands;

use Exception;
use Illuminate\Console\Command;

class CallFactory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:call-factory
                            {class : The factory class to call}
                            {--state=* : The factory state(s) to use}
                            {--attributes= : Override attributes to pass to the factory (JSON object)}
                            ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calls an Eloquent factory to instantiate a model directly';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $result = null;

        $qualifiedClassName = 'App\\Models\\' . $this->argument("class");
        if (!class_exists($qualifiedClassName)) {
            throw new Exception("The model class does not exist.");
        }
        if (!method_exists($qualifiedClassName, "factory")) {
            throw new Exception("The model class does not have a factory method.");
        }

        $jsonAttributes = $this->option('attributes');
        if (!empty($jsonAttributes)) {
            $attributes = json_decode($jsonAttributes, true);
        } else {
            $attributes = null;
        }

        $factory = $qualifiedClassName::factory();
        $states = $this->option('state');
        // apply each state function to the factory (if any)
        foreach ($states as $state) {
            $factory = $factory->$state();
        }
        $result = $factory->create($attributes);
        $this->line($result?->toJson());
    }
}
