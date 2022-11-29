<?php

use Database\Helpers\ApiEnums;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class WouldAcceptTemporaryToPositionDuration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->jsonb('position_duration')->nullable()->default(null);
        });
        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->jsonb('position_duration')->nullable()->default(null);
        });

        DB::statement(
        <<<SQL
            UPDATE users
                SET position_duration =
                    case would_accept_temporary
                        when true then :wouldAccept::jsonb
                        when false then :wouldNotAccept::jsonb
                        when null then null
                    end
        SQL, [
            'wouldAccept' => json_encode([ApiEnums::POSITION_DURATION_TEMPORARY, ApiEnums::POSITION_DURATION_PERMANENT]),
            'wouldNotAccept' => json_encode([ApiEnums::POSITION_DURATION_PERMANENT]),
        ]);

        DB::statement(
        <<<SQL
            UPDATE applicant_filters
                SET position_duration =
                    case would_accept_temporary
                        when true then :wouldAccept::jsonb
                        when false then :wouldNotAccept::jsonb
                        when null then null
                    end
        SQL, [
            'wouldAccept' => json_encode([ApiEnums::POSITION_DURATION_TEMPORARY, ApiEnums::POSITION_DURATION_PERMANENT]),
            'wouldNotAccept' => json_encode([ApiEnums::POSITION_DURATION_PERMANENT]),
        ]);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('would_accept_temporary');
        });
        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->dropColumn('would_accept_temporary');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('position_duration');
        });
        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->dropColumn('position_duration');
        });
    }
}
