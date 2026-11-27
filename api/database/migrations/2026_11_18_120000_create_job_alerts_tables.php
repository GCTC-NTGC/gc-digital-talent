<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_alerts', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('gen_random_uuid()'));
            $table->foreignUuid('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->string('name');
            $table->boolean('is_paused')->default(false);
            $table->timestamps();
        });

        // columns match PublishedPoolsSearchInput fields so a saved filter converts straight back into search args
        Schema::create('job_alert_filters', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('gen_random_uuid()'));
            $table->foreignUuid('job_alert_id')
                ->constrained()
                ->onDelete('cascade');
            $table->jsonb('keyword_search')->nullable();
            $table->jsonb('eligibility')->nullable();
            $table->jsonb('languages')->nullable();
            $table->string('salary_range')->nullable();
            $table->timestamps();
        });

        Schema::create('department_job_alert_filter', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('gen_random_uuid()'));
            $table->foreignUuid('department_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('job_alert_filter_id')
                ->constrained()
                ->onDelete('cascade');
            $table->unique(['department_id', 'job_alert_filter_id'], 'department_job_alert_filter_unique');
        });

        Schema::create('classification_job_alert_filter', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('gen_random_uuid()'));
            $table->foreignUuid('classification_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('job_alert_filter_id')
                ->constrained()
                ->onDelete('cascade');
            $table->unique(['classification_id', 'job_alert_filter_id'], 'classification_job_alert_filter_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classification_job_alert_filter');
        Schema::dropIfExists('department_job_alert_filter');
        Schema::dropIfExists('job_alert_filters');
        Schema::dropIfExists('job_alerts');
    }
};
