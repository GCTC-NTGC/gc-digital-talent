<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeIsVeteranField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('is_veteran', 'armed_forces_status');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->string('armed_forces_status')->nullable()->change();
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
            $table->renameColumn('armed_forces_status', 'is_veteran');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_veteran')->nullable()->change();
        });
    }
}
