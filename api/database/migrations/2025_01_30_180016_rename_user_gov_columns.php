<?php

use Illuminate\Database\Migrations\Migration;
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
            $table->renameColumn('is_gov_employee', 'computed_is_gov_employee');
            $table->renameColumn('gov_employee_type', 'computed_gov_employee_type');
            $table->renameColumn('current_classification', 'computed_classification');
            $table->renameColumn('department', 'computed_department');
            $table->text('computed_gov_position_type')->nullable();
            $table->date('computed_gov_end_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('computed_is_gov_employee', 'is_gov_employee');
            $table->renameColumn('computes_gov_employee_type', 'gov_employee_type');
            $table->renameColumn('computed_classification', 'current_classification');
            $table->renameColumn('computed_department', 'department');
            $table->dropColumn('computed_gov_position_type');
            $table->dropColumn('computed_gov_end_date');
        });
    }
};
