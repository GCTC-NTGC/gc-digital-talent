<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('talent_nomination_events', function (Blueprint $table) {
            $table->string('contact_email')->nullable(true);
        });

        // one-time backfill of existing rows
        DB::table('talent_nomination_events')->update(['contact_email' => 'support-soutien@talent.canada.ca']);

        Schema::table('talent_nomination_events', function (Blueprint $table) {
            $table->string('contact_email')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('talent_nomination_events', function (Blueprint $table) {
            $table->dropColumn('contact_email');
        });
    }
};
