<?php

use Illuminate\Database\Migrations\Migration;
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
        Schema::table('pools', function (Blueprint $table) {
            $table->string('contact_email')->nullable();
        });

        DB::statement(<<<'SQL'
            UPDATE pools
            SET contact_email = 'recruitmentimit-recrutementgiti@tbs-sct.gc.ca'
            FROM communities
            WHERE pools.community_id = communities.id
            AND communities.key = 'digital'
        SQL);

        DB::statement(<<<'SQL'
            UPDATE pools
            SET contact_email = 'support-soutien@talent.canada.ca'
            FROM communities
            WHERE pools.community_id = communities.id
            AND communities.key != 'digital'
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn('contact_email');
        });
    }
};
