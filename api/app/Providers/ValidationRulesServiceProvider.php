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

            (new LocalizedString())->validate($attribute, $value, function (string $message) use (&$failed): void {
                $failed = true;
            });

            if ($failed || ! is_array($value) || $parameters === []) {
                return ! $failed;
            }

            $localizedValidator = ValidatorFacade::make([
                'en' => $value['en'] ?? null,
                'fr' => $value['fr'] ?? null,
            ], [
                'en' => $parameters,
                'fr' => $parameters,
            ]);

            if ($localizedValidator->fails()) {
                return false;
            }

            return ! $failed;
        }, 'The :attribute field must be a localized string with en and fr string values.');
    }
}
