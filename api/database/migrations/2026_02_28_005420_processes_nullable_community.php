<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->uuid('community_id')->nullable(true)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // in case a reversal needed, must ensure communities populated
        // can't really determine a best fit community, let our favorite community adopt them
        $dcmObject = DB::table('communities')
            ->where('key', 'digital')
            ->sole('id');
        DB::table('pools')
            ->whereNull('community_id')
            ->update(['community_id' => $dcmObject->id]);

        Schema::table('pools', function (Blueprint $table) {
            $table->uuid('community_id')->nullable(false)->change();
        });
    }
};
