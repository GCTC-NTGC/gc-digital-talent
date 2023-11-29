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

         // add searchable column
        \DB::statement('ALTER TABLE users ADD COLUMN searchable TSVECTOR');

        // Update the tsvector column with the data for existing rows

        \DB::statement('UPDATE users SET searchable = to_tsvector(\'english\',
        coalesce(email, \'\') || \' \' || coalesce(first_name, \'\') || \' \' ||
        coalesce(last_name, \'\') || \' \' ||
        coalesce(telephone, \'\') || \' \' ||
        coalesce(preferred_lang, \'\') || \' \' ||
        coalesce(current_city, \'\') || \' \' ||

        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(notes), \' \') FROM Pool_Candidates WHERE Pool_Candidates.user_id = users.id), \'\') ||

        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(role), \' \') FROM work_experiences  WHERE work_experiences.user_id = users.id), \'\') ||
        coalesce((SELECT  ARRAY_TO_STRING(ARRAY_AGG(organization), \' \') FROM work_experiences  WHERE work_experiences.user_id = users.id), \'\') ||
        coalesce((SELECT  ARRAY_TO_STRING(ARRAY_AGG(division), \' \') FROM work_experiences  WHERE work_experiences.user_id = users.id), \'\') ||
        coalesce((SELECT  ARRAY_TO_STRING(ARRAY_AGG(details), \' \') FROM work_experiences  WHERE work_experiences.user_id = users.id), \'\') ||

        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(thesis_title), \' \') FROM education_experiences WHERE education_experiences.user_id = users.id), \'\') ||
        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(details), \' \') FROM education_experiences WHERE education_experiences.user_id = users.id), \'\') ||
        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(institution), \' \') FROM education_experiences WHERE education_experiences.user_id = users.id), \'\') ||
        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(area_of_study), \' \') FROM education_experiences WHERE education_experiences.user_id = users.id), \'\') ||

        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(title), \' \') FROM personal_experiences WHERE personal_experiences.user_id = users.id), \'\') ||
        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(description), \' \') FROM personal_experiences WHERE personal_experiences.user_id = users.id), \'\') ||
        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(details), \' \') FROM personal_experiences WHERE personal_experiences.user_id = users.id), \'\') ||

        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(title), \' \') FROM award_experiences WHERE award_experiences.user_id = users.id), \'\') ||
        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(issued_by), \' \') FROM award_experiences WHERE award_experiences.user_id = users.id), \'\') ||
        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(details), \' \')details FROM award_experiences WHERE award_experiences.user_id = users.id), \'\') ||

        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(title), \' \') FROM community_experiences WHERE community_experiences.user_id = users.id), \'\') ||
        coalesce((SELECT ARRAY_TO_STRING(ARRAY_AGG(details), \' \')details FROM community_experiences WHERE community_experiences.user_id = users.id), \'\')
        )');


        // Create a GIN index on the tsvector column for efficient full-text search
        \DB::statement('CREATE INDEX users_searchable_index ON users USING GIN(searchable)');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $table->dropColumn('searchable');

    }
};
