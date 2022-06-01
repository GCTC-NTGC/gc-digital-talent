<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class MakeEmailNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // make email nullable
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
        });

        // set null for any emails that were stuffed with ID
        DB::statement(" update users
                        set email = null
                        where email = id::text");

        // make sub nullable
        Schema::table('users', function (Blueprint $table) {
            $table->string('sub')->nullable()->change();
        });

        // set null for any subs that were stuffed with ID
        DB::statement(" update users
                        set sub = null
                        where sub = id::text");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // stuff null emails with ID before making column non-nullable
        DB::statement(" update users
                        set email = id
                        where email is null");

        // make email non-nullable
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
        });

        // stuff null subs with ID before making column non-nullable
        DB::statement(" update users
                        set sub = id
                        where sub is null");

        // make sub non-nullable
        Schema::table('users', function (Blueprint $table) {
            $table->string('sub')->nullable(false)->change();
        });
    }
}
