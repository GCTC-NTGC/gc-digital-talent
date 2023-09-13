<?php

use App\Providers\LanguageAbility;
use Database\Helpers\ApiEnums;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $users = DB::table('users')->get();
        foreach ($users as $user) {
            $languageAbility = $user->language_ability;
            $userId = $user->id;
            // before dropping the field language_ability, execute a data change provided it is non-null
            if ($languageAbility !== null) {

                // only override looking_for_english if it is null
                if ($user->looking_for_english === null) {
                    // play it safe, ENGLISH and BILINGUAL map to true
                    $lookingForEnglish = ($languageAbility == LanguageAbility::ENGLISH->name || $languageAbility == LanguageAbility::BILINGUAL->name);
                    DB::table('users')->where('id', $userId)->update(['looking_for_english' => $lookingForEnglish]);
                }

                // only override looking_for_french if it is null
                if ($user->looking_for_french === null) {
                    // play it safe, FRENCH and BILINGUAL map to true
                    $lookingForFrench = ($languageAbility == LanguageAbility::FRENCH->name || $languageAbility == LanguageAbility::BILINGUAL->name);
                    DB::table('users')->where('id', $userId)->update(['looking_for_french' => $lookingForFrench]);
                }

                // only override looking_for_bilingual if it is null
                if ($user->looking_for_bilingual === null) {
                    // only BILINGUAL maps to true
                    $lookingForBilingual = ($languageAbility == LanguageAbility::BILINGUAL->name);
                    DB::table('users')->where('id', $userId)->update(['looking_for_bilingual' => $lookingForBilingual]);
                }
            }
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('language_ability');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('language_ability')->nullable()->default(null);
        });

        $users = DB::table('users')->get();
        // conditionally assign the best fitting enum to the re-added field to reverse the migration as best as possible
        foreach ($users as $user) {
            $lookingForEnglish = $user->looking_for_english;
            $lookingForFrench = $user->looking_for_french;
            $lookingForBilingual = $user->looking_for_bilingual;
            $userId = $user->id;

            // only english case
            if ($lookingForEnglish && ! $lookingForFrench && ! $lookingForBilingual) {
                DB::table('users')->where('id', $userId)->update(['language_ability' => LanguageAbility::ENGLISH->name]);
            }

            // only french case
            if (! $lookingForEnglish && $lookingForFrench && ! $lookingForBilingual) {
                DB::table('users')->where('id', $userId)->update(['language_ability' => LanguageAbility::FRENCH->name]);
            }

            // bilingual case just depends on the one field being true
            // or ignore the field if english and french are both true
            if (($lookingForBilingual) || ($lookingForEnglish && $lookingForFrench)) {
                DB::table('users')->where('id', $userId)->update(['language_ability' => LanguageAbility::BILINGUAL->name]);
            }

            // in all other cases the field stays null, so cases where all fields tested are false/null for instance
        }
    }
};
