<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    public function up(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->string('placement_type')->nullable()->default(null)->change();
        });
    }

    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->string('placement_type')->nullable()->default('NOT_PLACED')->change();
        });
    }
};
