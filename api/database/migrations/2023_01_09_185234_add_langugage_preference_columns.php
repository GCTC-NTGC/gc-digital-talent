<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLangugagePreferenceColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('preferred_language_for_interview')->nullable()->default(null);
            $table->string('preferred_language_for_exam')->nullable()->default(null);
        });

        // update the new columns with existing preferred language column value
        DB::statement('UPDATE users SET preferred_language_for_interview = preferred_lang , preferred_language_for_exam = preferred_lang');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('preferred_language_for_interview');
            $table->dropColumn('preferred_language_for_exam');
        });
    }
}
