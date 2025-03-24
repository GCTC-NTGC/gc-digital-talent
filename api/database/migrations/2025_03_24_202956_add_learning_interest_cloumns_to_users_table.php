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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('interchange_opportunities_interest')->nullable();
            $table->boolean('academic_program_interest')->nullable();
            $table->boolean('peer_networking_interest')->nullable();
            $table->boolean('professional_accreditation_interest')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
             $table->dropColumn('interchange_opportunities_interest');
            $table->dropColumn('academic_program_interest');
            $table->dropColumn('peer_networking_interest');
            $table->dropColumn('professional_accreditation_interest');
        });
    }
};
