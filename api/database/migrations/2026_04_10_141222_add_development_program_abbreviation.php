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
        Schema::table('development_programs', function (Blueprint $table) {
            $table->jsonb('abbreviation')->default(json_encode(['en' => '', 'fr' => '']));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('development_programs', function (Blueprint $table) {
            $table->dropColumn('abbreviation');
        });
    }
};
