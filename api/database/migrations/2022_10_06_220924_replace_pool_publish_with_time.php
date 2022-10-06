<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ReplacePoolPublishWithTime extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->timestamptz('published_at')->nullable();
        });
        DB::statement("
            update pools
                set published_at =
                    case is_published
                        when 'true' then TIMESTAMP '2022-10-01 00:00:00+00'
                        when 'false' then null
                        else null
                    end
        ");
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn('is_published');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->boolean('is_published')->nullable();
        });
        DB::statement("
        update pools
            set is_published =
                case published_at
                    when null then false
                    else true
                end
        ");
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn('published_at');
        });
    }
}
