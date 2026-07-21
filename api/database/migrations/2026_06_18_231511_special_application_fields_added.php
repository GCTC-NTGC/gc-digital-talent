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
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->string('special_application_type')->nullable();
            $table->text('special_application_justification')->nullable();
            $table->dateTime('special_application_closing_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('special_application_type');
            $table->dropColumn('special_application_justification');
            $table->dropColumn('special_application_closing_date');
        });
    }
};
