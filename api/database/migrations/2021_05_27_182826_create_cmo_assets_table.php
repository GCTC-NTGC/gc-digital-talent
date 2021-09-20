<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCmoAssetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cmo_assets', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->string('key')->nullable(false);
            $table->jsonb('name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('description')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
        });
        DB::statement('ALTER TABLE cmo_assets ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cmo_assets');
    }
}
