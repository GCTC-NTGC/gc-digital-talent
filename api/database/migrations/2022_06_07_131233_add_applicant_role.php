<?php

use Database\Helpers\ApiEnums;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddApplicantRole extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // turn any nulls to empty array
        DB::statement(<<<SQL
            update users
            set roles = '[]'::jsonb
            where roles is null
        SQL);

        // add APPLICANT role to any rows that are missing it
        DB::statement(<<<SQL
            UPDATE users
            SET roles = roles || :new_role::jsonb
            WHERE not roles ?? :new_role
        SQL, ['new_role' => json_encode([ApiEnums::ROLE_APPLICANT])]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // remove APPLICANT role from any rows that contain it
        DB::statement(<<<SQL
            UPDATE users
            SET roles = roles - :new_role
            WHERE roles ?? :new_role
        SQL, ['new_role' => ApiEnums::ROLE_APPLICANT]);

        // turn empty array to null
        DB::statement(<<<SQL
            update users
            set roles = null
            where roles = '[]'::jsonb
        SQL);
    }
}
