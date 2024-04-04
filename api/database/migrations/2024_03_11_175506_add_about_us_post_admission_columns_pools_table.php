<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::table('pools', function (Blueprint $table) {
            $table->jsonb('what_to_expect_admission')->nullable()->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('about_us')->nullable()->default(json_encode(['en' => '', 'fr' => '']));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn('what_to_expect_admission');
            $table->dropColumn('about_us');
        });
    }
};
