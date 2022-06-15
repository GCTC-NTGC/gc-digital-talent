<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGenericJobTitlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('generic_job_titles', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->softDeletes();
            $table->string('key')->nullable(false)->unique();
            $table->jsonb('name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->uuid('classification_id')->references('id')->on('classifications');
        });
       DB::statement('ALTER TABLE generic_job_titles ALTER COLUMN id SET DEFAULT gen_random_uuid();');

       Schema::create( 'generic_job_title_user', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->softDeletes();
            $table->uuid('generic_job_title_id')->references('id')->on('generic_job_titles')->nullable(false);
            $table->uuid('user_id')->references('id')->on('users')->nullable(false);
            $table->unique(['generic_job_title_id', 'user_id'], 'generic_job_title_user_unique');
        });
       DB::statement('ALTER TABLE generic_job_title_user ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('generic_job_titles');
        Schema::dropIfExists('generic_job_title_user');

    }
}
