<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UpdatePoolsTableWithKeyColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Initially allow key to be nullable, so it can be initialized to match the en name.
        Schema::table('pools', function (Blueprint $table) {
            $table->string('key')->nullable(true)->unique();
        });
        DB::statement("UPDATE pools SET key = name->>'en'");
        // After initializing keys, make them not nullable.
        Schema::table('pools', function (Blueprint $table) {
            $table->string('key')->nullable(false)->change();
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
            $table->dropColumn('key');
        });
    }
}
