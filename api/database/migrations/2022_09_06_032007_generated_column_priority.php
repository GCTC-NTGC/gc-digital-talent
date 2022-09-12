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
        DB::statement("ALTER TABLE users ADD COLUMN priority_weight INT
        GENERATED ALWAYS AS
        (case
        when has_priority_entitlement = TRUE then 10
        when armed_forces_status = 'VETERAN' then 20
        when citizenship = 'CITIZEN' OR citizenship = 'PERMANENT_RESIDENT' then 30
        else 40
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
                'priority_weight',
            ]);
        });
    }
}
