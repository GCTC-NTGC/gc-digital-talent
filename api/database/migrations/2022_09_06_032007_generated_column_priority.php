<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class GeneratedColumnPriority extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("ALTER TABLE users ADD COLUMN priority_status INT
        GENERATED ALWAYS AS
        (case
        when has_priority_entitlement = TRUE then 1
        when armed_forces_status = 'VETERAN' then 2
        when citizenship = 'CITIZEN' OR citizenship = 'PERMANENT_RESIDENT' then 3
        else 4
        end)
        STORED;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'priority_status',
            ]);
        });
    }
}
