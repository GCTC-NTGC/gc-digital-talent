<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UpdateUsersTableWithSub extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // The sub string should be non-nullable, but because this migration may run after
        // users already exist, they sub column must be allowed to start as null.
        Schema::table('users', function (Blueprint $table) {
            $table->string('sub')->nullable(true);
        });
        // After creating the sub column, we can set it on existing users to match email.
        DB::statement('UPDATE users SET sub = email');
        // After sub is set to email, we can disallow it being null in the future.
        Schema::table('users', function (Blueprint $table) {
            $table->string('sub')->nullable(false)->change();
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
            $table->dropColumn('sub');
        });
    }
}
