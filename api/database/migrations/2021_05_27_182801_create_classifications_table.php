<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classifications', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->json('name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->string('group')->nullable(false);
            $table->integer('level')->nullable(false);
            $table->integer('min_salary')->nullable();
            $table->integer('max_salary')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('classifications');
    }
}
