<?php

namespace App\Providers;

use App\Rules\LocalizedString;
use Illuminate\Support\Facades\Validator as ValidatorFacade;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Validator;

class ValidationRulesServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        ValidatorFacade::extend('localized_string', function (string $attribute, mixed $value, array $parameters, Validator $validator): bool {
            $failed = false;

            (new LocalizedString())->validate($attribute, $value, function () use (&$failed): void {
                $failed = true;
            });

            return ! $failed;
        }, 'The :attribute field must be a localized string with en and fr string values.');
    }
}
