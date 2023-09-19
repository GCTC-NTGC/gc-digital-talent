<?php

use Illuminate\Database\Migrations\Migration;
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
        // add new columns for late changes
        Schema::table('digital_contracting_questionnaires', function (Blueprint $table) {
            // add new columns for late changes
            $table->string('contract_ftes')->nullable();
            $table->string('instrument_type_other')->nullable();
        });

        // DBAL doesn't know how to run change() on jsonb columns
        // https://github.com/laravel/framework/issues/40012

        // column created wrong type
        DB::statement('alter table digital_contracting_questionnaires alter column requirement_others type jsonb using requirement_others::jsonb;');
        // make json arrays nullable
        DB::statement('ALTER TABLE digital_contracting_questionnaires ALTER COLUMN authorities_involved DROP NOT NULL;');
        DB::statement('ALTER TABLE digital_contracting_questionnaires ALTER COLUMN requirement_screening_levels DROP NOT NULL;');
        DB::statement('ALTER TABLE digital_contracting_questionnaires ALTER COLUMN requirement_work_languages DROP NOT NULL;');
        DB::statement('ALTER TABLE digital_contracting_questionnaires ALTER COLUMN requirement_work_locations DROP NOT NULL;');
        DB::statement('ALTER TABLE digital_contracting_questionnaires ALTER COLUMN requirement_others DROP NOT NULL;');
        DB::statement('ALTER TABLE digital_contracting_questionnaires ALTER COLUMN operations_considerations DROP NOT NULL;');
        DB::statement('ALTER TABLE digital_contracting_questionnaires ALTER COLUMN contracting_rationales_secondary DROP NOT NULL;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('digital_contracting_questionnaires', function (Blueprint $table) {
            $table->dropColumn('contract_ftes');
            $table->dropColumn('instrument_type_other');
        });

        DB::statement('alter table digital_contracting_questionnaires alter column requirement_others type varchar(255);');

        DB::statement('ALTER TABLE public.digital_contracting_questionnaires ALTER COLUMN authorities_involved SET NOT NULL;');
        DB::statement('ALTER TABLE public.digital_contracting_questionnaires ALTER COLUMN requirement_screening_levels SET NOT NULL;');
        DB::statement('ALTER TABLE public.digital_contracting_questionnaires ALTER COLUMN requirement_work_languages SET NOT NULL;');
        DB::statement('ALTER TABLE public.digital_contracting_questionnaires ALTER COLUMN requirement_work_locations SET NOT NULL;');
        DB::statement('ALTER TABLE public.digital_contracting_questionnaires ALTER COLUMN requirement_others SET NOT NULL;');
        DB::statement('ALTER TABLE public.digital_contracting_questionnaires ALTER COLUMN operations_considerations SET NOT NULL;');
        DB::statement('ALTER TABLE public.digital_contracting_questionnaires ALTER COLUMN contracting_rationales_secondary SET NOT NULL;');
    }
};
