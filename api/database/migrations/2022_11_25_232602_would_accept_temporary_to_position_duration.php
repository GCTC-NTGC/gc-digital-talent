<?php

use App\Providers\PositionDuration;
use Database\Helpers\ApiEnums;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

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
            <<<'SQL'
            UPDATE users
                SET position_duration =
                    case would_accept_temporary
                        when true then :wouldAccept::jsonb
                        when false then :wouldNotAccept::jsonb
                        when null then null
                    end
        SQL, [
                'wouldAccept' => json_encode([PositionDuration::TEMPORARY->name, PositionDuration::PERMANENT->name]),
                'wouldNotAccept' => json_encode([PositionDuration::PERMANENT->name]),
            ]); // users always accept PERMANENT

        DB::statement(
            <<<'SQL'
            UPDATE applicant_filters
                SET position_duration =
                    case would_accept_temporary
                        when true then :wouldAccept::jsonb
                        when false then null
                        when null then null
                    end
        SQL, [
                'wouldAccept' => json_encode([PositionDuration::TEMPORARY->name]),
            ]); // filter does not always have PERMANENT, having both corresponds to accepting ANY, and there is no filtering for PERMANENT

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
            $table->boolean('would_accept_temporary')->nullable()->default(null);
        });
        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->boolean('would_accept_temporary')->nullable()->default(null);
        });

        DB::statement(
            <<<'SQL'
                UPDATE users
                    SET would_accept_temporary = true
                    WHERE position_duration ?? :duration
            SQL, [
                'duration' => PositionDuration::TEMPORARY->name,
            ]);

        DB::statement(
            <<<'SQL'
                UPDATE users
                    SET would_accept_temporary = false
                    WHERE ((position_duration ?? :duration) = false)
            SQL, [
                'duration' => PositionDuration::TEMPORARY->name,
            ]);
        // can't do a !?? operation
        // WHERE line is true when the ?? operation is false and position_duration is not NULL
        // all other cases stick to the default (NULL)

        DB::statement(
            <<<'SQL'
                UPDATE applicant_filters
                    SET would_accept_temporary = true
                    WHERE position_duration ?? :duration
            SQL, [
                'duration' => PositionDuration::TEMPORARY->name,
            ]);
        // filter is either looking for TEMPORARY or doing nothing, never both as that equals ANY
        // in which case no point assigning PERMANENT since filtering for it is not a current practice

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('position_duration');
        });
        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->dropColumn('position_duration');
        });
    }
}
