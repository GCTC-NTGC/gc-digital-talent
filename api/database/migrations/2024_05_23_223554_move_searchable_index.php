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
        Schema::create('search_indices', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->timestamps();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
        });
        DB::statement('ALTER TABLE search_indices ADD COLUMN searchable TSVECTOR');
        DB::statement('CREATE INDEX searchable_index ON search_indices USING GIN(searchable)');

        // copy existing values before dropping column
        $users = DB::table('users')->select(['id', 'searchable'])->get();
        foreach ($users as $user) {
            DB::table('search_indices')->insert([
                'user_id' => $user->id,
                'searchable' => $user->searchable,
            ]);
        }

        DB::statement('DROP INDEX users_searchable_index');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('searchable');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE users ADD COLUMN searchable TSVECTOR');
        DB::statement('CREATE INDEX users_searchable_index ON users USING GIN(searchable)');

        $searchIndexes = DB::table('search_indices')->select(['user_id', 'searchable'])->get();
        foreach ($searchIndexes as $searchIndex) {
            DB::table('users')->where('id', $searchIndex->user_id)->update([
                'searchable' => $searchIndex->searchable,
            ]);
        }

        DB::statement('DROP INDEX searchable_index');
        Schema::dropIfExists('search_indices');
    }
};
