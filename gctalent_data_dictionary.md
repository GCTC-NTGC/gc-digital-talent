# GC Digital Talent — Data dictionary

**78 tables · 763 columns · 137 foreign key relationships**

> GC Digital Talent is the Government of Canada platform for managing recruitment pools, job postings, talent nominations, and applicant tracking across the federal public service. Data is bilingual (English/French stored as jsonb), uses UUIDs as primary keys, and soft-deletes via `deleted_at`.

---

## Tables

- [activity_log](#activity-log)
- [announcements](#announcements)
- [applicant_filter_classification](#applicant-filter-classification)
- [applicant_filter_pool](#applicant-filter-pool)
- [applicant_filter_qualified_classification](#applicant-filter-qualified-classification)
- [applicant_filter_skill](#applicant-filter-skill)
- [applicant_filter_work_stream](#applicant-filter-work-stream)
- [applicant_filters](#applicant-filters)
- [assessment_results](#assessment-results)
- [assessment_step_pool_skill](#assessment-step-pool-skill)
- [assessment_steps](#assessment-steps)
- [award_experiences](#award-experiences)
- [classification_community_development_program](#classification-community-development-program)
- [classification_development_program](#classification-development-program)
- [classification_pool_candidate_filter](#classification-pool-candidate-filter)
- [classifications](#classifications)
- [communities](#communities)
- [community_development_program](#community-development-program)
- [community_development_program_talent_nomination](#community-development-program-talent-nomination)
- [community_development_program_talent_nomination_event](#community-development-program-talent-nomination-event)
- [community_experiences](#community-experiences)
- [community_interest_work_stream](#community-interest-work-stream)
- [community_interests](#community-interests)
- [department_user_career_objective](#department-user-career-objective)
- [department_user_next_role](#department-user-next-role)
- [departments](#departments)
- [development_program_interests](#development-program-interests)
- [development_program_talent_nomination](#development-program-talent-nomination)
- [development_program_talent_nomination_event](#development-program-talent-nomination-event)
- [development_program_user](#development-program-user)
- [development_programs](#development-programs)
- [education_experiences](#education-experiences)
- [experience_skill](#experience-skill)
- [failed_jobs](#failed-jobs)
- [general_question_responses](#general-question-responses)
- [general_questions](#general-questions)
- [generic_job_title_user](#generic-job-title-user)
- [generic_job_titles](#generic-job-titles)
- [job_poster_template_skill](#job-poster-template-skill)
- [job_poster_templates](#job-poster-templates)
- [jobs](#jobs)
- [migrations](#migrations)
- [notifications](#notifications)
- [off_platform_recruitment_processes](#off-platform-recruitment-processes)
- [permission_role](#permission-role)
- [permission_user](#permission-user)
- [permissions](#permissions)
- [personal_experiences](#personal-experiences)
- [pool_candidate_education_requirement_experience](#pool-candidate-education-requirement-experience)
- [pool_candidate_filters](#pool-candidate-filters)
- [pool_candidate_search_requests](#pool-candidate-search-requests)
- [pool_candidate_user_bookmarks](#pool-candidate-user-bookmarks)
- [pool_candidates](#pool-candidates)
- [pool_pool_candidate_filter](#pool-pool-candidate-filter)
- [pool_skill](#pool-skill)
- [pool_user_bookmarks](#pool-user-bookmarks)
- [pools](#pools)
- [role_user](#role-user)
- [roles](#roles)
- [screening_question_responses](#screening-question-responses)
- [screening_questions](#screening-questions)
- [skill_families](#skill-families)
- [skill_skill_family](#skill-skill-family)
- [skill_talent_nomination](#skill-talent-nomination)
- [skills](#skills)
- [talent_nomination_events](#talent-nomination-events)
- [talent_nomination_groups](#talent-nomination-groups)
- [talent_nominations](#talent-nominations)
- [teams](#teams)
- [training_opportunities](#training-opportunities)
- [user_search_indices](#user-search-indices)
- [user_skills](#user-skills)
- [user_work_stream_career_objective](#user-work-stream-career-objective)
- [user_work_stream_next_role](#user-work-stream-next-role)
- [users](#users)
- [work_experience_work_stream](#work-experience-work-stream)
- [work_experiences](#work-experiences)
- [work_streams](#work-streams)

---

## activity_log

Audit log of system events, tracking who did what and to which record. Used for change history, debugging, and compliance. Powered by the Spatie Laravel Activity Log package.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this log entry. |  |  |
| `log_name` | Named channel for the log (e.g. 'default'). |  | Enum `ActivityLog` (stored lowercase): default, process |
| `description` | Human-readable description of the event (e.g. 'created', 'updated'). |  | Not null |
| `subject_type` | The model class that was acted upon (e.g. App\Models\Pool). |  |  |
| `subject_id` | UUID of the specific record that was acted upon. |  |  |
| `causer_type` | The model class of the actor who triggered the event. |  |  |
| `causer_id` | UUID of the user or system actor who triggered the event. |  |  |
| `properties` | JSON snapshot of the before/after attribute values involved in the change. |  |  |
| `created_at` | Timestamp when the log entry was created. |  |  |
| `updated_at` | Timestamp when the log entry was last updated. |  |  |
| `event` | The type of event (e.g. 'created', 'updated', 'deleted'). |  | Enum `ActivityEvent` (stored lowercase): CREATED, UPDATED, DELETED, SUBMITTED, QUALIFIED, DISQUALIFIED, PLACED, ADDED, REMOVED, REINSTATED, REVERTED, PUBLISHED, SPECIAL_APPLICATION_CREATED, SPECIAL_APPLICATION_SUBMITTED |
| `batch_uuid` | Groups related log entries that occurred in the same batch operation. |  | Column dropped by 2026_05_21 activity_log v5 upgrade |

---

## announcements

Platform-wide announcements displayed to users in the application UI, such as maintenance notices or feature updates. Supports scheduling and dismissal.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the announcement. |  |  |
| `key` | Unique machine-readable slug for the announcement. |  | Unique; only `sitewide_announcement` is used |
| `title` | Bilingual (EN/FR) title text shown as the announcement headline. |  | Bilingual: en and fr both required |
| `message` | Bilingual (EN/FR) body text of the announcement. |  | Bilingual: en and fr both required |
| `is_enabled` | Whether the announcement is currently active and visible. |  | Default false |
| `is_dismissible` | Whether users can permanently dismiss this announcement. |  | Default false |
| `publish_date` | Date and time when the announcement becomes visible. |  | Required (via mutation) |
| `expiry_date` | Date and time when the announcement stops being shown. |  | Required (via mutation); must be after publish_date |
| `created_at` | Timestamp when the announcement was created. |  |  |
| `updated_at` | Timestamp when the announcement was last modified. |  |  |

---

## applicant_filter_classification

Junction table linking an applicant filter to one or more GC job classifications (e.g. EC-06, CS-03). Allows filtering applicants by their target or current classification.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this filter-classification link. |  |  |
| `created_at` | Timestamp when the link was created. |  |  |
| `updated_at` | Timestamp when the link was last modified. |  |  |
| `applicant_filter_id` | FK to the parent applicant_filters record. | FK → `applicant_filters.id` |  |
| `classification_id` | FK to the classification being filtered on. | FK → `classifications.id` | Unique per (applicant_filter_id, classification_id) |

---

## applicant_filter_pool

Junction table linking an applicant filter to specific recruitment pools, allowing managers to restrict a talent search to candidates from certain pools.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this filter-pool link. |  |  |
| `created_at` | Timestamp when the link was created. |  |  |
| `updated_at` | Timestamp when the link was last modified. |  |  |
| `applicant_filter_id` | FK to the parent applicant_filters record. | FK → `applicant_filters.id` |  |
| `pool_id` | FK to the pool being included in the filter. | FK → `pools.id` | Unique per (applicant_filter_id, pool_id) |

---

## applicant_filter_qualified_classification

Junction table linking an applicant filter to classifications the applicant must be qualified at (as opposed to their current classification). Used to find candidates pre-qualified at a target level.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `created_at` | Timestamp when the link was created. |  |  |
| `updated_at` | Timestamp when the link was last modified. |  |  |
| `applicant_filter_id` | FK to the parent applicant_filters record. | FK → `applicant_filters.id` |  |
| `classification_id` | FK to the required qualified classification. | FK → `classifications.id` | Unique per (applicant_filter_id, classification_id) |

---

## applicant_filter_skill

Junction table linking an applicant filter to required skills. Allows managers to search for candidates who possess specific skills.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this filter-skill link. |  |  |
| `created_at` | Timestamp when the link was created. |  |  |
| `updated_at` | Timestamp when the link was last modified. |  |  |
| `applicant_filter_id` | FK to the parent applicant_filters record. | FK → `applicant_filters.id` |  |
| `skill_id` | FK to the required skill. | FK → `skills.id` | Unique per (applicant_filter_id, skill_id) |

---

## applicant_filter_work_stream

Junction table linking an applicant filter to work streams (functional specializations within a community). Cascades on delete.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this filter-work-stream link. |  |  |
| `applicant_filter_id` | FK to the parent applicant_filters record. | FK → `applicant_filters.id` |  |
| `work_stream_id` | FK to the targeted work stream. | FK → `work_streams.id` |  |

---

## applicant_filters

Stores the search criteria used by managers and HR advisors when searching for pool candidates. Acts as a reusable filter configuration attached to candidate search requests.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this filter set. |  |  |
| `created_at` | Timestamp when the filter was created. |  |  |
| `updated_at` | Timestamp when the filter was last modified. |  |  |
| `has_diploma` | Filter: candidate must have a post-secondary diploma. |  |  |
| `has_disability` | Filter: candidate has declared a disability (employment equity). |  |  |
| `is_indigenous` | Filter: candidate has self-identified as Indigenous. |  |  |
| `is_visible_minority` | Filter: candidate has self-identified as a visible minority. |  |  |
| `is_woman` | Filter: candidate has self-identified as a woman. |  |  |
| `language_ability` | Filter: required language profile (e.g. bilingual, English essential). |  | Enum `LanguageAbility`: ENGLISH, FRENCH, BILINGUAL |
| `location_preferences` | JSON array of preferred work locations. |  | Array of `WorkRegion`: TELEWORK, NATIONAL_CAPITAL, ATLANTIC, QUEBEC, ONTARIO, PRAIRIE, BRITISH_COLUMBIA, NORTH |
| `operational_requirements` | JSON array of operational conditions the candidate accepts. |  | Array of `OperationalRequirement`: SHIFT_WORK, ON_CALL, TRAVEL, TRANSPORT_EQUIPMENT, DRIVERS_LICENSE, OVERTIME_OCCASIONAL, OVERTIME_REGULAR |
| `position_duration` | JSON array of acceptable position durations (indeterminate, term, etc.). |  | Array of `PositionDuration`: TEMPORARY, PERMANENT |
| `qualified_streams` | JSON array of work streams the candidate must be qualified in. |  | Not null, default []; legacy column, not exposed in GraphQL |
| `community_id` | FK to the community (functional group) being searched within. | FK → `communities.id` | Not null |
| `flexible_work_locations` | JSON array of flexible/remote work location preferences. |  | Array of `FlexibleWorkLocation`: REMOTE, HYBRID, ONSITE; default [] |

**Referenced by:** `applicant_filter_classification.applicant_filter_id`, `applicant_filter_pool.applicant_filter_id`, `applicant_filter_qualified_classification.applicant_filter_id`, `applicant_filter_skill.applicant_filter_id`, `applicant_filter_work_stream.applicant_filter_id`, `pool_candidate_search_requests.applicant_filter_id`

---

## assessment_results

Records the outcome of assessing a pool candidate against a specific skill at a specific assessment step. Captures both the decision and supporting justification.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this assessment result. |  |  |
| `created_at` | Timestamp when the result was recorded. |  |  |
| `updated_at` | Timestamp when the result was last updated. |  |  |
| `assessment_step_id` | FK to the assessment step where this evaluation took place. | FK → `assessment_steps.id` | Step, candidate and pool skill must all belong to the same pool |
| `pool_candidate_id` | FK to the candidate being assessed. | FK → `pool_candidates.id` |  |
| `pool_skill_id` | FK to the specific skill being assessed. | FK → `pool_skill.id` | Required when assessment_result_type = SKILL |
| `assessment_result_type` | Whether this is an education, skill, or other result type. |  | Enum `AssessmentResultType`: EDUCATION, SKILL; unique per (assessment_step_id, pool_candidate_id, pool_skill_id, assessment_result_type) |
| `assessment_decision` | The decision outcome (e.g. successful, unsuccessful, hold). |  | Enum `AssessmentDecision`: HOLD, SUCCESSFUL, UNSUCCESSFUL |
| `justifications` | JSON array of reasons or evidence supporting the decision. |  | Array of `AssessmentResultJustification`: EDUCATION_ACCEPTED_INFORMATION, EDUCATION_ACCEPTED_WORK_EXPERIENCE_EQUIVALENCY, EDUCATION_ACCEPTED_COMBINATION_EDUCATION_WORK_EXPERIENCE, EDUCATION_FAILED_NOT_RELEVANT, EDUCATION_FAILED_REQUIREMENT_NOT_MET, SKILL_FAILED_INSUFFICIENTLY_DEMONSTRATED, FAILED_NOT_ENOUGH_INFORMATION, FAILED_OTHER; EDUCATION_* only for EDUCATION type, SKILL_* only for SKILL type |
| `assessment_decision_level` | Granularity of the decision (e.g. at the pool or step level). |  | Enum `AssessmentDecisionLevel`: AT_REQUIRED, ABOVE_REQUIRED, ABOVE_AND_BEYOND_REQUIRED; only allowed when type = SKILL and decision = SUCCESSFUL |
| `skill_decision_notes` | Free-text notes from the assessor on the skill evaluation. |  |  |

---

## assessment_step_pool_skill

Junction table linking assessment steps to the pool skills being evaluated at that step. Defines which skills are assessed at which stage of the selection process.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this step-skill link. |  |  |
| `assessment_step_id` | FK to the assessment step. | FK → `assessment_steps.id` |  |
| `pool_skill_id` | FK to the pool skill being evaluated at this step. | FK → `pool_skill.id` | Pool skill must belong to the same pool as the assessment step |
| `created_at` | Timestamp when the link was created. |  |  |
| `updated_at` | Timestamp when the link was last modified. |  |  |

---

## assessment_steps

Defines the ordered stages of a pool's assessment process (e.g. application review, written exam, interview). Each step can assess different skills.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this assessment step. |  |  |
| `pool_id` | FK to the recruitment pool this step belongs to. | FK → `pools.id` |  |
| `sort_order` | Numeric order of this step within the pool's assessment process. |  | Unique per (pool_id, sort_order), deferrable; set automatically: APPLICATION_SCREENING = 1, SCREENING_QUESTIONS_AT_APPLICATION = 2, others appended |
| `type` | Type of assessment (e.g. screening, written test, interview). |  | Enum `AssessmentStepType`: SCREENING_QUESTIONS_AT_APPLICATION, TECHNICAL_EXAM_AT_SITE, TECHNICAL_EXAM_AT_HOME, PSC_EXAM, INTERVIEW_GROUP, INTERVIEW_INDIVIDUAL, INTERVIEW_FOLLOWUP, REFERENCE_CHECK, APPLICATION_SCREENING, ADDITIONAL_ASSESSMENT; APPLICATION_SCREENING cannot be set via create/update mutations |
| `title` | Bilingual label for this assessment step. |  | Bilingual (en, fr); default empty strings |
| `created_at` | Timestamp when the step was created. |  |  |
| `updated_at` | Timestamp when the step was last modified. |  |  |

**Referenced by:** `assessment_results.assessment_step_id`, `assessment_step_pool_skill.assessment_step_id`, `pool_candidates.assessment_step_id`, `screening_questions.assessment_step_id`

---

## award_experiences

Applicant-reported awards, recognitions, or honours on their GC Talent profile. Used as evidence of skills and competencies.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this award experience. |  |  |
| `user_id` | FK to the user who received the award. | FK → `users.id` |  |
| `title` | Name or title of the award or recognition. |  | Cannot be empty if provided |
| `issued_by` | Organization or body that issued the award. |  | Cannot be empty if provided |
| `awarded_date` | Date the award was received. |  | Cannot be empty if provided; must be today or earlier |
| `awarded_to` | Scope of who received the award (individual, team, organization). |  | Enum `AwardedTo`: ME, MY_TEAM, MY_PROJECT, MY_ORGANIZATION |
| `awarded_scope` | Level or breadth of the award (local, national, international). |  | Enum `AwardedScope`: INTERNATIONAL, NATIONAL, PROVINCIAL, LOCAL, COMMUNITY, ORGANIZATIONAL, SUB_ORGANIZATIONAL |
| `details` | Additional context or description of the award. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `deleted_at` | Soft-delete timestamp; null means the record is active. |  |  |

---

## classification_community_development_program

Junction table linking GC job classifications to community-specific development programs, defining which classifications are eligible for which programs within a community.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `classification_id` | FK to the eligible classification. | FK → `classifications.id` |  |
| `community_development_program_id` | FK to the community development program. | FK → `community_development_program.id` | Unique per (classification_id, community_development_program_id) |

---

## classification_development_program

Junction table linking GC job classifications to platform-wide development programs, defining eligibility criteria by classification.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `classification_id` | FK to the eligible classification. | FK → `classifications.id` |  |
| `development_program_id` | FK to the development program. | FK → `development_programs.id` | Unique per (classification_id, development_program_id) |

---

## classification_pool_candidate_filter

Junction table linking pool candidate filters (legacy search filters) to classifications. Allows filtering candidate search results by job classification.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `created_at` | Timestamp when the link was created. |  |  |
| `updated_at` | Timestamp when the link was last modified. |  |  |
| `pool_candidate_filter_id` | FK to the pool candidate filter. | FK → `pool_candidate_filters.id` |  |
| `classification_id` | FK to the classification being filtered on. | FK → `classifications.id` |  |

---

## classifications

Reference table of GC occupational group and level classifications (e.g. EC-06, CS-03, AS-04). Used across pools, users, work experiences, and nominations to define seniority and salary bands.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the classification. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `name` | Bilingual display name for the classification. |  | Not null; bilingual (en, fr) |
| `group` | Occupational group code (e.g. EC, CS, AS, PE). |  | Not null |
| `level` | Numeric level within the group (e.g. 1, 2, 3, 06). |  | Not null; must be >= 0 (DB CHECK); cannot be changed via update mutation |
| `min_salary` | Minimum annual salary for this classification. |  | Must be >= 0 (DB CHECK) |
| `max_salary` | Maximum annual salary for this classification. |  | Must be >= 0 and >= min_salary (DB CHECK) |
| `deleted_at` | Soft-delete timestamp; null means the classification is active. |  |  |
| `is_available_in_search` | Whether this classification appears in search filters. |  | Not null, default false |

**Referenced by:** `applicant_filter_classification.classification_id`, `applicant_filter_qualified_classification.classification_id`, `classification_community_development_program.classification_id`, `classification_development_program.classification_id`, `classification_pool_candidate_filter.classification_id`, `generic_job_titles.classification_id`, `job_poster_templates.classification_id`, `off_platform_recruitment_processes.classification_id`, `pools.classification_id`, `talent_nominations.advancement_reference_fallback_classification_id`, `talent_nominations.nominator_fallback_classification_id`, `users.career_objective_classification_id`, `users.computed_classification`, `users.next_role_classification_id`, `work_experiences.classification_id`

---

## communities

Functional communities within the GC (e.g. Data Science, Digital, Finance). Communities group related work streams, pools, and development programs, and serve as the primary organizing unit for talent management.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the community. |  |  |
| `created_at` | Timestamp when the community was created. |  |  |
| `updated_at` | Timestamp when the community was last modified. |  |  |
| `key` | Machine-readable unique slug for the community. |  | Not null; unique |
| `name` | Bilingual display name of the community. |  | Bilingual: en and fr required together |
| `description` | Bilingual description of the community's mandate and focus. |  | Bilingual: en and fr required together |
| `mandate_authority` | The GC body or authority responsible for this community. |  | Bilingual: en and fr required together |
| `information_url` | Link to external information about the community. |  | Bilingual: en and fr required together; must be http/https URLs |
| `contact_email` | Contact email address for the community team. |  |  |

**Referenced by:** `applicant_filters.community_id`, `community_development_program.community_id`, `community_interests.community_id`, `development_programs.community_id`, `pool_candidate_search_requests.community_id`, `pools.community_id`, `talent_nomination_events.community_id`, `users.career_objective_community_id`, `users.next_role_community_id`, `work_streams.community_id`

---

## community_development_program

Links a development program to a specific community, indicating that the program is offered or managed within that community context. Supports soft-delete.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this community-program link. |  |  |
| `created_at` | Timestamp when the link was created. |  |  |
| `updated_at` | Timestamp when the link was last modified. |  |  |
| `community_id` | FK to the community offering the program. | FK → `communities.id` |  |
| `development_program_id` | FK to the development program. | FK → `development_programs.id` | Unique per (community_id, development_program_id); soft-deleted rows are restored rather than recreated |
| `deleted_at` | Soft-delete timestamp; null means the link is active. |  |  |

**Referenced by:** `classification_community_development_program.community_development_program_id`, `community_development_program_talent_nomination.community_development_program_id`, `community_development_program_talent_nomination_event.community_development_program_id`, `development_program_interests.community_development_program_id`

---

## community_development_program_talent_nomination

Junction table linking a talent nomination to a specific community development program, recording that a nominee has been nominated for a community-run program.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `community_development_program_id` | FK to the community development program. | FK → `community_development_program.id` |  |
| `talent_nomination_id` | FK to the talent nomination. | FK → `talent_nominations.id` | Unique per (community_development_program_id, talent_nomination_id) |

---

## community_development_program_talent_nomination_event

Links a community development program to a talent nomination event, and stores the program-specific description shown to nominators for that event.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `community_development_program_id` | FK to the community development program. | FK → `community_development_program.id` | Must belong to the same community as the talent nomination event |
| `talent_nomination_event_id` | FK to the talent nomination event. | FK → `talent_nomination_events.id` | Unique per (community_development_program_id, talent_nomination_event_id) |
| `description_for_nominations` | Custom bilingual description shown to nominators for this program at this event. |  | Bilingual (en, fr); default empty strings |

---

## community_experiences

Applicant-reported volunteer, community, or civic experiences on their GC Talent profile. Captures unpaid or non-employment activities that demonstrate skills.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this experience. |  |  |
| `user_id` | FK to the user who had this experience. | FK → `users.id` |  |
| `title` | Role or title held during the experience. |  |  |
| `organization` | Name of the organization or group. |  |  |
| `project` | Specific project or initiative the user contributed to. |  |  |
| `start_date` | Date when the experience began. |  |  |
| `end_date` | Date when the experience ended; null if ongoing. |  |  |
| `details` | Free-text description of the experience and contributions. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `deleted_at` | Soft-delete timestamp; null means the record is active. |  |  |

---

## community_interest_work_stream

Junction table recording which work streams a user is interested in within a community. Part of the user's community interest profile.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `community_interest_id` | FK to the user's community interest record. | FK → `community_interests.id` |  |
| `work_stream_id` | FK to the work stream the user is interested in. | FK → `work_streams.id` | Unique per (community_interest_id, work_stream_id); work stream must belong to the interest's community |

---

## community_interests

Records a user's expressed interest in a specific community, including whether they want jobs, training, or development opportunities. Also captures community-specific profile fields (e.g. Finance Chief, Procurement SDO).

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this community interest record. |  |  |
| `user_id` | FK to the interested user. | FK → `users.id` |  |
| `community_id` | FK to the community they are interested in. | FK → `communities.id` | Unique per (user_id, community_id) |
| `job_interest` | Whether the user is interested in job opportunities in this community. |  |  |
| `training_interest` | Whether the user wants training opportunities from this community. |  |  |
| `additional_information` | Free-text notes the user wants to share with the community. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `finance_is_chief` | Finance-specific: whether the user is currently a Chief-level finance officer. |  | Only allowed when community key is `finance` |
| `additional_duties` | Community-specific additional roles or responsibilities. |  | Array of `CommunityInterestAdditionalDuty`: CORPORATE_COMMUNICATIONS, FACILITIES_MANAGEMENT_AND_SECURITY, HUMAN_RESOURCES, INFORMATION_TECHNOLOGY, MATERIEL_MANAGEMENT, PROCUREMENT, PROJECT_MANAGEMENT, REAL_PROPERTY_MANAGEMENT; distinct values; only allowed for `finance` or `procurement` communities |
| `finance_other_roles` | Finance-specific: other finance roles held by the user. |  | Array of `FinanceChiefRole`: CHIEF_SECURITY_OFFICER, CHIEF_INFORMATION_OFFICER, HEAD_OF_HUMAN_RESOURCES, HEAD_OF_PROCUREMENT, OTHER; distinct values; only allowed for `finance` community |
| `finance_other_roles_other` | Finance-specific: free-text for other finance roles not in the standard list. |  | Required if finance_other_roles includes OTHER; only allowed for `finance` community |
| `consent_to_share_profile` | Whether the user consents to sharing their profile with the community. |  | Must be true (accepted) when creating/updating via API; DB default false |
| `procurement_is_sdo` | Procurement-specific: whether the user is a Departmental Security Officer. |  | Only allowed when community key is `procurement` |

**Referenced by:** `community_interest_work_stream.community_interest_id`, `development_program_interests.community_interest_id`

---

## department_user_career_objective

Junction table recording which GC departments a user is targeting as part of their career objective (long-term career goal). Multiple departments can be listed.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `user_id` | FK to the user. | FK → `users.id` |  |
| `department_id` | FK to the target department. | FK → `departments.id` |  |

---

## department_user_next_role

Junction table recording which GC departments a user is targeting for their next role (short-term move). Multiple departments can be listed.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `user_id` | FK to the user. | FK → `users.id` |  |
| `department_id` | FK to the target department. | FK → `departments.id` |  |

---

## departments

Reference table of GC departments and agencies (e.g. Treasury Board, DND, PSC). Used across pools, work experiences, nominations, and user profiles to identify organizational affiliation.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the department. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `department_number` | Official GC department number. |  | Unique; NOT NULL |
| `name` | Bilingual official name of the department or agency. |  | Localized JSON (en, fr); NOT NULL, defaults to empty strings |
| `deleted_at` | Soft-delete timestamp; null means the department is active. |  |  |
| `org_identifier` | Short code or acronym identifying the organization. |  | Required on create |
| `size` | Approximate size category of the department. |  | Enum `DepartmentSize`: MICRO, SMALL, MEDIUM, LARGE; required on create |
| `is_core_public_administration` | Whether the department is part of the core public administration (Schedule I). |  | Required on create; default false |
| `is_central_agency` | Whether this is a central agency (e.g. TBS, PCO, Finance). |  | Required on create; default false |
| `is_science` | Whether this is a science-based department or agency. |  | Required on create; default false |
| `is_regulatory` | Whether this is a regulatory body. |  | Required on create; default false |
| `archived_at` | Timestamp when the department was archived (no longer active). |  | When set, department can no longer be connected to pools, nominations, etc. (`DepartmentNotArchived` rule) |

**Referenced by:** `department_user_career_objective.department_id`, `department_user_next_role.department_id`, `off_platform_recruitment_processes.department_id`, `pool_candidate_search_requests.department_id`, `pool_candidates.placed_department_id`, `pools.department_id`, `talent_nominations.advancement_reference_fallback_department_id`, `talent_nominations.nominator_fallback_department_id`, `users.computed_department`, `work_experiences.department_id`

---

## development_program_interests

Records a user's interest or participation in a specific development program, linked through their community interest. Tracks participation status and completion.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this interest record. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `development_program_id` | FK to the development program. | FK → `development_programs.id` | Unique per (development_program_id, community_interest_id); nullable since community_development_program_id was added |
| `community_interest_id` | FK to the user's community interest driving this program interest. | FK → `community_interests.id` |  |
| `participation_status` | Current status (e.g. interested, applied, participating, completed). |  | Enum `DevelopmentProgramParticipationStatus`: NOT_INTERESTED, INTERESTED, ENROLLED, COMPLETED |
| `completion_date` | Date the user completed the program, if applicable. |  |  |
| `community_development_program_id` | FK to the community-specific program offering. | FK → `community_development_program.id` | NOT NULL |

---

## development_program_talent_nomination

Junction table linking a talent nomination to a development program, recording that the nominee is being nominated for a specific development program.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `development_program_id` | FK to the development program. | FK → `development_programs.id` |  |
| `talent_nomination_id` | FK to the talent nomination. | FK → `talent_nominations.id` | Unique per (development_program_id, talent_nomination_id) |

---

## development_program_talent_nomination_event

Junction table linking development programs to talent nomination events, defining which programs are available for nomination within a given event.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `development_program_id` | FK to the development program (part of composite key). | FK → `development_programs.id` |  |
| `talent_nomination_event_id` | FK to the talent nomination event (part of composite key). | FK → `talent_nomination_events.id` |  |

---

## development_program_user

Records a user's direct enrollment or participation in a development program, optionally linked to a supporting education experience. Tracks status and completion.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this enrollment record. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `development_program_id` | FK to the development program. | FK → `development_programs.id` |  |
| `user_id` | FK to the participating user. | FK → `users.id` | Unique per (development_program_id, user_id) |
| `education_experience_id` | FK to an education experience linked to this program (optional). | FK → `education_experiences.id` | Must be one of the same user's education experiences |
| `participation_status` | Current participation status (e.g. enrolled, completed, withdrawn). |  | Enum `DevelopmentProgramParticipationStatus`: NOT_INTERESTED, INTERESTED, ENROLLED, COMPLETED |
| `completion_date` | Date the user completed the program, if applicable. |  |  |

---

## development_programs

Catalogue of GC talent development programs (e.g. leadership programs, interchange programs) offered within communities. Includes descriptions for both applicant profiles and nomination forms.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the development program. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `name` | Bilingual display name of the program. |  | Localized JSON (en, fr); NOT NULL |
| `description_for_profile` | Bilingual description shown to users on their profile page. |  | Localized JSON (en, fr); NOT NULL |
| `description_for_nominations` | Bilingual description shown to nominators on nomination forms. |  | Deprecated; replaced by description on community_development_program_talent_nomination_event |
| `community_id` | FK to the community that owns or sponsors this program. | FK → `communities.id` |  |
| `information_url` | Link to external information about the program. |  | Localized URL (http/https); if en or fr is given, both are required |
| `abbreviation` | Short bilingual abbreviation for the program (e.g. FLDP, CSPS). |  | Localized; if en or fr is given, both are required |

**Referenced by:** `classification_development_program.development_program_id`, `community_development_program.development_program_id`, `development_program_interests.development_program_id`, `development_program_talent_nomination.development_program_id`, `development_program_talent_nomination_event.development_program_id`, `development_program_user.development_program_id`

---

## education_experiences

Applicant-reported educational credentials on their GC Talent profile, including degrees, diplomas, and certifications. Used to verify education requirements and demonstrate skills.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this education experience. |  |  |
| `user_id` | FK to the user who completed the education. | FK → `users.id` |  |
| `institution` | Name of the educational institution. |  | Cannot be empty if provided |
| `area_of_study` | Field, major, or subject area studied. |  | Required for DEGREE_DIPLOMA_CERTIFICATE (except HIGH_SCHOOL) and INDIVIDUAL_COURSE; prohibited for HIGH_SCHOOL, LICENSE_ACCREDITATION, PROFESSIONAL_CERTIFICATION |
| `thesis_title` | Title of thesis or major research project, if applicable. |  | Only allowed for DEGREE_DIPLOMA_CERTIFICATE with degree MASTERS_DEGREE or PHD |
| `start_date` | Date when the program of study began. |  | Required, except prohibited when status DID_NOT_COMPLETE for license/certification types; must be today or earlier (today or later for in-progress license/certification) |
| `end_date` | Date when the program of study ended; null if ongoing. |  | Must be on or after start_date; required unless IN_PROGRESS (non-license/certification types); prohibited when IN_PROGRESS; cannot be in future for non-license/certification types |
| `type` | Type of credential (e.g. bachelor's, master's, diploma, certificate). |  |  |
| `status` | Completion status (e.g. completed, in progress). |  | Enum `EducationStatus`: SUCCESS_CREDENTIAL, SUCCESS_NO_CREDENTIAL, IN_PROGRESS, AUDITED, DID_NOT_COMPLETE, SUCCESS (AUDITED not accepted by API); cannot be empty if provided |
| `details` | Additional context or description of the educational experience. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `deleted_at` | Soft-delete timestamp; null means the record is active. |  |  |

**Referenced by:** `development_program_user.education_experience_id`

---

## experience_skill

Links a specific experience (work, education, community, award, or personal) to a skill the applicant claims it demonstrates. Allows applicants to justify skill claims with concrete evidence.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this experience-skill link. |  |  |
| `details` | Free-text explanation of how this experience demonstrates the skill. |  |  |
| `experience_id` | UUID of the experience record (polymorphic — see experience_type). |  |  |
| `created_at` | Timestamp when the link was created. |  |  |
| `updated_at` | Timestamp when the link was last modified. |  |  |
| `user_skill_id` | FK to the user_skills record for the skill being justified. | FK → `user_skills.id` | Unique per (user_skill_id, experience_id) |
| `deleted_at` | Soft-delete timestamp; null means the link is active. |  |  |
| `experience_type` | Model class of the experience (e.g. WorkExperience, EducationExperience). |  | NOT NULL; Eloquent morph class name, one of App\Models\AwardExperience, CommunityExperience, EducationExperience, PersonalExperience, WorkExperience |

---

## failed_jobs

Laravel queue worker table storing jobs that failed during background processing. Used for debugging and retry workflows.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Auto-incrementing identifier for the failed job. |  |  |
| `uuid` | Unique UUID for the failed job. |  | Unique |
| `connection` | Queue connection name (e.g. database, redis). |  |  |
| `queue` | Name of the queue the job was on. |  |  |
| `payload` | Serialized job payload including class name and data. |  |  |
| `exception` | Full exception trace from the job failure. |  |  |
| `failed_at` | Timestamp when the job failed. |  |  |

---

## general_question_responses

Stores applicant answers to general (non-screening) questions attached to a pool application. These are open-ended questions that do not gate advancement.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this response. |  |  |
| `pool_candidate_id` | FK to the pool candidate (application) this response belongs to. | FK → `pool_candidates.id` |  |
| `general_question_id` | FK to the question being answered. | FK → `general_questions.id` | Unique per (pool_candidate_id, general_question_id); question must belong to the application's pool; all pool questions must be answered to submit |
| `answer` | The applicant's free-text answer. |  | Required (NOT NULL) |
| `created_at` | Timestamp when the response was created. |  |  |
| `updated_at` | Timestamp when the response was last modified. |  |  |

---

## general_questions

Optional open-ended questions added by pool administrators to a job advertisement. Responses are collected but do not screen out applicants.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the question. |  |  |
| `pool_id` | FK to the pool this question is associated with. | FK → `pools.id` |  |
| `sort_order` | Display order of the question in the application form. |  |  |
| `question` | Bilingual question text shown to applicants. |  | Localized JSON (en, fr); required (NOT NULL) |
| `deleted_at` | Soft-delete timestamp; null means the question is active. |  |  |
| `created_at` | Timestamp when the question was created. |  |  |
| `updated_at` | Timestamp when the question was last modified. |  |  |

**Referenced by:** `general_question_responses.general_question_id`

---

## generic_job_title_user

Links users to standardized generic job titles that describe their current or target role in plain language (e.g. 'Data Scientist', 'Policy Analyst'). Supports soft-delete.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this user-title link. |  |  |
| `created_at` | Timestamp when the link was created. |  |  |
| `updated_at` | Timestamp when the link was last modified. |  |  |
| `deleted_at` | Soft-delete timestamp; null means the link is active. |  |  |
| `generic_job_title_id` | FK to the generic job title. | FK → `generic_job_titles.id` |  |
| `user_id` | FK to the user. | FK → `users.id` | Unique per (generic_job_title_id, user_id) |

---

## generic_job_titles

Reference table of standardized plain-language job titles (e.g. 'Data Scientist', 'Cloud Architect') mapped to GC classifications. Allows users to self-identify with a recognizable role title rather than a classification code.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the generic job title. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `deleted_at` | Soft-delete timestamp; null means the title is active. |  |  |
| `key` | Machine-readable slug for the title. |  | Unique; Enum `GenericJobTitleKey`: TECHNICIAN_IT01, ANALYST_IT02, TEAM_LEADER_IT03, TECHNICAL_ADVISOR_IT03, SENIOR_ADVISOR_IT04, MANAGER_IT04, DIGITAL_LEADER_EX_03 |
| `name` | Bilingual plain-language display name. |  | Localized JSON (en, fr); NOT NULL, defaults to empty strings |
| `classification_id` | FK to the GC classification this title maps to. | FK → `classifications.id` |  |

**Referenced by:** `generic_job_title_user.generic_job_title_id`

---

## job_poster_template_skill

Junction table linking a job poster template to required skills, specifying whether each skill is essential or asset and the expected proficiency level.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this template-skill link. |  |  |
| `job_poster_template_id` | FK to the job poster template. | FK → `job_poster_templates.id` |  |
| `skill_id` | FK to the skill. | FK → `skills.id` |  |
| `type` | Whether this skill is essential or an asset for the role. |  | Enum `PoolSkillType`: ESSENTIAL, NONESSENTIAL |
| `required_skill_level` | Expected proficiency level (e.g. beginner, intermediate, advanced, lead). |  | Enum `SkillLevel`: BEGINNER, INTERMEDIATE, ADVANCED, LEAD; required if type ESSENTIAL, must be null if NONESSENTIAL |

---

## job_poster_templates

Reusable templates for job advertisements, pre-populated with role descriptions, tasks, and skills for a given classification and work stream. Administrators use these as starting points when creating new pools.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the template. |  |  |
| `created_at` | Timestamp when the template was created. |  |  |
| `updated_at` | Timestamp when the template was last modified. |  |  |
| `reference_id` | External reference identifier for the template. |  | Required; unique (enforced by API validator, not DB) |
| `supervisory_status` | Whether this role involves supervisory responsibilities. |  | Enum `SupervisoryStatus`: INDIVIDUAL_CONTRIBUTOR, SUPERVISOR; required on create |
| `name` | Bilingual name of the template. |  | Localized JSON (en, fr); required on create |
| `description` | Bilingual description of the role for this template. |  | Localized JSON (en, fr); required on create |
| `work_description` | Bilingual description of the work environment and context. |  |  |
| `tasks` | Bilingual list of typical tasks for this role. |  | Localized JSON (en, fr); required on create |
| `keywords` | Bilingual keywords to aid discovery and search. |  | Localized arrays of strings (en: [], fr: []) |
| `essential_technical_skills_notes` | Bilingual notes about essential technical skill requirements. |  |  |
| `essential_behavioural_skills_notes` | Bilingual notes about essential behavioural competencies. |  |  |
| `nonessential_technical_skills_notes` | Bilingual notes about asset technical skills. |  |  |
| `classification_id` | FK to the GC classification this template targets. | FK → `classifications.id` | Required on create (NOT NULL) |
| `work_stream_id` | FK to the work stream this template is designed for. | FK → `work_streams.id` | Required on create via API (nullable in DB) |

**Referenced by:** `job_poster_template_skill.job_poster_template_id`

---

## jobs

Laravel queue jobs table holding background tasks waiting to be processed (e.g. sending notifications, generating reports). Part of the Laravel queue system.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Auto-incrementing identifier for the queued job. |  |  |
| `queue` | Name of the queue this job is on. |  | Indexed (jobs_queue_index) |
| `payload` | Serialized job data including class name and constructor arguments. |  |  |
| `attempts` | Number of times this job has been attempted. |  | NOT NULL (smallint) |
| `reserved_at` | Timestamp when a worker picked up this job; null if waiting. |  | Unix timestamp (integer); null = not yet reserved by a worker |
| `available_at` | Earliest timestamp when this job can be processed. |  | Unix timestamp (integer), NOT NULL |
| `created_at` | Timestamp when the job was added to the queue. |  | Unix timestamp (integer), NOT NULL (not a timestamp column) |

---

## migrations

Laravel database migrations tracking table. Records which migration files have been run against this database, preventing re-execution.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Auto-incrementing identifier for the migration record. |  |  |
| `migration` | Filename of the migration that was executed. |  |  |
| `batch` | Batch number grouping migrations run together in a single artisan migrate call. |  |  |

---

## notifications

Laravel notifications table storing in-app and email notifications sent to users (e.g. application status updates, nomination events). Supports read/unread state and soft-delete.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the notification. |  |  |
| `type` | Fully qualified class name of the notification type. |  | Notification class name, e.g. App\Notifications\ApplicationStatusChanged, NewJobPosted, VerifyEmails |
| `notifiable_type` | The model class of the recipient (e.g. App\Models\User). |  | Polymorphic model class (App\Models\User); indexed with notifiable_id |
| `notifiable_id` | UUID of the recipient record. |  |  |
| `data` | JSON payload containing the notification content and metadata. |  | jsonb, NOT NULL |
| `read_at` | Timestamp when the notification was read; null if unread. |  |  |
| `created_at` | Timestamp when the notification was created. |  |  |
| `updated_at` | Timestamp when the notification was last modified. |  |  |
| `deleted_at` | Soft-delete timestamp; null means the notification is active. |  |  |

---

## off_platform_recruitment_processes

Records recruitment processes that occurred outside the GC Digital Talent platform (e.g. via GC Jobs or another tool). Linked to a user's profile to track their full recruitment history.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this off-platform process record. |  |  |
| `user_id` | FK to the user who participated in the process. | FK → `users.id` | Required |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `process_number` | The official process or competition number. |  | Required (NOT NULL) |
| `department_id` | FK to the department that ran the process. | FK → `departments.id` | Optional; department must not be archived |
| `classification_id` | FK to the classification the process was for. | FK → `classifications.id` | Required (NOT NULL) |
| `platform` | Name of the platform used (e.g. GC Jobs, Infotel). |  | Required. Enum `HiringPlatform`: GC_JOBS, OTHER |
| `platform_other` | Free-text description if platform is not in the standard list. |  | Required if platform = OTHER; prohibited otherwise |

---

## permission_role

Junction table assigning permissions to roles. Defines what each role is allowed to do in the platform.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `permission_id` | FK to the permission being granted. | FK → `permissions.id` | Composite primary key (permission_id, role_id) |
| `role_id` | FK to the role receiving the permission. | FK → `roles.id` | Composite primary key (permission_id, role_id) |

---

## permission_user

Assigns permissions directly to individual users, optionally scoped to a specific team. Used for exceptions beyond what their role provides.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `permission_id` | FK to the permission being granted. | FK → `permissions.id` | Unique per (user_id, permission_id, user_type, team_id) |
| `user_id` | FK to the user receiving the permission. | FK → `users.id` |  |
| `user_type` | Polymorphic type discriminator for the user model. |  | Polymorphic model class (App\Models\User) |
| `team_id` | FK to the team scope for this permission; null means platform-wide. | FK → `teams.id` | Null for non-team permissions |

---

## permissions

Reference table of all defined platform permissions (e.g. view-pool, update-candidate). Used by the Bouncer RBAC system to control access across the application.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the permission. |  |  |
| `name` | Machine-readable permission slug (e.g. view-any-pool). |  | Unique. Format `action-scope-resource` (e.g. update-team-publishedPool), seeded from config/rolepermission.php |
| `display_name` | Human-readable bilingual label for the permission. |  |  |
| `description` | Bilingual explanation of what this permission grants. |  |  |
| `created_at` | Timestamp when the permission was created. |  |  |
| `updated_at` | Timestamp when the permission was last modified. |  |  |

**Referenced by:** `permission_role.permission_id`, `permission_user.permission_id`

---

## personal_experiences

Applicant-reported personal life experiences on their GC Talent profile (e.g. caregiving, self-directed learning). Used as evidence of skills not captured through formal employment or education.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this personal experience. |  |  |
| `user_id` | FK to the user reporting the experience. | FK → `users.id` |  |
| `title` | Brief title or name for the experience. |  |  |
| `description` | Description of the experience and what it involved. |  |  |
| `start_date` | Date when the experience began. |  |  |
| `end_date` | Date when the experience ended; null if ongoing. |  |  |
| `details` | Additional context about skills demonstrated. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `deleted_at` | Soft-delete timestamp; null means the record is active. |  |  |

---

## pool_candidate_education_requirement_experience

Links a pool candidate's application to the specific experience(s) they are using to meet the education requirement for a pool. Supports polymorphic experience types.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `pool_candidate_id` | FK to the pool candidate application. | FK → `pool_candidates.id` |  |
| `experience_id` | UUID of the experience record used to satisfy the education requirement. |  | Experience must belong to the candidate's user |
| `created_at` | Timestamp when the link was created. |  |  |
| `updated_at` | Timestamp when the link was last modified. |  |  |
| `experience_type` | Model class of the experience (e.g. EducationExperience, WorkExperience). |  | Polymorphic class: App\Models\AwardExperience, CommunityExperience, EducationExperience, PersonalExperience, WorkExperience |

---

## pool_candidate_filters

Legacy filter configuration for candidate search requests (predating applicant_filters). Stores equity, language, and region criteria used to narrow pool candidate search results.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this filter. |  |  |
| `created_at` | Timestamp when the filter was created. |  |  |
| `updated_at` | Timestamp when the filter was last modified. |  |  |
| `is_woman` | Filter: candidate has self-identified as a woman. |  |  |
| `has_diploma` | Filter: candidate must have a post-secondary diploma. |  |  |
| `has_disability` | Filter: candidate has declared a disability. |  |  |
| `is_indigenous` | Filter: candidate has self-identified as Indigenous. |  |  |
| `is_visible_minority` | Filter: candidate has self-identified as a visible minority. |  |  |
| `language_ability` | Filter: required language profile. |  | Enum `LanguageAbility`: ENGLISH, FRENCH, BILINGUAL |
| `work_regions` | JSON array of geographic work regions acceptable to the candidate. |  | Array of `WorkRegion`: TELEWORK, NATIONAL_CAPITAL, ATLANTIC, QUEBEC, ONTARIO, PRAIRIE, BRITISH_COLUMBIA, NORTH |
| `deleted_at` | Soft-delete timestamp; null means the filter is active. |  |  |
| `operational_requirements` | JSON array of operational conditions the candidate accepts. |  | Array of `OperationalRequirement`: SHIFT_WORK, ON_CALL, TRAVEL, TRANSPORT_EQUIPMENT, DRIVERS_LICENSE, OVERTIME_OCCASIONAL, OVERTIME_REGULAR |

**Referenced by:** `classification_pool_candidate_filter.pool_candidate_filter_id`, `pool_candidate_search_requests.pool_candidate_filter_id`, `pool_pool_candidate_filter.pool_candidate_filter_id`

---

## pool_candidate_search_requests

Records manager and HR advisor requests to search for qualified candidates from recruitment pools. Captures the requestor's details, filter criteria, status, and admin notes.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this search request. |  |  |
| `created_at` | Timestamp when the request was submitted. |  |  |
| `updated_at` | Timestamp when the request was last modified. |  |  |
| `full_name` | Name of the manager or HR advisor making the request. |  | Required (NOT NULL) |
| `email` | Contact email of the requestor. |  | Required (NOT NULL) |
| `job_title` | Job title of the position being staffed. |  | Required (NOT NULL) |
| `additional_comments` | Free-text comments from the requestor. |  |  |
| `pool_candidate_filter_id` | FK to the legacy filter criteria for this request. | FK → `pool_candidate_filters.id` |  |
| `admin_notes` | Internal notes added by the talent management team. |  |  |
| `deleted_at` | Soft-delete timestamp; null means the request is active. |  |  |
| `department_id` | FK to the hiring department. | FK → `departments.id` | Required (NOT NULL) |
| `applicant_filter_id` | FK to the modern applicant filter criteria for this request. | FK → `applicant_filters.id` |  |
| `request_status_changed_at` | Timestamp when the status last changed. |  |  |
| `was_empty` | Whether the search returned zero results. |  | Default false |
| `request_status` | Current status of the request (e.g. pending, done, waiting). |  | Legacy, default NEW. Values: NEW, IN_PROGRESS, WAITING, DONE, DONE_NO_CANDIDATES, NOT_COMPLIANT (superseded by status column and talent_requests table) |
| `manager_job_title` | Job title of the hiring manager. |  |  |
| `position_type` | Type of position being staffed (e.g. indeterminate, term). |  | Enum `TalentRequestPositionType`: INDIVIDUAL_CONTRIBUTOR, TEAM_LEAD |
| `reason` | Reason for the staffing request. |  | Enum `TalentRequestReason`: IMMEDIATE_HIRE, UPCOMING_NEED, GENERAL_INTEREST, REQUIRED_BY_DIRECTIVE |
| `hr_advisor_email` | Email of the HR advisor assisting with the request. |  |  |
| `request_status_weight` | Computed numeric weight for sorting requests by status. |  | Generated (stored) from request_status: NEW=10, IN_PROGRESS=20, WAITING=30, DONE=40, DONE_NO_CANDIDATES=41, NOT_COMPLIANT=50 |
| `WHEN` |  |  |  |
| `WHEN` |  |  |  |
| `WHEN` |  |  |  |
| `WHEN` |  |  |  |
| `WHEN` |  |  |  |
| `WHEN` |  |  |  |
| `ELSE` |  |  |  |
| `community_id` | FK to the community the request is directed to. | FK → `communities.id` | Required (NOT NULL) |
| `user_id` | FK to the platform user who submitted the request. | FK → `users.id` |  |
| `initial_result_count` | Number of candidates returned when the request was first processed. |  |  |

---

## pool_candidate_user_bookmarks

Allows platform users (managers, HR advisors) to bookmark specific pool candidates for easy retrieval. Personal to the bookmarking user.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this bookmark. |  |  |
| `created_at` | Timestamp when the bookmark was created. |  |  |
| `updated_at` | Timestamp when the bookmark was last modified. |  |  |
| `pool_candidate_id` | FK to the bookmarked pool candidate. | FK → `pool_candidates.id` | Unique per (pool_candidate_id, user_id) |
| `user_id` | FK to the user who created the bookmark. | FK → `users.id` | Unique per (pool_candidate_id, user_id) |

---

## pool_candidates

The core application record representing a user's submission to a specific recruitment pool. Tracks the full lifecycle from submission through assessment, placement, and archival. Central to the platform's staffing workflow.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this application. |  |  |
| `created_at` | Timestamp when the application was created. |  |  |
| `updated_at` | Timestamp when the application was last modified. |  |  |
| `expiry_date` | Date when the candidate's pool eligibility expires. |  | Set on qualify (required, today or later); later updates must be today or later; cleared when final decision reverted |
| `pool_id` | FK to the pool this application belongs to. | FK → `pools.id` | Unique per (pool_id, user_id); pool must be published to create an application |
| `user_id` | FK to the applicant. | FK → `users.id` | Unique per (pool_id, user_id): one application per user per pool |
| `deleted_at` | Soft-delete timestamp; null means the application is active. |  |  |
| `notes` | Internal notes added by assessors or administrators. |  |  |
| `archived_at` | Timestamp when the application was archived. |  |  |
| `submitted_at` | Timestamp when the applicant formally submitted their application. |  | Set on submit; requires pool not closed (or open special application), complete profile, essential skills, education requirement, language requirements, all questions answered |
| `signature` | Applicant's digital signature confirming submission. |  | Required to submit |
| `profile_snapshot` | JSON snapshot of the applicant's profile at the time of submission. |  |  |
| `suspended_at` | Timestamp when the candidacy was suspended. |  | Can only be set on a submitted application |
| `submitted_steps` | JSON array tracking which application steps have been completed. |  | Array of `ApplicationStep`: WELCOME, SELF_DECLARATION, REVIEW_YOUR_PROFILE, REVIEW_YOUR_RESUME, EDUCATION_REQUIREMENTS, SKILL_REQUIREMENTS, SCREENING_QUESTIONS, REVIEW_AND_SUBMIT. Default [], deduplicated |
| `education_requirement_option` | How the applicant is meeting the education requirement (e.g. degree, equivalency). |  | Enum `EducationRequirementOption`: APPLIED_WORK, EDUCATION, PROFESSIONAL_DESIGNATION |
| `is_flagged` | Whether this application has been flagged for review. |  | Default false |
| `placed_at` | Timestamp when the candidate was placed into a position. |  | Set when placed; only QUALIFIED candidates can be placed |
| `placed_department_id` | FK to the department where the candidate was placed. | FK → `departments.id` | Required when placing; department must exist |
| `removal_reason` | Reason why the candidate was removed from the pool. |  | Enum `CandidateRemovalReason`: REQUESTED_TO_BE_WITHDRAWN, NOT_RESPONSIVE, INELIGIBLE, OTHER. Required to remove; only TO_ASSESS, non-placed candidates can be removed |
| `removal_reason_other` | Free-text removal reason if not in the standard list. |  | Required if removal_reason = OTHER |
| `veteran_verification` | Status of the candidate's veteran priority verification. |  | Enum `ClaimVerificationResult`: ACCEPTED, REJECTED, UNVERIFIED. Set to UNVERIFIED on submit if user is a veteran |
| `veteran_verification_expiry` | Date when veteran verification expires. |  | Must be after today if veteran_verification = ACCEPTED |
| `priority_verification` | Status of priority entitlement verification. |  | Enum `ClaimVerificationResult`: ACCEPTED, REJECTED, UNVERIFIED. Set to UNVERIFIED on submit if user has priority entitlement |
| `priority_verification_expiry` | Date when priority verification expires. |  | Required and after today if priority_verification = ACCEPTED |
| `computed_assessment_status` | Computed overall assessment status across all steps. |  | JSON: overallAssessmentStatus (`OverallAssessmentStatus`: TO_ASSESS, DISQUALIFIED, QUALIFIED) and per-step assessmentStepStatuses; computed |
| `assessment_step_id` | FK to the current assessment step the candidate is at. | FK → `assessment_steps.id` | Must be an assessment step of the same pool; only allowed when screening_stage = UNDER_ASSESSMENT |
| `screening_stage` | Current stage in the screening process. |  | Enum `ScreeningStage`: NEW_APPLICATION, APPLICATION_REVIEW, SCREENED_IN, UNDER_ASSESSMENT. Set to NEW_APPLICATION on submit; null once a final decision is made |
| `application_status` | Current status of the application (e.g. draft, screened_in, qualified). |  | Enum `ApplicationStatus`: DRAFT, TO_ASSESS, REMOVED, DISQUALIFIED, QUALIFIED. NOT NULL, default DRAFT. Only DRAFT can be deleted; qualify/disqualify only from TO_ASSESS |
| `disqualification_reason` | Reason the applicant was disqualified, if applicable. |  | Enum `DisqualificationReason`: SCREENED_OUT_APPLICATION, SCREENED_OUT_ASSESSMENT |
| `status_updated_at` | Timestamp when the application status last changed. |  |  |
| `placement_type` | Type of placement (e.g. indeterminate, term, acting). |  | Enum `PlacementType`: NOT_PLACED, UNDER_CONSIDERATION, PLACED_TENTATIVE, PLACED_ACTING, PLACED_CASUAL, PLACED_TERM, PLACED_INDETERMINATE. Null unless QUALIFIED (set to NOT_PLACED on qualify) |
| `status_weight` | Computed numeric weight for sorting applications by status. |  | Generated (stored) from application_status: DRAFT=10, TO_ASSESS=20, DISQUALIFIED=30, QUALIFIED=40, REMOVED=50 |
| `WHEN` |  |  |  |
| `WHEN` |  |  |  |
| `WHEN` |  |  |  |
| `WHEN` |  |  |  |
| `WHEN` |  |  |  |
| `ELSE` |  |  |  |
| `pause_referrals_at` | Timestamp when referrals for this candidate were paused. |  | Set when referrals paused; auto-paused when placed PLACED_INDETERMINATE |
| `resume_referrals_at` | Timestamp when referrals are scheduled to resume. |  | Derived from `PauseReferralsLength` (ONE_MONTH, THREE_MONTHS, SIX_MONTHS, ONE_YEAR, UNTIL_EXPIRY, OTHER); if OTHER must be after today and on or before expiry_date |
| `pause_referrals_reason` | Reason referrals were paused for this candidate. |  | Required when pausing referrals |

**Referenced by:** `assessment_results.pool_candidate_id`, `general_question_responses.pool_candidate_id`, `pool_candidate_education_requirement_experience.pool_candidate_id`, `pool_candidate_user_bookmarks.pool_candidate_id`, `screening_question_responses.pool_candidate_id`

---

## pool_pool_candidate_filter

Junction table linking legacy pool candidate filters to specific pools. Used in older search workflows to scope filters to a pool.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `created_at` | Timestamp when the link was created. |  |  |
| `updated_at` | Timestamp when the link was last modified. |  |  |
| `pool_candidate_filter_id` | FK to the pool candidate filter. | FK → `pool_candidate_filters.id` |  |
| `pool_id` | FK to the pool. | FK → `pools.id` |  |

---

## pool_skill

Defines the skills required or desired for a recruitment pool, with type (essential vs. asset) and required proficiency level. Drives both the job advertisement and the assessment process.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this pool-skill record. |  |  |
| `skill_id` | FK to the skill. | FK → `skills.id` | Unique per (skill_id, pool_id); skill must not be deleted to publish |
| `pool_id` | FK to the pool requiring or desiring this skill. | FK → `pools.id` |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `type` | Whether this skill is essential or an asset for the pool. |  | Enum `PoolSkillType`: ESSENTIAL, NONESSENTIAL. NOT NULL; at least one ESSENTIAL skill required to publish |
| `required_skill_level` | Minimum proficiency level required (e.g. beginner, intermediate, advanced, lead). |  | Enum `SkillLevel`: BEGINNER, INTERMEDIATE, ADVANCED, LEAD. Required on every pool skill to publish |

**Referenced by:** `assessment_results.pool_skill_id`, `assessment_step_pool_skill.pool_skill_id`

---

## pool_user_bookmarks

Allows platform users to bookmark entire recruitment pools for quick access. Personal to the bookmarking user.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this bookmark. |  |  |
| `created_at` | Timestamp when the bookmark was created. |  |  |
| `updated_at` | Timestamp when the bookmark was last modified. |  |  |
| `pool_id` | FK to the bookmarked pool. | FK → `pools.id` | Unique per (pool_id, user_id) |
| `user_id` | FK to the user who created the bookmark. | FK → `users.id` | Unique per (pool_id, user_id) |

---

## pools

Recruitment pools (job advertisements) at the heart of the GC Digital Talent platform. A pool defines a position's requirements, assessment process, and eligibility criteria. Candidates apply to pools and, if successful, are placed from them.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the pool. |  |  |
| `created_at` | Timestamp when the pool was created. |  |  |
| `updated_at` | Timestamp when the pool was last modified. |  |  |
| `name` | Bilingual name of the pool/advertisement. |  | Required to publish; bilingual (en and fr both or neither). Default {en:'', fr:''} |
| `user_id` | FK to the user who owns or created the pool. | FK → `users.id` |  |
| `deleted_at` | Soft-delete timestamp; null means the pool is active. |  |  |
| `operational_requirements` | JSON array of operational conditions required for the role. |  | Array of `OperationalRequirement`: SHIFT_WORK, ON_CALL, TRAVEL, TRANSPORT_EQUIPMENT, DRIVERS_LICENSE, OVERTIME_OCCASIONAL, OVERTIME_REGULAR |
| `key_tasks` | Bilingual description of key tasks and responsibilities. |  | Required to publish; bilingual: en and fr both required |
| `closing_date` | Date and time when the pool closes for applications. |  | Required to publish; must be after end of today. Edits must be after today; changePoolClosingDate cannot move it earlier. Status becomes CLOSED once now >= closing_date |
| `your_impact` | Bilingual statement about the role's impact. |  | Required to publish; bilingual: en and fr both required |
| `advertisement_location` | Bilingual location description for the advertisement. |  | Bilingual; required (en and fr) if is_remote = false |
| `security_clearance` | Required security clearance level (e.g. reliability, secret). |  | Required to publish. Enum `SecurityStatus`: RELIABILITY, SECRET, TOP_SECRET |
| `advertisement_language` | Language(s) in which the advertisement is posted. |  | Required to publish. Enum `PoolLanguage`: ENGLISH, FRENCH, VARIOUS, VARIOUS_BILINGUAL, BILINGUAL_INTERMEDIATE, BILINGUAL_ADVANCED |
| `is_remote` | Whether the position is remote-eligible. |  | Required to publish (boolean) |
| `process_number` | Official GC selection process number. |  |  |
| `publishing_group` | Group controlling publication (e.g. IT, EC). |  |  |
| `published_at` | Timestamp when the pool was published publicly. |  | Set by publishPool (only from DRAFT, after completeness and assessment plan checks). Status is computed: DRAFT if null, ARCHIVED if archived_at passed, CLOSED if closing_date passed, else PUBLISHED |
| `what_to_expect` | Bilingual description of the assessment process for applicants. |  | Bilingual: en and fr both or neither |
| `archived_at` | Timestamp when the pool was archived. |  | Can only be set when status is CLOSED; unarchive (set null) only when ARCHIVED |
| `special_note` | Bilingual special note or caveat displayed on the advertisement. |  | Bilingual: en and fr both or neither |
| `opportunity_length` | Expected length of the opportunity (e.g. various, short-term). |  | Required to publish. Enum `PoolOpportunityLength`: TERM_SIX_MONTHS, TERM_ONE_YEAR, TERM_TWO_YEARS, INDETERMINATE, VARIOUS |
| `what_to_expect_admission` | Bilingual description of what happens after a candidate is admitted to the pool. |  | Bilingual: en and fr both or neither |
| `about_us` | Bilingual description of the hiring organization. |  | Bilingual: en and fr both or neither |
| `classification_id` | FK to the GC classification for this pool. | FK → `classifications.id` | Required to publish |
| `closing_reason` | Reason why the pool was closed. |  | Required when closing early (closePool sets closing_date to now); non-null means pool was closed early |
| `change_justification` | Explanation for significant changes to the pool after publication. |  | Required when editing a published pool |
| `department_id` | FK to the department running this pool. | FK → `departments.id` | Required (NOT NULL); department must not be archived. Creator must have pool-create permission on the department or community team |
| `community_id` | FK to the functional community this pool belongs to. | FK → `communities.id` | Nullable. Creator must have pool-create permission on the department or community team |
| `area_of_selection` | Geographic or organizational area of selection. |  | Required to publish. Enum `PoolAreaOfSelection`: PUBLIC, EMPLOYEES |
| `selection_limitations` | Any limitations on who may apply. |  | Array of `PoolSelectionLimitation`: AT_LEVEL_ONLY, DEPARTMENTAL_PREFERENCE, CANADIAN_CITIZENS (distinct; allowed set depends on area_of_selection). NOT NULL, default [] |
| `work_stream_id` | FK to the work stream this pool is in. | FK → `work_streams.id` | Required to publish; must belong to the pool's community when the pool has one |
| `contact_email` | Contact email for inquiries about this pool. |  | Required to publish |

**Referenced by:** `applicant_filter_pool.pool_id`, `assessment_steps.pool_id`, `general_questions.pool_id`, `pool_candidates.pool_id`, `pool_pool_candidate_filter.pool_id`, `pool_skill.pool_id`, `pool_user_bookmarks.pool_id`, `screening_questions.pool_id`

---

## role_user

Assigns roles to users, optionally scoped to a specific team. Drives role-based access control across the platform.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `role_id` | FK to the assigned role. | FK → `roles.id` | Unique per (user_id, role_id, user_type, team_id) |
| `user_id` | FK to the user receiving the role. | FK → `users.id` |  |
| `user_type` | Polymorphic type discriminator for the user model. |  | Polymorphic model class (App\Models\User) |
| `team_id` | FK to the team scope; null means the role applies platform-wide. | FK → `teams.id` | Required (existing team) if role is team-based; must be null otherwise |
| `id` | Unique identifier for this role assignment. |  |  |
| `created_at` | Timestamp when the role was assigned. |  |  |
| `updated_at` | Timestamp when the assignment was last modified. |  |  |

---

## roles

Reference table of platform roles (e.g. Admin, Pool Operator, Applicant, Community Manager). Roles group permissions and are assigned to users platform-wide or within teams.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the role. |  |  |
| `name` | Machine-readable role slug (e.g. pool-operator, community-manager). |  | Unique. Seeded: base_user, applicant, process_operator, community_recruiter, community_admin, platform_admin, community_talent_coordinator, department_admin, department_hr_advisor |
| `display_name` | Bilingual human-readable label for the role. |  |  |
| `description` | Bilingual description of what this role can do. |  |  |
| `created_at` | Timestamp when the role was created. |  |  |
| `updated_at` | Timestamp when the role was last modified. |  |  |
| `is_team_based` | Whether this role is scoped to a team or applies platform-wide. |  | Determines whether role_user.team_id is required |

**Referenced by:** `permission_role.role_id`, `role_user.role_id`

---

## screening_question_responses

Stores applicant answers to screening questions on a pool application. Screening question responses are reviewed as part of the initial application screening stage.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this response. |  |  |
| `pool_candidate_id` | FK to the pool candidate application. | FK → `pool_candidates.id` | Unique per (pool_candidate_id, screening_question_id) |
| `screening_question_id` | FK to the screening question being answered. | FK → `screening_questions.id` | Unique per (pool_candidate_id, screening_question_id); question must belong to the application's pool. All pool questions must be answered to submit |
| `answer` | The applicant's free-text answer to the screening question. |  | Required (NOT NULL) |
| `created_at` | Timestamp when the response was created. |  |  |
| `updated_at` | Timestamp when the response was last modified. |  |  |

---

## screening_questions

Questions added by pool administrators to screen applicants at the application stage. Responses are reviewed to determine if candidates meet minimum requirements and can advance.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the screening question. |  |  |
| `pool_id` | FK to the pool this question belongs to. | FK → `pools.id` | Questions are synced per pool via createOrUpdateScreeningQuestionAssessmentStep; omitted questions are deleted |
| `assessment_step_id` | FK to the assessment step this question is part of. | FK → `assessment_steps.id` | Set to the pool's SCREENING_QUESTIONS_AT_APPLICATION assessment step |
| `sort_order` | Display order of the question in the application form. |  |  |
| `question` | Bilingual question text shown to applicants. |  | Localized string {en, fr}; required (NOT NULL) |
| `created_at` | Timestamp when the question was created. |  |  |
| `updated_at` | Timestamp when the question was last modified. |  |  |

**Referenced by:** `screening_question_responses.screening_question_id`

---

## skill_families

Groups related skills into broad categories (e.g. 'Leadership', 'Technical', 'Communication'). Used to organize the skills catalogue and support filtered search.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the skill family. |  |  |
| `key` | Machine-readable slug for the skill family. |  | Unique; `KeyString` format (lowercase letters, digits, underscores; starts with a letter); set on create only |
| `name` | Bilingual display name of the skill family. |  | Localized string {en, fr}; required on create |
| `description` | Bilingual description of the skill family and what it covers. |  | Localized string {en, fr} |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `deleted_at` | Soft-delete timestamp; null means the skill family is active. |  |  |

**Referenced by:** `skill_skill_family.skill_family_id`

---

## skill_skill_family

Junction table linking individual skills to their skill families. A skill can belong to multiple families.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this skill-family link. |  |  |
| `skill_id` | FK to the skill. | FK → `skills.id` | Unique per (skill_id, skill_family_id) |
| `skill_family_id` | FK to the skill family. | FK → `skill_families.id` | Unique per (skill_id, skill_family_id) |

---

## skill_talent_nomination

Junction table linking a talent nomination to the skills being recognized or nominated for. Records which competencies support a nomination.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `skill_id` | FK to the skill being recognized. | FK → `skills.id` | Unique per (skill_id, talent_nomination_id); must be a skill in the `klc` (Key Leadership Competencies) family |
| `talent_nomination_id` | FK to the talent nomination. | FK → `talent_nominations.id` | Only allowed if event include_leadership_competencies; max 3 while editing, exactly 3 to submit |

---

## skills

The platform's catalogue of skills and competencies (e.g. 'Python', 'Strategic Thinking', 'Data Analysis'). Skills are used across pools, user profiles, nominations, and assessments to define requirements and capture applicant capabilities.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the skill. |  |  |
| `key` | Machine-readable slug for the skill. |  | Unique; `KeyString` format (lowercase letters, digits, underscores; starts with a letter); set on create only |
| `name` | Bilingual display name of the skill. |  | Localized string {en, fr}; required |
| `description` | Bilingual description of what this skill entails. |  | Localized string {en, fr} |
| `created_at` | Timestamp when the skill was created. |  |  |
| `updated_at` | Timestamp when the skill was last modified. |  |  |
| `deleted_at` | Soft-delete timestamp; null means the skill is active. |  | Soft delete blocked if skill is used by an active pool (`SkillNotUsedByActivePool`) |
| `keywords` | Bilingual keywords to improve skill discoverability in search. |  | JSON {en: [string], fr: [string]}; default empty arrays |
| `category` | Broad category (e.g. technical, behavioural) the skill belongs to. |  | Enum `SkillCategory`: TECHNICAL, BEHAVIOURAL; default TECHNICAL |

**Referenced by:** `applicant_filter_skill.skill_id`, `job_poster_template_skill.skill_id`, `pool_skill.skill_id`, `skill_skill_family.skill_id`, `skill_talent_nomination.skill_id`, `user_skills.skill_id`

---

## talent_nomination_events

Time-bound nomination campaigns organized by a community, during which managers can nominate employees for advancement, lateral moves, or development programs. Has an open and close date.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the nomination event. |  |  |
| `created_at` | Timestamp when the event was created. |  |  |
| `updated_at` | Timestamp when the event was last modified. |  |  |
| `name` | Bilingual name of the nomination event. |  | Localized string; en and fr both required; cannot change while event is ACTIVE |
| `description` | Bilingual description of the event's purpose and scope. |  | Localized string {en, fr} |
| `open_date` | Date and time when nominations open. |  | Required; cannot change while event is ACTIVE. Status derived from dates: UPCOMING, ACTIVE, PAST |
| `close_date` | Date and time when nominations close. |  | Required; must be after open_date; while ACTIVE can only be moved later. Nominations cannot be created/updated after close (unless user has past-nomination permission) |
| `learn_more_url` | Bilingual URL linking to more information about the event. |  | Localized string; each value must be a valid URL |
| `include_leadership_competencies` | Whether nominators are asked to assess leadership competencies. |  |  |
| `community_id` | FK to the community organizing this event. | FK → `communities.id` | Required; must exist; cannot change while event is ACTIVE |

**Referenced by:** `community_development_program_talent_nomination_event.talent_nomination_event_id`, `development_program_talent_nomination_event.talent_nomination_event_id`, `talent_nomination_groups.talent_nomination_event_id`, `talent_nominations.talent_nomination_event_id`

---

## talent_nomination_groups

Aggregates all nominations received for a single nominee within a given nomination event. Stores the consolidated review decisions (advancement, lateral, development programs) made after reviewing all nominations in the group.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this nomination group. |  |  |
| `created_at` | Timestamp when the group was created. |  |  |
| `updated_at` | Timestamp when the group was last modified. |  |  |
| `nominee_id` | FK to the user being nominated. | FK → `users.id` | Unique per (nominee_id, talent_nomination_event_id); default scope hides groups whose nominee is soft-deleted |
| `talent_nomination_event_id` | FK to the nomination event this group belongs to. | FK → `talent_nomination_events.id` | Unique per (nominee_id, talent_nomination_event_id) |
| `advancement_decision` | Consolidated decision on advancement (e.g. recommended, not recommended). |  | Enum `TalentNominationGroupDecision`: APPROVED, REJECTED; prohibited unless group has advancement nominations |
| `advancement_reference_confirmed` | Whether the advancement reference has been confirmed. |  |  |
| `advancement_notes` | Notes supporting the advancement decision. |  |  |
| `lateral_movement_decision` | Consolidated decision on lateral movement. |  | Enum `TalentNominationGroupDecision`: APPROVED, REJECTED; prohibited unless group has lateral movement nominations |
| `lateral_movement_notes` | Notes supporting the lateral movement decision. |  |  |
| `development_programs_decision` | Consolidated decision on development program participation. |  | Enum `TalentNominationGroupDecision`: APPROVED, REJECTED; prohibited unless group has development program nominations |
| `development_programs_notes` | Notes supporting the development programs decision. |  |  |
| `computed_status` | Computed overall status of the nomination group. |  | Enum `TalentNominationGroupStatus`: IN_PROGRESS, APPROVED, PARTIALLY_APPROVED, REJECTED; default IN_PROGRESS; computed from the three decisions (not directly editable) |
| `comments` | General reviewer comments about the nominee. |  |  |

**Referenced by:** `talent_nominations.talent_nomination_group_id`

---

## talent_nominations

An individual nomination submitted by a manager (nominator) for an employee (nominee) during a talent nomination event. Captures the full nomination form including nominator details, the type of nomination, rationale, and references. Multiple nominations for the same nominee in an event are grouped via talent_nomination_groups.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this nomination. |  |  |
| `created_at` | Timestamp when the nomination was created. |  |  |
| `updated_at` | Timestamp when the nomination was last modified. |  |  |
| `submitted_steps` | JSON tracking which sections of the nomination form have been completed. |  | Array of `TalentNominationStep`: INSTRUCTIONS, NOMINATOR_INFORMATION, NOMINEE_INFORMATION, NOMINATION_DETAILS, RATIONALE, REVIEW_AND_SUBMIT; default []; REVIEW_AND_SUBMIT only via submit mutation |
| `talent_nomination_event_id` | FK to the nomination event this nomination is for. | FK → `talent_nomination_events.id` | Required; event must be open (before close_date) to create/update |
| `submitted_at` | Timestamp when the nomination was formally submitted. |  | Set by submitTalentNomination; nomination cannot be resubmitted |
| `submitter_id` | FK to the user who submitted the form (may differ from nominator). | FK → `users.id` | Injected from the authenticated user |
| `submitter_relationship_to_nominator` | The submitter's relationship to the nominating manager. |  | Enum `TalentNominationSubmitterRelationshipToNominator`: SUPPORT_STAFF, EMPLOYEE, OTHER; required to submit unless submitter is the nominator (prohibited if so) |
| `submitter_relationship_to_nominator_other` | Free-text if the relationship is not in the standard list. |  | Required if relationship is OTHER, otherwise prohibited |
| `nominator_id` | FK to the nominating manager (may be null if using fallback fields). | FK → `users.id` | Must be verified gov employee; required to submit unless all nominator fallback fields given; prohibits fallback fields |
| `nominator_fallback_work_email` | Fallback email if the nominator is not a platform user. |  | Must match government email domain regex (`GovernmentEmailRegex`, e.g. gc.ca, canada.ca); required to submit if nominator_id is null, else prohibited |
| `nominator_fallback_name` | Fallback name if the nominator is not a platform user. |  | Required to submit if nominator_id is null, else prohibited |
| `nominator_fallback_classification_id` | FK to the nominator's classification when not a platform user. | FK → `classifications.id` | Required to submit if nominator_id is null, else prohibited |
| `nominator_fallback_department_id` | FK to the nominator's department when not a platform user. | FK → `departments.id` | Required to submit if nominator_id is null, else prohibited |
| `nominator_review` | Whether the nominator has reviewed and confirmed the nomination. |  | Enum `TalentNominationUserReview`: CORRECT, INCORRECT_OUT_OF_DATE, WRONG_PERSON; required to submit if nominator is set and differs from submitter; prohibited if nominator_id null |
| `nominee_id` | FK to the employee being nominated. | FK → `users.id` | Required to submit; must differ from nominator_id; must be verified gov employee |
| `nominee_review` | Whether the nominee has reviewed and consented to the nomination. |  | Enum `TalentNominationUserReview`: CORRECT, INCORRECT_OUT_OF_DATE, WRONG_PERSON; required to submit |
| `nominee_relationship_to_nominator` | The nominee's working relationship to the nominator. |  | Enum `TalentNominationNomineeRelationshipToNominator`: CURRENT_EMPLOYEE, FORMER_EMPLOYEE, ANOTHER_WORK_EMPLOYEE, MENTEE, OTHER; required to submit |
| `nominee_relationship_to_nominator_other` | Free-text if the relationship is not in the standard list. |  | Required if relationship is OTHER, otherwise prohibited |
| `nominate_for_advancement` | Whether this nomination is for advancement to a higher level. |  | Required to submit; must be true iff an advancement reference (user or fallback email) is set |
| `nominate_for_lateral_movement` | Whether this nomination is for a lateral move. |  | Required to submit; must be true iff lateral_movement_options is non-empty |
| `nominate_for_development_programs` | Whether this nomination is for development program participation. |  | Required to submit; must be true iff development programs or development_program_options_other set; must be false if event has no development opportunities |
| `advancement_reference_id` | FK to the user providing a reference for advancement. | FK → `users.id` | Only allowed if nominate_for_advancement; prohibits advancement reference fallback fields |
| `advancement_reference_review` | Whether the reference has reviewed and confirmed their participation. |  | Enum `TalentNominationUserReview`: CORRECT, INCORRECT_OUT_OF_DATE, WRONG_PERSON; required to submit if advancement_reference_id set, else prohibited |
| `advancement_reference_fallback_work_email` | Fallback email if the reference is not a platform user. |  | Must match government email domain regex (`GovernmentEmailRegex`, e.g. gc.ca, canada.ca); fallback fields required together; prohibited if advancement_reference_id set |
| `advancement_reference_fallback_name` | Fallback name if the reference is not a platform user. |  | Fallback fields required together; prohibited if advancement_reference_id set |
| `advancement_reference_fallback_classification_id` | FK to the reference's classification when not a platform user. | FK → `classifications.id` | Fallback fields required together; prohibited if advancement_reference_id set |
| `advancement_reference_fallback_department_id` | FK to the reference's department when not a platform user. | FK → `departments.id` | Fallback fields required together; prohibited if advancement_reference_id set |
| `lateral_movement_options` | JSON array of lateral movement types selected. |  | Array of `TalentNominationLateralMovementOption`: SMALL_DEPARTMENT, LARGE_DEPARTMENT, CENTRAL_DEPARTMENT, NEW_DEPARTMENT, PROGRAM_EXPERIENCE, POLICY_EXPERIENCE, OTHER; distinct; default [] |
| `lateral_movement_options_other` | Free-text for lateral movement options not in the standard list. |  | Required if lateral_movement_options contains OTHER, otherwise prohibited |
| `development_program_options_other` | Free-text for development program options not in the standard list. |  | Only allowed if nominate_for_development_programs is true |
| `nomination_rationale` | Bilingual narrative justifying why the employee is being nominated. |  | Required to submit |
| `additional_comments` | Free-text additional comments from the nominator. |  |  |
| `talent_nomination_group_id` | FK to the nomination group aggregating all nominations for this nominee. | FK → `talent_nomination_groups.id` |  |

**Referenced by:** `community_development_program_talent_nomination.talent_nomination_id`, `development_program_talent_nomination.talent_nomination_id`, `skill_talent_nomination.talent_nomination_id`

---

## teams

Organizational teams used to scope roles and permissions. A team can be associated with a pool, community, or department via the polymorphic teamable fields.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the team. |  |  |
| `name` | Display name of the team. |  | Unique |
| `created_at` | Timestamp when the team was created. |  |  |
| `updated_at` | Timestamp when the team was last modified. |  |  |
| `teamable_id` | UUID of the entity this team is associated with (polymorphic). |  | Unique (one team per teamable) |
| `teamable_type` | Model class of the entity this team is associated with (e.g. Pool, Community). |  | Polymorphic model class: App\Models\Pool, App\Models\Community, App\Models\Department |

**Referenced by:** `permission_user.team_id`, `role_user.team_id`

---

## training_opportunities

Listings of training courses and learning opportunities available to GC employees, surfaced in the platform as career development resources.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the training opportunity. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `title` | Bilingual title of the training course or opportunity. |  | Localized string {en, fr}; required on create |
| `course_language` | Language(s) in which the course is offered. |  | Enum `CourseLanguage`: ENGLISH, FRENCH, BILINGUAL; required on create |
| `registration_deadline` | Date by which participants must register. |  | Required on create |
| `training_start` | Date when the training begins. |  | Required on create |
| `training_end` | Date when the training ends. |  |  |
| `description` | Bilingual description of the training content and objectives. |  | Localized string {en, fr}; required on create |
| `application_url` | URL where participants can register or apply. |  | Localized string {en, fr}; required on create |
| `course_format` | Delivery format (e.g. in-person, virtual, hybrid, self-paced). |  | Enum `CourseFormat`: ON_SITE, VIRTUAL; required on create |
| `pinned` | Whether this opportunity is pinned to the top of the listing. |  | Required on create; default false |

---

## user_search_indices

Stores a full-text search index for each user, enabling fast keyword search across applicant profiles. Updated whenever the user's profile changes.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | FK to the user this index belongs to (1:1 with users). | FK → `users.id` |  |
| `searchable` | GIN-indexed tsvector of the user's searchable profile content. |  | tsvector maintained automatically when user search columns change |

---

## user_skills

Records a skill on a user's GC Talent profile, including their self-assessed proficiency level, context of use, and optional ranking for top or improvement-targeted skills.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this user-skill record. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `deleted_at` | Soft-delete timestamp; null means the skill is active on the profile. |  |  |
| `user_id` | FK to the user who has this skill. | FK → `users.id` | Unique per (user_id, skill_id) |
| `skill_id` | FK to the skill. | FK → `skills.id` | Unique per (user_id, skill_id) |
| `skill_level` | Self-assessed proficiency (e.g. beginner, intermediate, advanced, lead). |  | Enum `SkillLevel`: BEGINNER, INTERMEDIATE, ADVANCED, LEAD |
| `when_skill_used` | Free-text description of when or where the user uses this skill. |  | Enum `WhenSkillUsed`: CURRENT, PAST |
| `top_skills_rank` | Ranking position if this is one of the user's top skills; null if not ranked. |  | 1-based rank within skill category (technical/behavioural); set via updateUserSkillRankings; null if unranked |
| `improve_skills_rank` | Ranking position if this is a skill the user wants to improve; null if not ranked. |  | 1-based rank within skill category (technical/behavioural); set via updateUserSkillRankings; null if unranked |

**Referenced by:** `experience_skill.user_skill_id`

---

## user_work_stream_career_objective

Junction table recording which work streams a user is targeting as their long-term career objective. Multiple work streams can be listed.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `user_id` | FK to the user. | FK → `users.id` |  |
| `work_stream_id` | FK to the targeted work stream. | FK → `work_streams.id` | Must belong to user's career_objective_community; prohibited if career_objective_community_other set |

---

## user_work_stream_next_role

Junction table recording which work streams a user is targeting for their next role (short-term). Multiple work streams can be listed.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `user_id` | FK to the user. | FK → `users.id` |  |
| `work_stream_id` | FK to the targeted work stream. | FK → `work_streams.id` | Must belong to user's next_role_community; prohibited if next_role_community_other set |

---

## users

The central user record for all platform participants — applicants, managers, HR advisors, and administrators. Stores identity, contact information, employment equity self-identification, language profile, career planning preferences, and computed fields derived from their work history.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the user. |  |  |
| `created_at` | Timestamp when the account was created. |  |  |
| `updated_at` | Timestamp when the account was last modified. |  |  |
| `email` | Primary contact email address. |  | Unique; case-insensitively unique across email and work_email; email format; moved to email_backup on soft delete |
| `first_name` | User's given name. |  | Required on create |
| `last_name` | User's family name. |  | Required on create |
| `telephone` | Contact telephone number. |  |  |
| `preferred_lang` | Preferred language for platform communications (en or fr). |  | Enum `Language`: EN, FR (stored lowercase en/fr) |
| `deleted_at` | Soft-delete timestamp; null means the account is active. |  | Soft delete also soft-deletes pool candidates and clears email/work_email into backup columns |
| `sub` | OIDC subject identifier from the identity provider (GCKey/Sign-in Canada). |  | Unique |
| `current_province` | Province or territory where the user currently works or lives. |  | Enum `ProvinceOrTerritory` (13 cases, e.g. ONTARIO, QUEBEC, BRITISH_COLUMBIA, NUNAVUT) |
| `current_city` | City where the user currently works or lives. |  |  |
| `looking_for_english` | Whether the user wants to work in English. |  |  |
| `looking_for_french` | Whether the user wants to work in French. |  |  |
| `looking_for_bilingual` | Whether the user wants to work in a bilingual position. |  |  |
| `comprehension_level` | Self-assessed second-language reading comprehension level. |  | Enum `EvaluatedLanguageAbility`: X, A, B, C, E, P, NOT_ASSESSED |
| `written_level` | Self-assessed second-language written expression level. |  | Enum `EvaluatedLanguageAbility`: X, A, B, C, E, P, NOT_ASSESSED |
| `verbal_level` | Self-assessed second-language oral interaction level. |  | Enum `EvaluatedLanguageAbility`: X, A, B, C, E, P, NOT_ASSESSED |
| `estimated_language_ability` | Overall estimated second-language ability level. |  | Enum `EstimatedLanguageAbility`: BEGINNER, INTERMEDIATE, ADVANCED |
| `computed_is_gov_employee` | Computed flag indicating the user is a current GC employee. |  | Computed from latest current government work experience (`ComputeGovEmployeeProfileData` listener); not directly editable |
| `computed_classification` | FK to the user's current computed GC classification based on work history. | FK → `classifications.id` | Computed from latest current government work experience (`ComputeGovEmployeeProfileData` listener); not directly editable |
| `location_exemptions` | Free-text explanation of any location flexibility exemptions. |  |  |
| `is_woman` | Employment equity: user has self-identified as a woman. |  |  |
| `has_disability` | Employment equity: user has declared a disability. |  |  |
| `is_visible_minority` | Employment equity: user has self-identified as a visible minority. |  |  |
| `has_diploma` | Whether the user holds a post-secondary diploma or higher. |  |  |
| `location_preferences` | JSON array of preferred work locations. |  | Array of `WorkRegion`: TELEWORK, NATIONAL_CAPITAL, ATLANTIC, QUEBEC, ONTARIO, PRAIRIE, BRITISH_COLUMBIA, NORTH |
| `accepted_operational_requirements` | JSON array of operational conditions the user accepts. |  | Array of `OperationalRequirement`: SHIFT_WORK, ON_CALL, TRAVEL, TRANSPORT_EQUIPMENT, DRIVERS_LICENSE, OVERTIME_OCCASIONAL, OVERTIME_REGULAR |
| `computed_gov_employee_type` | Computed type of GC employment (e.g. indeterminate, term, casual). |  | Enum `GovEmployeeType`: STUDENT, CASUAL, TERM, INDETERMINATE, CONTRACTOR, INTERCHANGE; Computed from latest current government work experience (`ComputeGovEmployeeProfileData` listener); not directly editable |
| `computed_department` | FK to the user's current computed department based on work history. | FK → `departments.id` | Computed from latest current government work experience (`ComputeGovEmployeeProfileData` listener); not directly editable |
| `citizenship` | Citizenship status (e.g. citizen, permanent resident). |  | Enum `CitizenshipStatus`: PERMANENT_RESIDENT, CITIZEN, OTHER |
| `armed_forces_status` | Canadian Armed Forces status (e.g. veteran, active, none). |  | Enum `ArmedForcesStatus`: VETERAN, MEMBER, NON_CAF |
| `has_priority_entitlement` | Whether the user has a GC priority entitlement for staffing. |  |  |
| `priority_number` | Official priority entitlement number. |  |  |
| `priority_weight` | Computed numeric weight reflecting priority entitlement type. |  | Generated column: 10 if has_priority_entitlement, 20 if VETERAN, 30 if CITIZEN or PERMANENT_RESIDENT, else 40 |
| `WHEN` |  |  |  |
| `WHEN` |  |  |  |
| `WHEN` |  |  |  |
| `ELSE` |  |  |  |
| `position_duration` | JSON array of acceptable position durations. |  | Array of `PositionDuration`: TEMPORARY, PERMANENT |
| `indigenous_declaration_signature` | Confirmation that the user has signed the Indigenous identity declaration. |  |  |
| `indigenous_communities` | JSON array of Indigenous communities the user identifies with. |  | Array of `IndigenousCommunity`: STATUS_FIRST_NATIONS, NON_STATUS_FIRST_NATIONS, INUIT, METIS, OTHER, LEGACY_IS_INDIGENOUS; cannot include both STATUS and NON_STATUS |
| `preferred_language_for_interview` | Preferred official language for interviews. |  | Enum `Language`: EN, FR (stored lowercase en/fr) |
| `preferred_language_for_exam` | Preferred official language for written exams. |  | Enum `Language`: EN, FR (stored lowercase en/fr) |
| `first_official_language` | The user's first official language (English or French). |  | Enum `Language`: EN, FR (stored lowercase en/fr) |
| `second_language_exam_completed` | Whether the user has completed a second-language evaluation. |  |  |
| `second_language_exam_validity` | Date until which the second-language evaluation results are valid. |  |  |
| `enabled_email_notifications` | JSON array of email notification types the user has enabled. |  | Array of `NotificationFamily`; only APPLICATION_UPDATE, JOB_ALERT may be enabled; distinct |
| `enabled_in_app_notifications` | JSON array of in-app notification types the user has enabled. |  | Array of `NotificationFamily`; only APPLICATION_UPDATE, JOB_ALERT may be enabled; distinct |
| `email_verified_at` | Timestamp when the user's email address was verified. |  |  |
| `work_email` | User's official GC work email address. |  | Unique; case-insensitively unique across email and work_email; verified via verifyUserEmails, which requires a government domain (`GovernmentEmailRegex`) and takes it from any other user holding it |
| `work_email_verified_at` | Timestamp when the work email was verified. |  |  |
| `last_sign_in_at` | Timestamp of the user's most recent login. |  |  |
| `career_planning_mentorship_status` | Whether the user is currently a mentor, mentee, or neither. |  | Array of `Mentorship`: MENTOR, MENTEE |
| `career_planning_mentorship_interest` | Whether the user is interested in a mentorship relationship. |  | Array of `Mentorship`: MENTOR, MENTEE |
| `career_planning_exec_interest` | Whether the user is interested in executive-level opportunities. |  |  |
| `career_planning_exec_coaching_status` | Whether the user is currently receiving executive coaching. |  | Array of `ExecCoaching`: COACHING, LEARNING |
| `career_planning_exec_coaching_interest` | Whether the user is interested in executive coaching. |  | Array of `ExecCoaching`: COACHING, LEARNING |
| `career_planning_about_you` | Bilingual free-text self-description for career planning. |  |  |
| `career_planning_learning_goals` | Bilingual description of the user's learning and development goals. |  |  |
| `career_planning_work_style` | Bilingual description of the user's preferred working style. |  |  |
| `computed_gov_position_type` | Computed position type based on most recent GC work experience. |  | Enum `GovPositionType`: SUBSTANTIVE, ACTING, SECONDMENT, ASSIGNMENT; Computed from latest current government work experience (`ComputeGovEmployeeProfileData` listener); not directly editable |
| `computed_gov_end_date` | Computed end date of the user's most recent GC term position. |  | Computed from latest current government work experience (`ComputeGovEmployeeProfileData` listener); not directly editable |
| `next_role_classification_id` | FK to the classification the user is targeting for their next role. | FK → `classifications.id` |  |
| `career_objective_classification_id` | FK to the classification the user is targeting as a long-term career goal. | FK → `classifications.id` |  |
| `next_role_target_role` | Type of next role the user is seeking (e.g. same, promotion, lateral). |  | Enum `TargetRole`: INDIVIDUAL_CONTRIBUTOR, MANAGER, DIRECTOR, SENIOR_DIRECTOR, EXECUTIVE_DIRECTOR, DIRECTOR_GENERAL, ASSISTANT_DEPUTY_MINISTER, DEPUTY_MINISTER, OTHER |
| `career_objective_target_role` | Type of long-term career role the user is seeking. |  | Enum `TargetRole`: INDIVIDUAL_CONTRIBUTOR, MANAGER, DIRECTOR, SENIOR_DIRECTOR, EXECUTIVE_DIRECTOR, DIRECTOR_GENERAL, ASSISTANT_DEPUTY_MINISTER, DEPUTY_MINISTER, OTHER |
| `next_role_target_role_other` | Free-text if next role type is not in the standard list. |  | Required if next_role_target_role is OTHER, otherwise prohibited |
| `career_objective_target_role_other` | Free-text if career objective type is not in the standard list. |  | Required if career_objective_target_role is OTHER, otherwise prohibited |
| `next_role_job_title` | Bilingual plain-language title of the next role the user wants. |  |  |
| `career_objective_job_title` | Bilingual plain-language title of the user's long-term target role. |  |  |
| `next_role_community_id` | FK to the community the user wants to work in for their next role. | FK → `communities.id` | Mutually exclusive with next_role_community_other; if set, next role work streams must be provided |
| `career_objective_community_id` | FK to the community the user wants to work in long-term. | FK → `communities.id` | Mutually exclusive with career_objective_community_other; if set, career objective work streams must be provided |
| `next_role_additional_information` | Bilingual additional notes about the user's next role preferences. |  |  |
| `career_objective_additional_information` | Bilingual additional notes about the user's long-term career objectives. |  |  |
| `career_planning_lateral_move_interest` | Whether the user is interested in a lateral move. |  |  |
| `career_planning_lateral_move_time_frame` | Expected timeframe for a lateral move. |  | Enum `TimeFrame`: THIS_YEAR, ONE_TO_TWO_YEARS, THREE_OR_MORE_YEARS; required if lateral move interest is true |
| `career_planning_lateral_move_organization_type` | Type of organization the user wants for a lateral move. |  | Array of `OrganizationTypeInterest`: CURRENT, CPA, NON_CPA, CENTRAL_AGENCIES, SCIENCE_REGULATORY_AGENCY, MICRO, SMALL, MEDIUM, LARGE; required if lateral move interest is true |
| `career_planning_promotion_move_interest` | Whether the user is interested in a promotion. |  |  |
| `career_planning_promotion_move_time_frame` | Expected timeframe for a promotion. |  | Enum `TimeFrame`: THIS_YEAR, ONE_TO_TWO_YEARS, THREE_OR_MORE_YEARS; required if promotion move interest is true |
| `career_planning_promotion_move_organization_type` | Type of organization the user wants for a promotion. |  | Array of `OrganizationTypeInterest`: CURRENT, CPA, NON_CPA, CENTRAL_AGENCIES, SCIENCE_REGULATORY_AGENCY, MICRO, SMALL, MEDIUM, LARGE; required if promotion move interest is true |
| `computed_gov_role` | Computed description of the user's current GC role. |  | Computed from latest current government work experience (`ComputeGovEmployeeProfileData` listener); not directly editable |
| `next_role_community_other` | Free-text if the next role community is not in the standard list. |  | Mutually exclusive with next_role_community_id |
| `career_objective_community_other` | Free-text if the career objective community is not in the standard list. |  | Mutually exclusive with career_objective_community_id |
| `eligible_retirement_year_known` | Whether the user knows their eligible retirement year. |  |  |
| `eligible_retirement_year` | Year the user becomes eligible to retire. |  | Required if eligible_retirement_year_known is true; must be from start of current year to < 35 years from now |
| `next_role_is_c_suite_role` | Whether the user's next role target is a C-suite executive position. |  |  |
| `career_objective_is_c_suite_role` | Whether the user's long-term goal is a C-suite executive position. |  |  |
| `next_role_c_suite_role_title` | Title of the C-suite role the user wants next. |  | Enum `CSuiteRoleTitle` (14 cases, e.g. CHIEF_DATA_OFFICER, CHIEF_FINANCIAL_OFFICER, DEPUTY_CHIEF_INFORMATION_OFFICER, OTHER); required if next_role_is_c_suite_role true, prohibited if false |
| `career_objective_c_suite_role_title` | Title of the C-suite role the user wants long-term. |  | Enum `CSuiteRoleTitle` (14 cases, e.g. CHIEF_DATA_OFFICER, CHIEF_FINANCIAL_OFFICER, DEPUTY_CHIEF_INFORMATION_OFFICER, OTHER); required if career_objective_is_c_suite_role true, prohibited if false |
| `off_platform_recruitment_processes` | JSON summary of off-platform recruitment processes (denormalized). |  |  |
| `career_planning_learning_opportunities_interest` | Whether the user is interested in learning opportunities. |  | Array of `LearningOpportunitiesInterest`: INTERCHANGE, ACADEMIC_PROGRAM, PEER_NETWORKING, PROFESSIONAL_ACCREDITATION |
| `flexible_work_locations` | JSON array of flexible or remote work location preferences. |  | Array of `FlexibleWorkLocation`: REMOTE, HYBRID, ONSITE; default [] |
| `last_sign_in_iss` | OIDC issuer of the identity provider used at last sign-in. |  |  |
| `email_backup` | Backup email address for account recovery. |  | Holds email after soft delete; restored on user restore if no other user has that email |
| `work_email_backup` | Backup GC work email address. |  | Holds work_email after soft delete or when another user verifies the same work email |

**Referenced by:** `award_experiences.user_id`, `community_experiences.user_id`, `community_interests.user_id`, `department_user_career_objective.user_id`, `department_user_next_role.user_id`, `development_program_user.user_id`, `education_experiences.user_id`, `generic_job_title_user.user_id`, `off_platform_recruitment_processes.user_id`, `permission_user.user_id`, `personal_experiences.user_id`, `pool_candidate_search_requests.user_id`, `pool_candidate_user_bookmarks.user_id`, `pool_candidates.user_id`, `pool_user_bookmarks.user_id`, `pools.user_id`, `role_user.user_id`, `talent_nomination_groups.nominee_id`, `talent_nominations.advancement_reference_id`, `talent_nominations.nominator_id`, `talent_nominations.nominee_id`, `talent_nominations.submitter_id`, `user_search_indices.id`, `user_skills.user_id`, `user_work_stream_career_objective.user_id`, `user_work_stream_next_role.user_id`, `work_experiences.user_id`

---

## work_experience_work_stream

Junction table linking a work experience entry to one or more work streams, indicating which functional area(s) that experience falls under.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this link. |  |  |
| `work_experience_id` | FK to the work experience record. | FK → `work_experiences.id` |  |
| `work_stream_id` | FK to the associated work stream. | FK → `work_streams.id` |  |

---

## work_experiences

Applicant-reported employment history on their GC Talent profile. Captures both GC and non-GC positions with rich metadata about employment type, seniority, classification, and supervisory scope. Used as primary evidence for skills and to compute current GC employee status.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for this work experience. |  |  |
| `user_id` | FK to the user who held this position. | FK → `users.id` |  |
| `role` | Job title or role held. |  |  |
| `organization` | Name of the organization. |  |  |
| `division` | Division, branch, or team within the organization. |  |  |
| `start_date` | Date when employment in this role began. |  |  |
| `end_date` | Date when employment ended; null if current. |  |  |
| `details` | Free-text description of responsibilities and accomplishments. |  |  |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `deleted_at` | Soft-delete timestamp; null means the record is active. |  |  |
| `employment_category` | Whether the position was GC, Canadian military, or external. |  | Enum `EmploymentCategory`: EXTERNAL_ORGANIZATION, GOVERNMENT_OF_CANADA, CANADIAN_ARMED_FORCES; required if provided |
| `ext_size_of_organization` | For external roles: size of the organization (e.g. small, large). |  | Enum `ExternalSizeOfOrganization`: ONE_TO_THIRTY_FIVE, THIRTY_SIX_TO_ONE_HUNDRED, ONE_HUNDRED_ONE_TO_ONE_THOUSAND, ONE_THOUSAND_PLUS; required iff category is EXTERNAL_ORGANIZATION |
| `ext_role_seniority` | For external roles: seniority level of the position. |  | Enum `ExternalRoleSeniority`: INTERN_COOP, JUNIOR, INTERMEDIATE, SENIOR, TEAM_LEAD_MANAGER, EXECUTIVE, SENIOR_EXECUTIVE, SELF_EMPLOYED; required iff category is EXTERNAL_ORGANIZATION |
| `gov_employment_type` | For GC roles: employment type (e.g. indeterminate, term, casual). |  | Enum `GovEmployeeType`: STUDENT, CASUAL, TERM, INDETERMINATE, CONTRACTOR, INTERCHANGE; required iff category is GOVERNMENT_OF_CANADA |
| `gov_position_type` | For GC roles: position type (e.g. substantive, acting). |  | Enum `GovPositionType`: SUBSTANTIVE, ACTING, SECONDMENT, ASSIGNMENT; required iff gov employment type is INDETERMINATE |
| `gov_contractor_role_seniority` | For GC contractor roles: seniority level. |  | Enum `GovContractorRoleSeniority`: INTERN_COOP, JUNIOR, INTERMEDIATE, SENIOR, TEAM_LEAD_MANAGER, EXECUTIVE, SENIOR_EXECUTIVE; required if gov employment type is CONTRACTOR |
| `gov_contractor_type` | For GC roles: type of contractor arrangement. |  | Enum `GovContractorType`: SELF_EMPLOYED, FIRM_OR_AGENCY; required if gov employment type is CONTRACTOR |
| `caf_employment_type` | For CAF roles: type of military service. |  | Enum `CafEmploymentType`: REGULAR_FORCE, RESERVE_FORCE; required iff category is CANADIAN_ARMED_FORCES |
| `caf_force` | For CAF roles: branch of the Canadian Armed Forces. |  | Enum `CafForce`: CANADIAN_ARMY, ROYAL_CANADIAN_AIR_FORCE, ROYAL_CANADIAN_NAVY; required iff category is CANADIAN_ARMED_FORCES |
| `caf_rank` | For CAF roles: military rank held. |  | Enum `CafRank`: GENERAL_FLAG_OFFICER, SENIOR_OFFICER, JUNIOR_OFFICER, SUBORDINATE_OFFICER, WARRANT_PETTY_SENIOR_NCO, JUNIOR_NON_COMMISSIONED; required iff category is CANADIAN_ARMED_FORCES |
| `classification_id` | FK to the GC classification of the position. | FK → `classifications.id` | Required for GOVERNMENT_OF_CANADA with CASUAL, TERM, INDETERMINATE or INTERCHANGE employment |
| `department_id` | FK to the GC department where the role was held. | FK → `departments.id` | Required if category is GOVERNMENT_OF_CANADA; must exist |
| `contractor_firm_agency_name` | Name of the contracting firm or agency, if applicable. |  | Required iff gov contractor type is FIRM_OR_AGENCY |
| `supervisory_position` | Whether the role involved supervisory responsibilities. |  |  |
| `supervised_employees` | Whether the user directly supervised other employees. |  |  |
| `supervised_employees_number` | Approximate number of employees supervised. |  | Required if supervisory_position and supervised_employees are true |
| `budget_management` | Whether the role involved managing a budget. |  |  |
| `annual_budget_allocation` | Approximate annual budget managed, if applicable. |  | bigint; required if supervisory_position and budget_management are true |
| `senior_management_status` | Whether the role was at a senior management level. |  |  |
| `c_suite_role_title` | C-suite title if the role was at the executive level. |  | Enum `CSuiteRoleTitle` (14 cases, e.g. CHIEF_DATA_OFFICER, CHIEF_FINANCIAL_OFFICER, DEPUTY_CHIEF_INFORMATION_OFFICER, OTHER); required if supervisory_position and senior_management_status are true |
| `other_c_suite_role_title` | Free-text C-suite title if not in the standard list. |  |  |

**Referenced by:** `work_experience_work_stream.work_experience_id`

---

## work_streams

Functional specializations within a community (e.g. 'Data Science', 'Cloud Operations', 'Policy'). Work streams organize pools, job templates, and user career preferences within a community.

| Column | Description | Relationship | Constraints |
|--------|-------------|--------------|-------------|
| `id` | Unique identifier for the work stream. |  |  |
| `key` | Machine-readable slug for the work stream. |  | Unique |
| `name` | Bilingual display name of the work stream. |  | Localized string {en, fr}; required on create; each language value must be unique across work streams |
| `plain_language_name` | Bilingual plain-language label for non-specialist audiences. |  |  |
| `community_id` | FK to the community this work stream belongs to. | FK → `communities.id` | Required |
| `created_at` | Timestamp when the record was created. |  |  |
| `updated_at` | Timestamp when the record was last modified. |  |  |
| `talent_searchable` | Whether this work stream is included in talent search filters. |  | Required on create; default true |

**Referenced by:** `applicant_filter_work_stream.work_stream_id`, `community_interest_work_stream.work_stream_id`, `job_poster_templates.work_stream_id`, `pools.work_stream_id`, `user_work_stream_career_objective.work_stream_id`, `user_work_stream_next_role.work_stream_id`, `work_experience_work_stream.work_stream_id`

---

