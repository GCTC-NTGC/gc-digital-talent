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
        // add new columns for late changes
        Schema::table('digital_contracting_questionnaires', function (Blueprint $table) {
            $table->string('contract_ftes')->nullable();
            $table->string('instrument_type_other')->nullable();
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
        });
    }
};
