<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateSkillsFrenchKeywords extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('skills', function (Blueprint $table) {
            $table->dropColumn('keywords');
        });
        Schema::table('skills', function (Blueprint $table) {
            $table->jsonb('keywords')->default(json_encode(['en' => [], 'fr' => []]))->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('skills', function (Blueprint $table) {
            $table->dropColumn('keywords');
        });
        Schema::table('skills', function (Blueprint $table) {
            $table->jsonb('keywords')->nullable();
        });
    }
}
