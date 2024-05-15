<?php

use App\Console\Commands\RemoveOperationalRequirement;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Artisan::call(RemoveOperationalRequirement::class, ['operationalRequirement' => 'OVERTIME_SCHEDULED']);
        Artisan::call(RemoveOperationalRequirement::class, ['operationalRequirement' => 'OVERTIME_SHORT_NOTICE']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // this migration is not reversible.
    }
};
