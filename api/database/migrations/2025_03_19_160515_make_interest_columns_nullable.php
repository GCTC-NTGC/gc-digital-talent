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
        Schema::table('community_interests', function (Blueprint $table) {
            $table->jsonb('finance_additional_duties')->nullable(true)->change();
            $table->jsonb('finance_other_roles')->nullable(true)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('community_interests', function (Blueprint $table) {
            $table->jsonb('finance_additional_duties')->default(json_encode([]))->nullable(false)->change();
            $table->jsonb('finance_other_roles')->default(json_encode([]))->nullable(false)->change();
        });
    }
};
