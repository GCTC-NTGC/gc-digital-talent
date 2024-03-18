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
            $table->foreign('user_id')->references('id')->on('users');
            $table->text('details');
            $table->string('experience_type')->nullable(false);
            $table->jsonb('properties')->nullable();
        });

        DB::transaction(function () {

            DB::table('experiences')
                ->insertUsing(
                    ['id', 'created_at', 'updated_at', 'deleted_at', 'user_id', 'details', 'experience_type', 'properties'],
                    DB::table('award_experiences')
                        ->select(DB::raw(<<<'SQL'
                            id, created_at, updated_at, deleted_at, user_id, details, 'App\Models\AwardExperience',
                            (concat('{',
                            '"awarded_date": "', awarded_date, '",',
                            '"title": "', title, '",',
                            '"issued_by": "', issued_by, '",',
                            '"awarded_to": "', awarded_to, '",',
                            '"awarded_scope": "', awarded_scope, '"',
                            '}'))::jsonb
                        SQL))
                );

            DB::table('experiences')
                ->insertUsing(
                    ['id', 'created_at', 'updated_at', 'deleted_at', 'user_id', 'details', 'experience_type', 'properties'],
                    DB::table('community_experiences')
                        ->select(DB::raw(<<<'SQL'
                            id, created_at, updated_at, deleted_at, user_id, details, 'App\Models\CommunityExperience',
                            (concat('{',
                            '"start_date": "', start_date, '",',
                            '"end_date": "', end_date, '",',
                            '"title": "', title, '",',
                            '"organization": "', organization, '",',
                            '"project": "', project, '"',
                            '}'))::jsonb
                        SQL))
                );

            DB::table('experiences')
                ->insertUsing(
                    ['id', 'created_at', 'updated_at', 'deleted_at', 'user_id', 'details', 'experience_type', 'properties'],
                    DB::table('education_experiences')
                        ->select(DB::raw(<<<'SQL'
                            id, created_at, updated_at, deleted_at, user_id, details, 'App\Models\EducationExperience',
                            (concat('{',
                            '"start_date": "', start_date, '",',
                            '"end_date": "', end_date, '",',
                            '"institution": "', institution, '",',
                            '"area_of_study": "', area_of_study, '",',
                            '"thesis_title": "', thesis_title, '",',
                            '"type": "', type, '",',
                            '"status": "', status, '"',
                            '}'))::jsonb
                        SQL))
                );

            DB::table('experiences')
                ->insertUsing(
                    ['id', 'created_at', 'updated_at', 'deleted_at', 'user_id', 'details', 'experience_type', 'properties'],
                    DB::table('personal_experiences')
                        ->select(DB::raw(<<<'SQL'
                            id, created_at, updated_at, deleted_at, user_id, details,'App\Models\PersonalExperience',
                            (concat('{',
                            '"start_date": "', start_date, '",',
                            '"end_date": "', end_date, '",',
                            '"title": "', title, '",',
                            '"description": "', description, '"',
                            '}'))::jsonb
                        SQL))
                );

            DB::table('experiences')
                ->insertUsing(
                    ['id', 'created_at', 'updated_at', 'deleted_at', 'user_id', 'details', 'experience_type', 'properties'],
                    DB::table('work_experiences')
                        ->select(DB::raw(<<<'SQL'
                            id, created_at, updated_at, deleted_at, user_id, details,'App\Models\WorkExperience',
                            (concat('{',
                            '"start_date": "', start_date, '",',
                            '"end_date": "', end_date, '",',
                            '"role": "', role, '",',
                            '"organization": "', organization, '",',
                            '"division": "', division, '"',
                            '}'))::jsonb
                        SQL))
                );

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
        Schema::dropIfExists('experiences');

        // TODO: parse out data
    }
};
