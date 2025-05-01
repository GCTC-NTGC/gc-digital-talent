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
            $table->integer('supervised_employees')->nullable();
            $table->string('supervised_employees_number')->nullable();
            $table->boolean('budget_management')->nullable();
            $table->integer('annual_budget_allocation')->nullable();
            $table->boolean('senior_management_status')->nullable();
            $table->string('c_suite_role_title')->nullable();
            $table->string('other_c_suite_role_title')->nullable();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('award_experiences');
        Schema::drop('community_experiences');
        Schema::drop('education_experiences');
        Schema::drop('personal_experiences');
        Schema::drop('work_experiences');
    }
};
