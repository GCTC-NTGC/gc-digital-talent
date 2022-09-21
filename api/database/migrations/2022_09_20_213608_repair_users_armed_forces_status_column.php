<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The armed_forces_status column used to be a boolean column called "is_veteran".
 * When it was renamed and converted to a string, non-null values were converted to the
 * literal strings "true" and "false", instead of the expected ArmedForcesStatus enums.
 */
class RepairUsersArmedForcesStatusColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            update users
                set armed_forces_status =
                    case armed_forces_status
                        when 'true' then 'VETERAN'
                        when 'false' then 'NON_CAF'
                        else armed_forces_status
                    end
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // This migration isn't safely reversible.
    }
}
