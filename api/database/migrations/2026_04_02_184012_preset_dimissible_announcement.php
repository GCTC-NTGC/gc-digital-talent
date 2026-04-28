<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('settings')
            ->where('key', 'sitewide_announcement')
            ->update([
                'value->updatedAt' => Carbon::now()->toDateTimeString(),
            ]);

        DB::table('settings')
            ->where('key', 'sitewide_announcement')
            ->update([
                'value->isDismissible' => false,
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')
            ->where('key', 'sitewide_announcement')
            ->update(['value' => DB::raw("value - 'updatedAt'")]);

        DB::table('settings')
            ->where('key', 'sitewide_announcement')
            ->update(['value' => DB::raw("value - 'isDismissible'")]);
    }
};
