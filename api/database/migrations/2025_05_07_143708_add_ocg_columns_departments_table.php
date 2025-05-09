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
        Schema::table('departments', function (Blueprint $table) {
            $table->integer('org_identifier')->nullable();
            $table->string('size')->nullable();
            $table->boolean('is_core_public_administration')->default(false);
            $table->boolean('is_central_agency')->default(false);
            $table->boolean('is_science')->default(false);
            $table->boolean('is_regulatory')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn('org_identifier');
            $table->dropColumn('size');
            $table->dropColumn('is_core_public_administration');
            $table->dropColumn('is_central_agency');
            $table->dropColumn('is_science');
            $table->dropColumn('is_regulatory');
        });
    }
};
