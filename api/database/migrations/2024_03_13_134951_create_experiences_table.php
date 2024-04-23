<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // add new
        Schema::create('experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->timestamps();
            $table->softDeletes();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
            $table->text('details')->nullable();
            $table->string('experience_type')->index();
            $table->jsonb('properties')->nullable();
        });

        // roll back table insertions if any fail before starting to drop old tables
        DB::transaction(function () {

            DB::table('experiences')
                ->insertUsing(
                    ['id', 'created_at', 'updated_at', 'deleted_at', 'user_id', 'details', 'experience_type', 'properties'],
                    DB::table('award_experiences')
                        ->select(DB::raw(<<<'SQL'
                            id, created_at, updated_at, deleted_at, user_id, details, 'App\Models\AwardExperience',
                            json_build_object(
                                'awarded_date', awarded_date,
                                'title', title,
                                'issued_by', issued_by,
                                'awarded_to', awarded_to,
                                'awarded_scope', awarded_scope
                            )
                        SQL))
                );

            DB::table('experiences')
                ->insertUsing(
                    ['id', 'created_at', 'updated_at', 'deleted_at', 'user_id', 'details', 'experience_type', 'properties'],
                    DB::table('community_experiences')
                        ->select(DB::raw(<<<'SQL'
                            id, created_at, updated_at, deleted_at, user_id, details, 'App\Models\CommunityExperience',
                            json_build_object(
                                'start_date', start_date,
                                'end_date', end_date,
                                'title', title,
                                'organization', organization,
                                'project'
                            )
                        SQL))
                );

            DB::table('experiences')
                ->insertUsing(
                    ['id', 'created_at', 'updated_at', 'deleted_at', 'user_id', 'details', 'experience_type', 'properties'],
                    DB::table('education_experiences')
                        ->select(DB::raw(<<<'SQL'
                            id, created_at, updated_at, deleted_at, user_id, details, 'App\Models\EducationExperience',
                            json_build_object(
                                'start_date', start_date,
                                'end_date', end_date,
                                'institution', institution,
                                'area_of_study', area_of_study,
                                'thesis_title', thesis_title,
                                'type', type,
                                'status', status
                            )
                        SQL))
                );

            DB::table('experiences')
                ->insertUsing(
                    ['id', 'created_at', 'updated_at', 'deleted_at', 'user_id', 'details', 'experience_type', 'properties'],
                    DB::table('personal_experiences')
                        ->select(DB::raw(<<<'SQL'
                            id, created_at, updated_at, deleted_at, user_id, details,'App\Models\PersonalExperience',
                            json_build_object(
                                'start_date', start_date,
                                'end_date', end_date,
                                'title', title,
                                'description'
                            )
                        SQL))
                );

            DB::table('experiences')
                ->insertUsing(
                    ['id', 'created_at', 'updated_at', 'deleted_at', 'user_id', 'details', 'experience_type', 'properties'],
                    DB::table('work_experiences')
                        ->select(DB::raw(<<<'SQL'
                            id, created_at, updated_at, deleted_at, user_id, details,'App\Models\WorkExperience',
                            json_build_object(
                                'start_date', start_date,
                                'end_date', end_date,
                                'role', role,
                                'organization', organization,
                                'division', division
                            )
                        SQL))
                );

            Schema::table('experience_skill', function (Blueprint $table) {
                $table->foreign('experience_id')->references('id')->on('experiences')->cascadeOnDelete(true);
            });
            Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
                $table->foreign('experience_id')->references('id')->on('experiences')->cascadeOnDelete(true);
            });

            Schema::drop('award_experiences');
            Schema::drop('community_experiences');
            Schema::drop('education_experiences');
            Schema::drop('personal_experiences');
            Schema::drop('work_experiences');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('award_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
            $table->string('title')->nullable();
            $table->string('issued_by')->nullable();
            $table->date('awarded_date')->nullable();
            $table->string('awarded_to')->nullable();
            $table->string('awarded_scope')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('community_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
            $table->string('title')->nullable();
            $table->string('organization')->nullable();
            $table->string('project')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('education_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
            $table->string('institution')->nullable();
            $table->string('area_of_study')->nullable();
            $table->string('thesis_title')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('type')->nullable();
            $table->string('status')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('personal_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('work_experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
            $table->string('role')->nullable();
            $table->string('organization')->nullable();
            $table->string('division')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // roll back table insertions and if any fail before starting to the old table
        DB::transaction(function () {

            DB::table('award_experiences')
                ->insertUsing(
                    ['id', 'user_id', 'title', 'issued_by',  'awarded_date', 'awarded_to', 'awarded_scope', 'details', 'created_at', 'updated_at', 'deleted_at'],
                    DB::table('experiences')
                        ->select([
                            'id',
                            'user_id',
                            new Expression("properties->>'title'"),
                            new Expression("properties->>'issued_by'"),
                            new Expression("to_date(properties->>'awarded_date', 'YYYY-MM-DD')"),
                            new Expression("properties->>'awarded_to'"),
                            new Expression("properties->>'awarded_scope'"),
                            'details',
                            'created_at',
                            'updated_at',
                            'deleted_at',
                        ])
                        ->where('experience_type', 'App\Models\AwardExperience')
                );

            DB::table('community_experiences')
                ->insertUsing(
                    ['id', 'user_id', 'title', 'organization', 'project', 'start_date', 'end_date', 'details', 'created_at', 'updated_at', 'deleted_at'],
                    DB::table('experiences')
                        ->select([
                            'id',
                            'user_id',
                            new Expression("properties->>'title'"),
                            new Expression("properties->>'organization'"),
                            new Expression("properties->>'project'"),
                            new Expression("to_date(properties->>'start_date', 'YYYY-MM-DD')"),
                            new Expression("to_date(properties->>'end_date', 'YYYY-MM-DD')"),
                            'details',
                            'created_at',
                            'updated_at',
                            'deleted_at',
                        ])
                        ->where('experience_type', 'App\Models\CommunityExperience')
                );

            DB::table('education_experiences')
                ->insertUsing(
                    ['id', 'user_id', 'institution', 'area_of_study', 'thesis_title', 'start_date', 'end_date', 'type', 'status', 'details', 'created_at', 'updated_at', 'deleted_at'],
                    DB::table('experiences')
                        ->select([
                            'id',
                            'user_id',
                            new Expression("properties->>'institution'"),
                            new Expression("properties->>'area_of_study'"),
                            new Expression("properties->>'thesis_title'"),
                            new Expression("to_date(properties->>'start_date', 'YYYY-MM-DD')"),
                            new Expression("to_date(properties->>'end_date', 'YYYY-MM-DD')"),
                            new Expression("properties->>'type'"),
                            new Expression("properties->>'status'"),
                            'details',
                            'created_at',
                            'updated_at',
                            'deleted_at',
                        ])
                        ->where('experience_type', 'App\Models\EducationExperience')
                );

            DB::table('personal_experiences')
                ->insertUsing(
                    ['id', 'user_id', 'title', 'description', 'start_date', 'end_date', 'details', 'created_at', 'updated_at', 'deleted_at'],
                    DB::table('experiences')
                        ->select([
                            'id',
                            'user_id',
                            new Expression("properties->>'title'"),
                            new Expression("properties->>'description'"),
                            new Expression("to_date(properties->>'start_date', 'YYYY-MM-DD')"),
                            new Expression("to_date(properties->>'end_date', 'YYYY-MM-DD')"),
                            'details',
                            'created_at',
                            'updated_at',
                            'deleted_at',
                        ])
                        ->where('experience_type', 'App\Models\PersonalExperience')
                );

            DB::table('work_experiences')
                ->insertUsing(
                    ['id', 'user_id', 'role', 'organization', 'division', 'start_date', 'end_date', 'details', 'created_at', 'updated_at', 'deleted_at'],
                    DB::table('experiences')
                        ->select([
                            'id',
                            'user_id',
                            new Expression("properties->>'role'"),
                            new Expression("properties->>'organization'"),
                            new Expression("properties->>'division'"),
                            new Expression("to_date(properties->>'start_date', 'YYYY-MM-DD')"),
                            new Expression("to_date(properties->>'end_date', 'YYYY-MM-DD')"),
                            'details',
                            'created_at',
                            'updated_at',
                            'deleted_at',
                        ])
                        ->where('experience_type', 'App\Models\WorkExperience')
                );

            Schema::table('experience_skill', function (Blueprint $table) {
                $table->dropForeign('experience_skill_experience_id_foreign');
            });
            Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
                $table->dropForeign('pool_candidate_education_requirement_experience_experience_id_f');
            });

            Schema::dropIfExists('experiences');
        });
    }
};
