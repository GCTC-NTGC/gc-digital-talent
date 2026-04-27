<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // create pivot development program <> user
        Schema::create('development_program_user', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->timestamps();
            $table->foreignUuid('development_program_id')
                ->constrained('development_programs', 'id')
                ->onDelete('cascade');
            $table->foreignUuid('user_id')
                ->constrained('users', 'id')
                ->onDelete('cascade');
            $table->foreignUuid('education_experience_id')
                ->nullable(true)
                ->constrained('education_experiences', 'id')
                ->onDelete('cascade');
            $table->string('participation_status')->nullable();
            $table->date('completion_date')->nullable();

            $table->unique(['development_program_id', 'user_id']);
        });

        // fill in pivot using development program interests
        $developmentProgramInterests = DB::table('development_program_interests')
            ->join('community_development_program', 'community_development_program.id', '=', 'development_program_interests.community_development_program_id')
            ->join('community_interests', 'community_interests.id', '=', 'development_program_interests.community_interest_id')
            ->select(
                'development_program_interests.id as id',
                'development_program_interests.participation_status',
                'development_program_interests.completion_date',
                'community_development_program.development_program_id as development_program_id',
                'community_interests.user_id as user_id',
            )
            ->get();

        foreach ($developmentProgramInterests as $iteration) {
            $developmentProgramId = $iteration->development_program_id;
            $userId = $iteration->user_id;

            DB::table('development_program_user')
                ->insert([
                    'development_program_id' => $developmentProgramId,
                    'user_id' => $userId,
                    'participation_status' => $iteration->participation_status,
                    'completion_date' => $iteration->completion_date,
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('development_program_user');
    }
};
