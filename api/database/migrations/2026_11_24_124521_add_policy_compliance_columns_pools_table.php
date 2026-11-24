<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use function Safe\json_encode;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->string('selection_scope')->nullable();
            $table->string('area_of_selection_scope')->nullable();
            $table->string('area_of_selection_criteria')->nullable();
            $table->jsonb('area_of_selection_exception_reason')->nullable();
            $table->boolean('includes_sliding_area')->default(false);
            $table->jsonb('sliding_area_of_selection')->nullable();
            $table->jsonb('position_duration')->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('indeterminate_staffing_type')->nullable();
            $table->jsonb('fixed_length_staffing_type')->nullable();
            $table->unsignedInteger('employment_length_years')->nullable();
            $table->unsignedInteger('employment_length_months')->nullable();
            $table->string('staffing_intent')->comment('The intended purpose of the process (specific or generic).');
            $table->unsignedInteger('number_of_positions')->nullable();
            $table->boolean('exceeds_location_limit')->default(false);
            $table->jsonb('territory_agreements')->default(json_encode([]));
            $table->jsonb('office_presence')->nullable();
            $table->jsonb('additional_information')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn([
                'selection_scope',
                'area_of_selection_scope',
                'area_of_selection_criteria',
                'area_of_selection_exception_reason',
                'includes_sliding_area',
                'sliding_area_of_selection',
                'position_duration',
                'indeterminate_staffing_type',
                'fixed_length_staffing_type',
                'employment_length_years',
                'employment_length_months',
                'staffing_intent',
                'number_of_positions',
                'exceeds_location_limit',
                'territory_agreements',
                'office_presence',
                'additional_information',
            ]);
        });
    }
};
