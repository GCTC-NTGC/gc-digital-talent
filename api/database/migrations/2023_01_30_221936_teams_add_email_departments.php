<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->string('contact_email')->nullable()->default(null);
        });

        Schema::create('team_department', function (Blueprint $table) {
            $table->uuid('team_id')->nullable(false);
            $table->foreign('team_id')->references('id')->on('teams');
            $table->uuid('department_id')->nullable(false);
            $table->foreign('department_id')->references('id')->on('departments');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn('contact_email');
        });

        Schema::dropIfExists('team_department');
    }
};
