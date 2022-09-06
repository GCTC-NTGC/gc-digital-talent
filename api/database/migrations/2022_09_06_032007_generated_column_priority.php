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
        DB::statement("ALTER TABLE users ADD COLUMN priority_status VARCHAR(50)
        GENERATED ALWAYS AS
        (case
        when has_priority_entitlement = TRUE then 'PRIORITY'
        when armed_forces_status = 'VETERAN' then 'VETERAN'
        when citizenship = 'CITIZEN' OR citizenship = 'PERMANENT_RESIDENT' then 'CITIZEN_OR_PR'
        else 'OTHER'
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
