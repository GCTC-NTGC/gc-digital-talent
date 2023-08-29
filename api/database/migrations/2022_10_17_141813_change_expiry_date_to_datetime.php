<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class ChangeExpiryDateToDatetime extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            ALTER TABLE pools
            ALTER COLUMN expiry_date TYPE timestamp(0)
            USING (expiry_date at time zone 'UTC')
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('
            ALTER TABLE pools
            ALTER COLUMN expiry_date TYPE timestamptz(0)
        ');
    }
}
