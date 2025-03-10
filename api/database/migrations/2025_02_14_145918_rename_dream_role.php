<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // 1. dream_role_classification_id becomes next_role_classification_id and career_objective_classification_id
            $table->dropColumn('dream_role_classification_id');

            $table->foreignUuid('next_role_classification_id')
                ->nullable()
                ->constrained(table: 'classifications', column: 'id')
                ->onDelete('cascade');

            $table->foreignUuid('career_objective_classification_id')
                ->nullable()
                ->constrained(table: 'classifications', column: 'id')
                ->onDelete('cascade');

            // 2. A pair of new fields: next_role_target_role and career_objective_target_role - a new enum TARGET_ROLE
            $table->string('next_role_target_role')->nullable();
            $table->string('career_objective_target_role')->nullable();

            // 3. A pair of new fields to go with the enum above: next_role_target_role_other and career_objective_target_role_other - string
            $table->string('next_role_target_role_other')->nullable();
            $table->string('career_objective_target_role_other')->nullable();

            // 4. dream_role_title becomes next_role_job_title and career_objective_job_title
            $table->dropColumn('dream_role_title');
            $table->string('next_role_job_title')->nullable();
            $table->string('career_objective_job_title')->nullable();

            // 5. dream_role_community_id becomes next_role_community_id and career_objective_community_id
            $table->dropColumn('dream_role_community_id');

            $table->foreignUuid('next_role_community_id')
                ->nullable()
                ->constrained(table: 'communities', column: 'id')
                ->onDelete('cascade');

            $table->foreignUuid('career_objective_community_id')
                ->nullable()
                ->constrained(table: 'communities', column: 'id')
                ->onDelete('cascade');

            // 6. dream_role_work_stream_id  becomes two new many-to-many pivot tables: user_work_stream_next_role  and user_work_stream_career_objective
            $table->dropColumn('dream_role_work_stream_id');
        });

        Schema::create('user_work_stream_next_role', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('work_stream_id')
                ->constrained()
                ->onDelete('cascade');
        });

        Schema::create('user_work_stream_career_objective', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('work_stream_id')
                ->constrained()
                ->onDelete('cascade');
        });

        // 7. user_dream_role_departments becomes two new many_to_many tables: user_next_role_department and user_career_objective_department
        Schema::drop('department_user_dream_role');

        Schema::create('department_user_next_role', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('department_id')
                ->constrained()
                ->onDelete('cascade');
        });

        Schema::create('department_user_career_objective', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('department_id')
                ->constrained()
                ->onDelete('cascade');
        });

        Schema::table('users', function (Blueprint $table) {

            // 8. dream_role_additional_information becomes next_role_additional_information and career_objective_additional_information
            $table->dropColumn('dream_role_additional_information');
            $table->text('next_role_additional_information')->nullable();
            $table->text('career_objective_additional_information')->nullable();

        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // 1. dream_role_classification_id becomes next_role_classification_id and career_objective_classification_id
            $table->foreignUuid('dream_role_classification_id')
                ->nullable()
                ->constrained(table: 'classifications', column: 'id')
                ->onDelete('cascade');

            $table->dropColumn('next_role_classification_id');
            $table->dropColumn('career_objective_classification_id');

            // 2. A pair of new fields: next_role_target_role and career_objective_target_role - a new enum TARGET_ROLE
            $table->dropColumn('next_role_target_role');
            $table->dropColumn('career_objective_target_role');

            // 3. A pair of new fields to go with the enum above: next_role_target_role_other and career_objective_target_role_other - string
            $table->dropColumn('next_role_target_role_other')->nullable();
            $table->dropColumn('career_objective_target_role_other')->nullable();

            // 4. dream_role_title becomes next_role_job_title and career_objective_job_title
            $table->string('dream_role_title')->nullable();
            $table->dropColumn('next_role_job_title')->nullable();
            $table->dropColumn('career_objective_job_title')->nullable();

            // 5. dream_role_community_id becomes next_role_community_id and career_objective_community_id
            $table->foreignUuid('dream_role_community_id')
                ->nullable()
                ->constrained(table: 'communities', column: 'id')
                ->onDelete('cascade');

            $table->dropColumn('next_role_community_id');
            $table->dropColumn('career_objective_community_id');

            // 6. dream_role_work_stream_id  becomes two new many-to-many pivot tables: user_work_stream_next_role  and user_work_stream_career_objective
            $table->foreignUuid('dream_role_work_stream_id')
                ->nullable()
                ->constrained(table: 'work_streams', column: 'id')
                ->onDelete('cascade');

        });

        Schema::drop('user_work_stream_next_role');
        Schema::drop('user_work_stream_career_objective');

        // 7. user_dream_role_departments becomes two new many_to_many tables: user_next_role_department and user_career_objective_department
        Schema::create('department_user_dream_role', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('department_id')
                ->constrained()
                ->onDelete('cascade');
        });

        Schema::drop('department_user_next_role');
        Schema::drop('department_user_career_objective');

        Schema::table('users', function (Blueprint $table) {

            // 8. dream_role_additional_information becomes next_role_additional_information and career_objective_additional_information
            $table->text('dream_role_additional_information')->nullable();
            $table->dropColumn('next_role_additional_information');
            $table->dropColumn('career_objective_additional_information');
        });
    }
};
