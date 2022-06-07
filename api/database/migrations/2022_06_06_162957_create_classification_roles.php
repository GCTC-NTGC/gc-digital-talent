<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassificationRoles extends Migration
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
            $table->softDeletes();
            $table->string('key')->nullable(false)->unique();
            $table->jsonb('name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->uuid('classification_id')->references('id')->on('classifications');
        });
       DB::statement('ALTER TABLE classification_roles ALTER COLUMN id SET DEFAULT gen_random_uuid();');

       Schema::create('classification_roles_user', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->softDeletes();
            $table->uuid('classification_role_id')->references('id')->on('classification_roles')->nullable(false);
            $table->uuid('user_id')->references('id')->on('users')->nullable(false);
            $table->unique(['classification_role_id', 'user_id'], 'classification_role_user_unique');
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
        Schema::dropIfExists('classification_roles_user');
    }
}
