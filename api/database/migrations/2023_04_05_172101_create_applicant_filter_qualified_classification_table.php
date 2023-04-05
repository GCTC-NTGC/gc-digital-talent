<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('applicant_filter_qualified_classification', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('applicant_filter_id')->references('id')->on('applicant_filters')->nullable(false)->cascadeOnDelete();
            $table->uuid('classification_id')->references('id')->on('classifications')->nullable(false);
            $table->unique(['applicant_filter_id', 'classification_id']);
        });
        DB::statement('ALTER TABLE applicant_filter_qualified_classification ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicant_filter_qualified_classification');
    }
};
