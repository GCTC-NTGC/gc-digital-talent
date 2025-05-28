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
        // step 1: create the five new experience tables

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
            $table->string('employment_category')->nullable();
            $table->string('ext_size_of_organization')->nullable();
            $table->string('ext_role_seniority')->nullable();
            $table->string('gov_employment_type')->nullable();
            $table->string('gov_position_type')->nullable();
            $table->string('gov_contractor_role_seniority')->nullable();
            $table->string('gov_contractor_type')->nullable();
            $table->string('caf_employment_type')->nullable();
            $table->string('caf_force')->nullable();
            $table->string('caf_rank')->nullable();
            $table->uuid('classification_id')->nullable();
            $table->foreign('classification_id')->references('id')->on('classifications');
            $table->uuid('department_id')->nullable();
            $table->foreign('department_id')->references('id')->on('departments');
            $table->string('contractor_firm_agency_name')->nullable();
            $table->boolean('supervisory_position')->nullable();
            $table->boolean('supervised_employees')->nullable();
            $table->integer('supervised_employees_number')->nullable();
            $table->boolean('budget_management')->nullable();
            $table->integer('annual_budget_allocation')->nullable();
            $table->boolean('senior_management_status')->nullable();
            $table->string('c_suite_role_title')->nullable();
            $table->string('other_c_suite_role_title')->nullable();
        });

        // step 2: create the table to pivot from work experience to work stream

        Schema::create('work_experience_work_stream', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table
                ->foreignUuid('work_experience_id')
                ->constrained('work_experiences')
                ->onDelete('cascade');  // if the work experience is deleted, remove the association to the work stream
            $table
                ->foreignUuid('work_stream_id')
                ->constrained('work_streams')
                ->onDelete('cascade');  // if the work stream is deleted, remove the association to the work experience
            $table->index(['work_experience_id', 'work_stream_id']);
        });

        // step 3: create the columns in experience_skill and pool_candidate_education_requirement_experience to support the morph

        Schema::table('experience_skill', function (Blueprint $table) {
            $table->string('experience_type')->nullable();
        });
        Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
            $table->string('experience_type')->nullable();
        });

        // transaction to roll back table insertions if any fail before starting to delete the old table
        DB::transaction(function () {

            // step 4: fill the five new experience tables from step 1

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
                    [
                        'id', 'user_id', 'role', 'organization', 'division', 'start_date', 'end_date', 'details', 'created_at', 'updated_at', 'deleted_at',
                        'employment_category', 'ext_size_of_organization', 'ext_role_seniority', 'gov_employment_type', 'gov_position_type', 'gov_contractor_role_seniority', 'gov_contractor_type', 'caf_employment_type', 'caf_force', 'caf_rank', 'classification_id', 'department_id', 'contractor_firm_agency_name',
                        'supervisory_position', 'supervised_employees', 'supervised_employees_number', 'budget_management', 'annual_budget_allocation', 'senior_management_status',
                        'c_suite_role_title', 'other_c_suite_role_title',
                    ],
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
                            new Expression("properties->>'employment_category'"),
                            new Expression("properties->>'ext_size_of_organization'"),
                            new Expression("properties->>'ext_role_seniority'"),
                            new Expression("properties->>'gov_employment_type'"),
                            new Expression("properties->>'gov_position_type'"),
                            new Expression("properties->>'gov_contractor_role_seniority'"),
                            new Expression("properties->>'gov_contractor_type'"),
                            new Expression("properties->>'caf_employment_type'"),
                            new Expression("properties->>'caf_force'"),
                            new Expression("properties->>'caf_rank'"),
                            new Expression("(properties->>'classification_id')::UUID"),
                            new Expression("(properties->>'department_id')::UUID"),
                            new Expression("properties->>'contractor_firm_agency_name'"),
                            new Expression("(properties->>'supervisory_position')::BOOL"),
                            new Expression("(properties->>'supervised_employees')::BOOL"),
                            // seems like there was a null-handling bug in our JSON int storage that stored false instead of null
                            new Expression("case when properties->>'supervised_employees_number' = 'false' then null else (properties->>'supervised_employees_number')::INT end"),
                            new Expression("(properties->>'budget_management')::BOOL"),
                            // seems like there was a null-handling bug in our JSON int storage that stored false instead of null
                            new Expression("case when properties->>'annual_budget_allocation' = 'false' then null else (properties->>'annual_budget_allocation')::INT end"),
                            new Expression("(properties->>'senior_management_status')::BOOL"),
                            new Expression("properties->>'c_suite_role_title'"),
                            new Expression("properties->>'other_c_suite_role_title'"),
                        ])
                        ->where('experience_type', 'App\Models\WorkExperience')
                );

            // step 5: fill the pivot tables from step 2

            DB::table('work_experience_work_stream')
                ->insertUsing(
                    ['work_experience_id', 'work_stream_id'],
                    DB::table('experiences')
                        ->select(['id', new Expression("jsonb_array_elements_text(properties->'work_stream_ids')::UUID")])
                        ->where('experience_type', 'App\Models\WorkExperience')
                        ->where(new Expression("jsonb_typeof(properties->'work_stream_ids')"), 'array')
                );

            // step 6: fill the morph columns and make non-nullable from step 3

            DB::statement('
                UPDATE experience_skill as t
                SET experience_type = e.experience_type
                FROM experiences AS e
                WHERE t.experience_id  = e.id
            ');
            Schema::table('experience_skill', function (Blueprint $table) {
                $table->string('experience_type')
                    ->nullable(false)
                    ->change();
            });

            DB::statement('
                UPDATE pool_candidate_education_requirement_experience as t
                SET experience_type = e.experience_type
                FROM experiences AS e
                WHERE t.experience_id  = e.id
            ');
            Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
                $table->string('experience_type')
                    ->nullable(false)
                    ->change();
            });

            // step 7: finally, drop the old objects

            Schema::table('experience_skill', function (Blueprint $table) {
                $table->dropForeign('experience_skill_experience_id_foreign');
            });
            Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
                $table->dropForeign('pool_candidate_education_requirement_experience_experience_id_f');
            });
            Schema::drop('experiences');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // step 1: create the shared experience table

        Schema::create('experiences', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->timestamps();
            $table->softDeletes();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
            $table->text('details');
            $table->string('experience_type')->index();
            $table->jsonb('properties')->nullable();
        });

        // transaction to roll back table insertions if any fail before starting to drop old tables
        DB::transaction(function () {

            // step 2: fill the shared experience table from the five separate tables

            DB::table('experiences')
                ->insertUsing(
                    ['id', 'created_at', 'updated_at', 'deleted_at', 'user_id', 'details', 'experience_type', 'properties'],
                    DB::table('award_experiences')
                        ->select(DB::raw(<<<'SQL'
                            id, created_at, updated_at, deleted_at, user_id, details, 'App\Models\AwardExperience',
                            json_build_object(
                                'awarded_date', to_char(awarded_date, 'YYYY-MM-DD'),
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
                                'start_date', to_char(start_date, 'YYYY-MM-DD'),
                                'end_date', to_char(end_date, 'YYYY-MM-DD'),
                                'title', title,
                                'organization', organization,
                                'project', project
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
                                'start_date', to_char(start_date, 'YYYY-MM-DD'),
                                'end_date', to_char(end_date, 'YYYY-MM-DD'),
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
                                'start_date', to_char(start_date, 'YYYY-MM-DD'),
                                'end_date', to_char(end_date, 'YYYY-MM-DD'),
                                'title', title,
                                'description', description
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
                                'start_date', to_char(start_date, 'YYYY-MM-DD'),
                                'end_date', to_char(end_date, 'YYYY-MM-DD'),
                                'role', role,
                                'organization', organization,
                                'division', division,
                                'employment_category', employment_category,
                                'ext_size_of_organization', ext_size_of_organization,
                                'ext_role_seniority', ext_role_seniority,
                                'gov_employment_type', gov_employment_type,
                                'gov_position_type', gov_position_type,
                                'gov_contractor_role_seniority', gov_contractor_role_seniority,
                                'gov_contractor_type', gov_contractor_type,
                                'caf_employment_type', caf_employment_type,
                                'caf_force', caf_force,
                                'caf_rank', caf_rank,
                                'classification_id', classification_id,
                                'department_id', department_id,
                                'contractor_firm_agency_name', contractor_firm_agency_name,
                                'supervisory_position', supervisory_position,
                                'supervised_employees', supervised_employees,
                                'supervised_employees_number', supervised_employees_number,
                                'budget_management', budget_management,
                                'annual_budget_allocation', annual_budget_allocation,
                                'senior_management_status', senior_management_status,
                                'c_suite_role_title', c_suite_role_title,
                                'other_c_suite_role_title', other_c_suite_role_title,
                                'work_stream_ids', (select array_agg(work_stream_id) from work_experience_work_stream where work_experience_id = "work_experiences".id)
                            )
                        SQL))
                );

            // step 3: remove the columns in experience_skill and pool_candidate_education_requirement_experience to support the morph and readd the foreign key to the shared table

            Schema::table('experience_skill', function (Blueprint $table) {
                $table->foreign('experience_id')->references('id')->on('experiences')->cascadeOnDelete(true);
                $table->dropColumn('experience_type');
            });
            Schema::table('pool_candidate_education_requirement_experience', function (Blueprint $table) {
                $table->foreign('experience_id')->references('id')->on('experiences')->cascadeOnDelete(true);
                $table->dropColumn('experience_type');
            });

            // step 4: finally, drop the old objects

            Schema::drop('work_experience_work_stream');
            Schema::drop('award_experiences');
            Schema::drop('community_experiences');
            Schema::drop('education_experiences');
            Schema::drop('personal_experiences');
            Schema::drop('work_experiences');
        });
    }
};
