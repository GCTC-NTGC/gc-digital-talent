<?php

namespace Database\Factories;

use App\Enums\FlexibleWorkLocation;
use App\Enums\LanguageAbility;
use App\Enums\OperationalRequirement;
use App\Enums\PositionDuration;
use App\Enums\TalentRequestSource;
use App\Enums\WorkRegion;
use App\Models\ApplicantFilter;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Pool;
use App\Models\Skill;
use App\Models\WorkStream;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Collection;

class ApplicantFilterFactory extends BaseFactory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ApplicantFilter::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $community = $this->firstOrCreate(Community::class);

        return [
            'has_diploma' => $this->faker->boolean(),
            'has_disability' => $this->faker->boolean(),
            'is_indigenous' => $this->faker->boolean(),
            'is_visible_minority' => $this->faker->boolean(),
            'is_woman' => $this->faker->boolean(),
            'position_duration' => $this->faker->boolean() ? null : [PositionDuration::TEMPORARY->name], // null or request TEMPORARY
            'language_ability' => $this->faker->randomElement(array_column(LanguageAbility::cases(), 'name')),
            'location_preferences' => $this->faker->randomElements(
                array_column(WorkRegion::cases(), 'name'),
                $this->faker->numberBetween(1, 3)
            ),
            'flexible_work_locations' => array_merge(
                [FlexibleWorkLocation::ONSITE->name],
                $this->faker->randomElements(
                    [FlexibleWorkLocation::REMOTE->name, FlexibleWorkLocation::HYBRID->name],
                    $this->faker->numberBetween(0, 2)
                )
            ),
            'operational_requirements' => $this->faker->optional->randomElements(
                array_column(OperationalRequirement::cases(), 'name'),
                $this->faker->numberBetween(1, 4)
            ),
            'talent_sources' => $this->faker->optional->enums(
                TalentRequestSource::class,
                $this->faker->numberBetween(1, 3)
            ),
            'community_id' => $community->id,
        ];
    }

    /**
     * Create an ApplicantFilter where fields have a 50% chance to be null.
     *
     * @return Factory
     */
    public function sparse()
    {
        return $this->state(function (array $attributes) {
            $sparseAttributes = [];
            foreach ($attributes as $key => $value) {
                if ($this->faker->boolean(50)) {
                    $sparseAttributes[$key] = $value;
                }
            }

            return $sparseAttributes;
        });
    }

    /**
     * Create an ApplicantFilter where skills, classifications and pools have been added.
     * NOTE: before using this method, you must have already generated skills, classifications and Pools
     *
     * @return Factory
     */
    public function withRelationships(bool $sparse = false)
    {
        return $this->afterCreating(function (ApplicantFilter $filter) use ($sparse) {
            $minCount = $sparse ? 0 : 1;

            $filter->classifications()->saveMany(
                Classification::inRandomOrder()->limit($this->faker->numberBetween($minCount, 2))->get()
            );

            $filter->skills()->saveMany(
                Skill::inRandomOrder()->limit($this->faker->numberBetween($minCount, 2))->get()
            );

            $pools = $this->faker->boolean($sparse ? 50 : 100)
                ? collect([$this->existingOrNewPool($filter->community)])
                : collect();

            $filter->pools()->saveMany($pools);
            $filter->qualifiedInClassifications()->saveMany($pools->pluck('classification')->filter());
            $filter->qualifiedInWorkStreams()->saveMany($pools->pluck('workStream')->filter());
        });
    }

    /**
     * Find a published pool belonging to the given community, or create one if none exist.
     */
    private function existingOrNewPool(Community $community): Pool
    {
        return $community->pools()
            ->whereNotNull('published_at')
            ->inRandomOrder()
            ->firstOr(fn () => Pool::factory()->published()->for($community)->create());
    }

    /**
     * Create an ApplicantFilter with specific work streams
     *
     * @var Collection<array-key, WorkStream>
     *
     * @return Factory
     */
    public function withWorkStreams(array $workStreams)
    {
        return $this->afterCreating(function (ApplicantFilter $filter) use ($workStreams) {
            $filter->qualifiedInWorkStreams()->saveMany($workStreams);
        });
    }
}
