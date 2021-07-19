<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePoolCandidateTableNameEmailPhoneLang extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->string('first_last')->nullable();
            $table->string('email')->nullable();
            $table->string('telephone')->nullable();
            $table->string('preferredLang')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('first_last');
            $table->dropColumn('email');
            $table->dropColumn('telephone');
            $table->dropColumn('preferredLang');
        });
    }
}
