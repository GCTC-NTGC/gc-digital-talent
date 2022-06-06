<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassificationRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classification_roles', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->string('key')->nullable(false);
            $table->jsonb('role_name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
       });
       DB::statement('ALTER TABLE classification_roles ALTER COLUMN id SET DEFAULT gen_random_uuid();');

       Schema::create('classification_roles_user', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('classification_id')->references('id')->on('classifications')->nullable(false);
            $table->uuid('classification_roles_id')->references('id')->on('classification_roles')->nullable(false);
        });
       DB::statement('ALTER TABLE classification_roles_user ALTER COLUMN id SET DEFAULT gen_random_uuid();');

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('classification_roles');
    }
}
