<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class LaratrustSetupTeams extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Create table for storing teams
        Schema::create('teams', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->string('name')->unique();
            $table->jsonb('display_name')->nullable();
            $table->jsonb('description')->nullable();
            $table->timestamps();
        });

        DB::statement('ALTER TABLE teams ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::table('role_user', function (Blueprint $table) {
            // Drop role foreign key and primary key
            $table->dropForeign(['role_id']);
            $table->dropPrimary(['user_id', 'role_id', 'user_type']);

            // Add team_id column
            $table->uuid('team_id')->nullable();

            // Create foreign keys
            $table->foreign('role_id')->references('id')->on('roles')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('team_id')->references('id')->on('teams')
                ->onUpdate('cascade')->onDelete('cascade');

            // Create a unique key
            $table->unique(['user_id', 'role_id', 'user_type', 'team_id']);
        });

        Schema::table('permission_user', function (Blueprint $table) {
           // Drop permission foreign key and primary key
            $table->dropForeign(['permission_id']);
            $table->dropPrimary(['permission_id', 'user_id', 'user_type']);

            $table->foreign('permission_id')->references('id')->on('permissions')
                ->onUpdate('cascade')->onDelete('cascade');

            // Add team_id column
            $table->uuid('team_id')->nullable();

            $table->foreign('team_id')->references('id')->on('teams')
                ->onUpdate('cascade')->onDelete('cascade');

            $table->unique(['user_id', 'permission_id', 'user_type', 'team_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('role_user', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
        });

        Schema::table('permission_user', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
        });

        Schema::dropIfExists('teams');
    }
}
