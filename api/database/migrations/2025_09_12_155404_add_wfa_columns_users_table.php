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
            $table->string('wfa_interest')->nullable();
            $table->dateTime('wfa_date')->nullable();
            $table->dateTime('wfa_updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('wfa_interest');
            $table->dropColumn('wfa_date');
            $table->dropColumn('wfa_updated_at');
        });
    }
};
