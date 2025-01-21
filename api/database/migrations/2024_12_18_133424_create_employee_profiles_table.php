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
            $table->jsonb('career_planning_organization_type_interest')->nullable();
            $table->jsonb('career_planning_move_interest')->nullable();
            $table->jsonb('career_planning_mentorship_status')->nullable();
            $table->jsonb('career_planning_mentorship_interest')->nullable();
            $table->boolean('career_planning_exec_interest')->nullable();
            $table->jsonb('career_planning_exec_coaching_status')->nullable();
            $table->jsonb('career_planning_exec_coaching_interest')->nullable();
            $table->text('career_planning_about_you')->nullable();
            $table->text('career_planning_career_goals')->nullable();
            $table->text('career_planning_learning_goals')->nullable();
            $table->text('career_planning_work_style')->nullable();

            $table->string('dream_role_title')->nullable();
            $table->text('dream_role_additional_information')->nullable();

            $table->foreignUuid('dream_role_community_id')
                ->nullable()
                ->constrained(table: 'communities', column: 'id')
                ->onDelete('cascade');
            $table->foreignUuid('dream_role_classification_id')
                ->nullable()
                ->constrained(table: 'classifications', column: 'id')
                ->onDelete('cascade');
            $table->foreignUuid('dream_role_work_stream_id')
                ->nullable()
                ->constrained(table: 'work_streams', column: 'id')
                ->onDelete('cascade');

        });

        Schema::create('department_user_dream_role', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('department_id')
                ->constrained()
                ->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('career_planning_organization_type_interest');
            $table->dropColumn('career_planning_move_interest');
            $table->dropColumn('career_planning_mentorship_status');
            $table->dropColumn('career_planning_mentorship_interest');
            $table->dropColumn('career_planning_exec_interest');
            $table->dropColumn('career_planning_exec_coaching_status');
            $table->dropColumn('career_planning_exec_coaching_interest');
            $table->dropColumn('career_planning_about_you');
            $table->dropColumn('career_planning_work_style');
            $table->dropColumn('career_planning_career_goals');
            $table->dropColumn('career_planning_learning_goals');

            $table->dropColumn('dream_role_title');
            $table->dropColumn('dream_role_additional_information');

            $table->dropForeign(['dream_role_community_id']);
            $table->dropForeign(['dream_role_work_stream_id']);
            $table->dropForeign(['dream_role_classification_id']);

            $table->dropColumn('dream_role_community_id');
            $table->dropColumn('dream_role_classification_id');
            $table->dropColumn('dream_role_work_stream_id');
        });

        Schema::dropIfExists('department_user_dream_role');
    }
};
