<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUsersTableWithEeInfo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::update('users', function (Blueprint $table) {
            $table->string('telephone')->nullable();
            $table->string('preferred_lang')->nullable();
            $table->string('gender')->nullable();
            $table->boolean('has_disability')->default(false);
            $table->boolean('is_indigenous')->default(false);
            $table->boolean('is_visible_minority')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::update('users', function (Blueprint $table) {
            $table->dropColumn('telephone')->nullable();
            $table->dropColumn('preferred_lang');
            $table->dropColumn('gender');
            $table->dropColumn('has_disability');
            $table->dropColumn('is_indigenous');
            $table->dropColumn('is_visible_minority');
        });
    }
}
