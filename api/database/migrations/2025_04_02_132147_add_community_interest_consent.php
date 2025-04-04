<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // create new column
        Schema::table('community_interests', function (Blueprint $table) {
            $table->boolean('consent_to_share_profile')->nullable()->default(false);
        });

        // fill column for existing rows
        DB::table('community_interests')
            ->update(['consent_to_share_profile' => new Expression('case when job_interest = true or training_interest = true then true else false end')]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('community_interests', function (Blueprint $table) {
            $table->dropColumn('consent_to_share_profile');
        });
    }
};
