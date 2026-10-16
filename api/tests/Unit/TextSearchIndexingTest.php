<?php

namespace Tests\Unit;

use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\Experience;
use App\Models\PersonalExperience;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class TextSearchIndexingTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->user = User::factory()->create();
        // a freshly loaded instance, as a request would have
        $this->user = User::findOrFail($this->user->id);
    }

    // Runs the callback in a transaction, as a mutation does, and counts the search index rebuilds, this is to assert correct counts
    private function countRebuilds(callable $callback): int
    {
        $count = 0;
        DB::listen(function ($query) use (&$count) {
            if (preg_match('/^(update|insert into) "user_search_indices"/', $query->sql)) {
                $count++;
            }
        });
        DB::transaction($callback);

        return $count;
    }

    private function isSearchable(string $term, ?User $user = null): bool
    {
        return User::query()->whereGeneralSearch($term)->pluck('users.id')->contains(($user ?? $this->user)->id);
    }

    // A new user gets indexed once and can be found by name
    public function testNewUserIsIndexedOnce()
    {
        $user = User::factory()->make(['first_name' => 'Newcomer']);

        $this->assertEquals(1, $this->countRebuilds(fn () => $user->save()));
        $this->assertTrue($this->isSearchable('Newcomer', $user));
    }

    // Changing any searchable user field updates the index
    #[DataProvider('indexedColumnProvider')]
    public function testIndexedUserFieldChangeRebuilds(string $column)
    {
        $this->assertEquals(1, $this->countRebuilds(fn () => $this->user->forceFill([$column => "changed{$column}"])->save()));
    }

    public static function indexedColumnProvider()
    {
        // SEARCH_INDEX_COLUMNS from User.php
        return [
            'first_name' => ['first_name'],
            'last_name' => ['last_name'],
            'email' => ['email'],
            'telephone' => ['telephone'],
            'current_province' => ['current_province'],
            'current_city' => ['current_city'],
        ];
    }

    // Saving a user without changing a searchable field leaves the index alone
    public function testNonIndexedUserSavesDoNotRebuild()
    {
        $this->assertEquals(0, $this->countRebuilds(fn () => $this->user->forceFill(['looking_for_french' => ! $this->user->looking_for_french])->save()));
        $this->assertEquals(0, $this->countRebuilds(fn () => $this->user->save()));
    }

    // Logging in updates the index as a safety net, even though login time isn't searchable
    // SEARCH_INDEX_COLUMNS field last_sign_in_at
    public function testLoginRebuilds()
    {
        $this->assertEquals(1, $this->countRebuilds(fn () => $this->user->forceFill(['last_sign_in_at' => now()])->save()));
    }

    // A name change still gets indexed when another save follows it in the same transaction
    // Method wasChanged() does not work in these cases, and so intentionally not used in User.php
    public function testIndexedChangeSurvivesLaterSaveInSameTransaction()
    {
        $rebuilds = $this->countRebuilds(function () {
            $this->user->forceFill(['first_name' => 'First save'])->save();
            $this->user->forceFill(['looking_for_french' => ! $this->user->looking_for_french])->save();
        });

        $this->assertEquals(1, $rebuilds);
        $this->assertTrue($this->isSearchable('First save'));
    }

    // An archived user drops out of search and comes back when restored
    public function testRestoredUserIsSearchableAgain()
    {
        $this->user->forceFill(['first_name' => 'Archived'])->save();

        $this->user->delete();
        $this->assertFalse($this->isSearchable('Archived'));

        $this->user->restore();
        $this->assertTrue($this->isSearchable('Archived'));
    }

    /**
     * Adding, editing or deleting an experience updates the index once, and saving one unchanged does nothing
     *
     * @param  class-string<Experience>  $experienceClass
     */
    #[DataProvider('experienceProvider')]
    public function testExperienceChangesUpdateIndex(string $experienceClass, string $column)
    {
        $skills = Skill::factory()->count(2)->create()->map(fn ($skill) => ['id' => $skill->id])->all();
        $experience = $experienceClass::factory()->make(['user_id' => $this->user->id, $column => 'First text']);

        // a save followed by a skill sync, as the experience mutations do
        $this->assertEquals(1, $this->countRebuilds(function () use ($experience, $skills) {
            $experience->save();
            $experience->syncSkills($skills);
        }));
        $this->assertTrue($this->isSearchable('First text'));

        $experience = $experienceClass::findOrFail($experience->id);
        $this->assertEquals(0, $this->countRebuilds(function () use ($experience, $skills) {
            $experience->save();
            $experience->syncSkills($skills);
        }));

        $this->assertEquals(1, $this->countRebuilds(function () use ($experience, $skills, $column) {
            $experience->{$column} = 'Second text';
            $experience->save();
            $experience->syncSkills($skills);
        }));
        $this->assertTrue($this->isSearchable('Second text'));
        $this->assertFalse($this->isSearchable('First text'));

        $this->assertEquals(1, $this->countRebuilds(fn () => $experience->delete()));
        $this->assertFalse($this->isSearchable('Second text'));
    }

    // each type with one of its indexed text columns
    public static function experienceProvider()
    {
        return [
            'work' => [WorkExperience::class, 'role'],
            'education' => [EducationExperience::class, 'institution'],
            'personal' => [PersonalExperience::class, 'title'],
            'community' => [CommunityExperience::class, 'title'],
            'award' => [AwardExperience::class, 'title'],
        ];
    }

    // Adding or editing a skill leaves the index alone, since skills aren't searchable
    public function testUserSkillSavesDoNotRebuild()
    {
        $userSkill = UserSkill::factory()->make(['user_id' => $this->user->id]);

        $this->assertEquals(0, $this->countRebuilds(fn () => $userSkill->save()));
        $this->assertEquals(0, $this->countRebuilds(fn () => $userSkill->update(['top_skills_rank' => 1])));
    }

    // Editing an application only updates the index when its notes change
    public function testApplicationChangesOnlyRebuildForNotes()
    {
        $candidate = PoolCandidate::factory()->create(['user_id' => $this->user->id, 'notes' => null]);
        $candidate = PoolCandidate::findOrFail($candidate->id);

        $this->assertEquals(0, $this->countRebuilds(fn () => $candidate->forceFill(['is_flagged' => ! $candidate->is_flagged])->save()));

        $this->assertEquals(1, $this->countRebuilds(fn () => $candidate->forceFill(['notes' => 'Application note'])->save()));
        $this->assertTrue($this->isSearchable('Application note'));
    }
}
