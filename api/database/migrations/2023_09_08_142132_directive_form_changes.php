<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // add new columns for late changes
        Schema::table('digital_contracting_questionnaires', function (Blueprint $table) {
            $table->string('contract_ftes')->nullable();
            $table->string('instrument_type_other')->nullable();
            $table->dropColumn('is_technological_change');
            $table->jsonb('technological_change_factors')->default(new Expression('\'[]\'::jsonb'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // remove the new columns
        Schema::table('digital_contracting_questionnaires', function (Blueprint $table) {
            $table->dropColumn('contract_ftes');
            $table->dropColumn('instrument_type_other');
            $table->string('is_technological_change')->nullable();
            $table->dropColumn('technological_change_factors');
        });
    }
};
