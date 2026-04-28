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
        Schema::table('community_interests', function (Blueprint $table) {
            $table->renameColumn('finance_additional_duties', 'additional_duties')->change();
            $table->boolean('procurement_is_sdo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('community_interests', function (Blueprint $table) {
            $table->renameColumn('additional_duties', 'finance_additional_duties')->change();
            $table->dropColumn('procurement_is_sdo');
        });
    }
};
