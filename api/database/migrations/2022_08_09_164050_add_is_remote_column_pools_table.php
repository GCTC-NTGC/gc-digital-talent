<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsRemoteColumnPoolsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->boolean('is_remote')->default(false)->after('advertisement_location');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn('is_remote');
        });
    }
}
