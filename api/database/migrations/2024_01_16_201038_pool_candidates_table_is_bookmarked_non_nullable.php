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
        DB::table('pool_candidates')->whereNull('is_bookmarked')->update(['is_bookmarked' => false]);
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->boolean('is_bookmarked')->nullable(false)->default(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->boolean('is_bookmarked')->nullable()->default(null)->change();
        });
    }
};
