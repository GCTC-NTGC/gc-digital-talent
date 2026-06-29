# Talent request sources

A talent request matches users through one or more **sources**. Each source is one way a user
can qualify (for example, being qualified in a pool). The sources are listed in the
`TalentRequestSource` enum.

For each source, a matched user carries:

- their name in the `sources` list, and
- the underlying records in a `matching<Source>Sources` field (e.g. `matchingQualifiedInPoolSources`).

Both the matches table (`talentRequestMatches`, root model `User`) and the tracked list
(`talentRequestTrackedUsers`, root model `TalentRequestTrackedUser`) read the same sources.

## The files

| File | Responsibility |
| --- | --- |
| `app/Enums/TalentRequestSource.php` | Lists the sources. `matchRelation()` maps each source to its User relation. `selected()` returns the sources a request queries. |
| `app/Traits/HasTalentRequestSources.php` | Used by `User`. Holds each source's match relation, `talentRequestSources()` (names matched), and `talentRequestSourceMatches()` (records matched). |
| `app/Builders/UserBuilder.php` | `whereMatchesTalentRequest()` keeps users matching at least one source; `withTalentRequestMatches()` loads each source's records. |
| The source's model (e.g. `app/Models/PoolCandidate.php`) | Each source's own `whereMatchesTalentRequest()` rule — what counts as a match. A query scope on the model, or a method on its builder class if the model already has one (`PoolCandidate` does; most models do not). |
| `app/Models/ApplicantFilter.php` | `toMatchFilters()` turns a saved filter into the array the match rules expect. |
| `app/Models/TalentRequestTrackedUser.php` | `sources` accessor and `scopeWithTalentRequestMatches()` reuse the User logic for the tracked list. |
| `app/GraphQL/Types/TalentRequestTrackedUser/MatchingSources.php` | Resolves the tracked list's `matching<Source>Sources` fields. |
| `api/graphql/schema.graphql` | The `sources` and `matching<Source>Sources` fields on `TalentRequestResult` and `TalentRequestTrackedUser`. |

## Adding a new source

Example: adding `AT_LEVEL`, backed by `CommunityInterest` records.

1. **Add the match rule** as a query scope on the source's model:
   `CommunityInterest::scopeWhereMatchesTalentRequest(Builder $query, array $filters)`.
   This decides whether a `CommunityInterest` satisfies the request's filter. Put it in a builder
   class instead only if that model already has one — `PoolCandidate` does, but most models, including
   `CommunityInterest`, keep their query methods as scopes on the model. The records also load with
   `whereAuthorizedToView`, so the model needs that scope too.

2. **Add the User relation** in `app/Traits/HasTalentRequestSources.php`:

   ```php
   /** @return HasMany<CommunityInterest, $this> */
   public function matchingAtLevelSources(): HasMany
   {
       return $this->hasMany(CommunityInterest::class);
   }
   ```

3. **Map the source to that relation** in `app/Enums/TalentRequestSource.php`:

   ```php
   self::AT_LEVEL => 'matchingAtLevelSources',
   ```

The `UserBuilder` loops, `talentRequestSources()`, the tracked accessor and resolver, and the
schema's `matchingAtLevelSources` fields already iterate over the sources, so they pick up the new
one with no further edits.

`ADVANCEMENT` is the same three steps, plus first defining a `User` → `TalentNominationGroup`
relation on `nominee_id`, which does not exist yet.

## Choosing which sources to query

A request may name a subset of sources in its filter's `talentSources`. `TalentRequestSource::selected($names)`
turns that into the sources to query:

- `null` or empty → every implemented source.
- a list of names → only those sources.

Both `UserBuilder` loops call `selected($filters['talentSources'] ?? null)`, so `talentSources`
decides which sources run. Unimplemented sources (no `matchRelation()`) are never returned.
