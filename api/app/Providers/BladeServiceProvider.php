<?php

namespace App\Providers;

use App\Support\BladeHelpers;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class BladeServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Check for localized fields existence in blade
        Blade::if('localized', BladeHelpers::hasLocalized(...));

        // Handle localized strings in blade templates
        Blade::stringable('iterable', BladeHelpers::renderLocalized(...));

        // Echo the localized label of an enum value in blade
        Blade::directive('enum', fn (string $expression) => "<?php echo \App\Support\BladeHelpers::renderEnum($expression); ?>");
    }
}
