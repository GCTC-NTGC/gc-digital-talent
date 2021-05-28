<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOperationalRequirementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('operational_requirements', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('key')->nullable(false);
            $table->json('name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->json('description')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('operational_requirements');
    }
}
