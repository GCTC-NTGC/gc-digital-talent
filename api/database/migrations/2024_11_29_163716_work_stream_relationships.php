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
        Schema::table('pools', function (Blueprint $table) {
            $table->foreignUuid('work_stream_id')
                ->nullable()
                ->constrained();
        });

        Schema::table('job_poster_templates', function (Blueprint $table) {
            $table->foreignUuid('work_stream_id')
                ->nullable()
                ->constrained();
        });

        Schema::create('applicant_filter_work_stream', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('applicant_filter_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('work_stream_id')
                ->constrained()
                ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->dropConstrainedForeignId('work_stream_id');
        });

        Schema::table('job_poster_templates', function (Blueprint $table) {
            $table->dropConstrainedForeignId('work_stream_id');
        });

        Schema::dropIfExists('applicant_filter_work_stream');
    }
};
