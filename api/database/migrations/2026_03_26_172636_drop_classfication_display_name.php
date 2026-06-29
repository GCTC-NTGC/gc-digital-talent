<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('classifications', function (Blueprint $table) {
            $table->dropColumn('display_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classifications', function (Blueprint $table) {
            $table->jsonb('display_name')->default(json_encode(['en' => '', 'fr' => '']));
        });
    }
};
