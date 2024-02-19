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
        // Add searchable column
        // Blueprint doesn't work well with tsvector columns; hence, the raw statement
        DB::statement('ALTER TABLE users ADD COLUMN searchable TSVECTOR');

        // Update the tsvector column with the data for existing rows
        DB::statement('
            UPDATE users
            SET searchable = to_tsvector(\'english\', COALESCE(email, \'\') || \' \' ||
            CONCAT_WS(\' \', COALESCE(first_name, \'\'), COALESCE(last_name, \' \'), COALESCE(telephone, \' \'), COALESCE(preferred_lang, \' \'), COALESCE(current_city, \' \')) ||
            CONCAT_WS(\' \', ARRAY(SELECT notes FROM Pool_Candidates WHERE Pool_Candidates.user_id = users.id)) ||
            CONCAT_WS(\' \', ARRAY(SELECT CONCAT_WS(\' \', role, organization, division, details) FROM work_experiences WHERE work_experiences.user_id = users.id)) ||
            CONCAT_WS(\' \', ARRAY(SELECT CONCAT_WS(\' \', thesis_title, details) FROM education_experiences WHERE education_experiences.user_id = users.id)) ||
            CONCAT_WS(\' \', ARRAY(SELECT CONCAT_WS(\' \', title, description, details) FROM personal_experiences WHERE personal_experiences.user_id = users.id)) ||
            CONCAT_WS(\' \', ARRAY(SELECT CONCAT_WS(\' \', title, issued_by, details) FROM award_experiences WHERE award_experiences.user_id = users.id)) ||
            CONCAT_WS(\' \', ARRAY(SELECT CONCAT_WS(\' \', title, details) FROM community_experiences WHERE community_experiences.user_id = users.id))
            )'
        );

        // Create a GIN index on the tsvector column for efficient full-text search
        DB::statement('CREATE INDEX users_searchable_index ON users USING GIN(searchable)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_searchable_index');
            $table->dropColumn('searchable');
        });
    }
};
