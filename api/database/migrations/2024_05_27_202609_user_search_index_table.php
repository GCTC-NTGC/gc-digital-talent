<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
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
        Schema::create('user_search_indices', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->foreign('id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
        });

        DB::statement('DROP INDEX users_searchable_index');
        DB::statement('ALTER TABLE user_search_indices ADD COLUMN searchable TSVECTOR');
        DB::statement('CREATE INDEX users_searchable_index ON user_search_indices USING GIN(searchable)');

        // copy existing values before dropping column
        $users = DB::table('users')->select(['id', 'searchable'])->get();
        foreach ($users as $user) {
            DB::table('user_search_indices')->insert([
                'id' => $user->id,
                'searchable' => $user->searchable,
            ]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('searchable');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX users_searchable_index');
        DB::statement('ALTER TABLE users ADD COLUMN searchable TSVECTOR');
        DB::statement('CREATE INDEX users_searchable_index ON users USING GIN(searchable)');

        $searchIndexes = DB::table('user_search_indices')->select(['id', 'searchable'])->get();
        foreach ($searchIndexes as $searchIndex) {
            DB::table('users')->where('id', $searchIndex->id)->update([
                'searchable' => $searchIndex->searchable,
            ]);
        }

        Schema::dropIfExists('user_search_indices');
    }
};
