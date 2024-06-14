--
-- PostgreSQL database dump
--

-- Dumped from database version 12.15 (Debian 12.15-1.pgdg120+1)
-- Dumped by pg_dump version 14.12 (Ubuntu 14.12-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_log (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    log_name character varying(255),
    description text NOT NULL,
    subject_type character varying(255),
    subject_id uuid,
    causer_type character varying(255),
    causer_id uuid,
    properties json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    event character varying(255),
    batch_uuid uuid
);


--
-- Name: applicant_filter_classification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applicant_filter_classification (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    applicant_filter_id uuid NOT NULL,
    classification_id uuid NOT NULL
);


--
-- Name: applicant_filter_pool; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applicant_filter_pool (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    applicant_filter_id uuid NOT NULL,
    pool_id uuid NOT NULL
);


--
-- Name: applicant_filter_qualified_classification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applicant_filter_qualified_classification (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    applicant_filter_id uuid NOT NULL,
    classification_id uuid NOT NULL
);


--
-- Name: applicant_filter_skill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applicant_filter_skill (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    applicant_filter_id uuid NOT NULL,
    skill_id uuid NOT NULL
);


--
-- Name: applicant_filters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applicant_filters (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    has_diploma boolean,
    has_disability boolean,
    is_indigenous boolean,
    is_visible_minority boolean,
    is_woman boolean,
    language_ability character varying(255),
    location_preferences jsonb,
    operational_requirements jsonb,
    position_duration jsonb,
    qualified_streams jsonb DEFAULT '[]'::jsonb NOT NULL,
    community_id uuid NOT NULL
);


--
-- Name: assessment_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_results (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    assessment_step_id uuid NOT NULL,
    pool_candidate_id uuid NOT NULL,
    pool_skill_id uuid,
    assessment_result_type character varying(255),
    assessment_decision character varying(255),
    justifications jsonb DEFAULT '[]'::jsonb,
    assessment_decision_level character varying(255),
    skill_decision_notes text
);


--
-- Name: assessment_step_pool_skill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_step_pool_skill (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    assessment_step_id uuid NOT NULL,
    pool_skill_id uuid NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: assessment_steps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_steps (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    pool_id uuid NOT NULL,
    sort_order integer,
    type character varying(255),
    title jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: classification_pool_candidate_filter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classification_pool_candidate_filter (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    pool_candidate_filter_id uuid NOT NULL,
    classification_id uuid NOT NULL
);


--
-- Name: classifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classifications (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    name jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb NOT NULL,
    "group" character varying(255) NOT NULL,
    level integer NOT NULL,
    min_salary integer,
    max_salary integer,
    deleted_at timestamp(0) without time zone,
    CONSTRAINT classifications_chk_level CHECK ((level >= 0)),
    CONSTRAINT classifications_chk_salary CHECK (((COALESCE(min_salary, 0) >= 0) AND (COALESCE(min_salary, 0) <= COALESCE(max_salary, 2147483647))))
);


--
-- Name: communities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communities (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    key character varying(255) NOT NULL,
    name jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb,
    description jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb
);


--
-- Name: department_specific_recruitment_process_forms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_specific_recruitment_process_forms (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    department_id uuid,
    department_other character varying(255),
    recruitment_process_lead_name character varying(255),
    recruitment_process_lead_job_title character varying(255),
    recruitment_process_lead_email character varying(255),
    posting_date date,
    advertisement_type character varying(255),
    advertising_platforms jsonb DEFAULT '[]'::jsonb NOT NULL,
    advertising_platforms_other character varying(255),
    job_advertisement_link character varying(255)
);


--
-- Name: department_specific_recruitment_process_positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_specific_recruitment_process_positions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    department_specific_recruitment_process_form_id uuid NOT NULL,
    classification_group character varying(255),
    classification_level character varying(255),
    job_title character varying(255),
    employment_types jsonb DEFAULT '[]'::jsonb NOT NULL,
    employment_types_other character varying(255)
);


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    department_number integer NOT NULL,
    name jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb NOT NULL,
    deleted_at timestamp(0) without time zone
);


--
-- Name: digital_contracting_personnel_requirements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.digital_contracting_personnel_requirements (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    digital_contracting_questionnaire_id uuid NOT NULL,
    resource_type character varying(255),
    language character varying(255),
    language_other character varying(255),
    security character varying(255),
    security_other character varying(255),
    telework character varying(255),
    quantity integer
);


--
-- Name: digital_contracting_personnel_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.digital_contracting_personnel_skills (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    digital_contracting_personnel_requirement_id uuid NOT NULL,
    skill_id uuid,
    level character varying(255)
);


--
-- Name: digital_contracting_questionnaires; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.digital_contracting_questionnaires (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    department_id uuid,
    department_other character varying(255),
    branch_other character varying(255),
    business_owner_name character varying(255),
    business_owner_job_title character varying(255),
    business_owner_email character varying(255),
    financial_authority_name character varying(255),
    financial_authority_job_title character varying(255),
    financial_authority_email character varying(255),
    authorities_involved jsonb DEFAULT '[]'::jsonb,
    authority_involved_other character varying(255),
    contract_behalf_of_gc character varying(255),
    contract_service_of_gc character varying(255),
    contract_for_digital_initiative character varying(255),
    digital_initiative_name character varying(255),
    digital_initiative_plan_submitted character varying(255),
    digital_initiative_plan_updated character varying(255),
    digital_initiative_plan_complemented character varying(255),
    contract_title character varying(255),
    contract_start_date date,
    contract_end_date date,
    contract_extendable character varying(255),
    contract_amendable character varying(255),
    contract_multiyear character varying(255),
    contract_value character varying(255),
    contract_resources_start_timeframe character varying(255),
    commodity_type character varying(255),
    commodity_type_other character varying(255),
    instrument_type character varying(255),
    method_of_supply character varying(255),
    method_of_supply_other character varying(255),
    solicitation_procedure character varying(255),
    subject_to_trade_agreement character varying(255),
    work_requirement_description text,
    qualification_requirement text,
    requirement_access_to_secure character varying(255),
    requirement_screening_levels jsonb DEFAULT '[]'::jsonb,
    requirement_screening_level_other character varying(255),
    requirement_work_languages jsonb DEFAULT '[]'::jsonb,
    requirement_work_language_other character varying(255),
    requirement_work_locations jsonb DEFAULT '[]'::jsonb,
    requirement_others jsonb DEFAULT '[]'::jsonb,
    requirement_other_other character varying(255),
    has_personnel_requirements character varying(255),
    is_technological_change character varying(255),
    has_impact_on_your_department character varying(255),
    has_immediate_impact_on_other_departments character varying(255),
    has_future_impact_on_other_departments character varying(255),
    operations_considerations jsonb DEFAULT '[]'::jsonb,
    operations_considerations_other character varying(255),
    contracting_rationale_primary character varying(255),
    contracting_rationale_primary_other character varying(255),
    contracting_rationales_secondary jsonb DEFAULT '[]'::jsonb,
    contracting_rationales_secondary_other character varying(255),
    ocio_confirmed_talent_shortage character varying(255),
    talent_search_tracking_number character varying(255),
    ongoing_need_for_knowledge character varying(255),
    knowledge_transfer_in_contract character varying(255),
    employees_have_access_to_knowledge character varying(255),
    ocio_engaged_for_training character varying(255),
    requirement_work_location_gc_specific character varying(255),
    requirement_work_location_offsite_specific character varying(255),
    contract_ftes character varying(255),
    instrument_type_other character varying(255)
);


--
-- Name: experience_skill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.experience_skill (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    details text,
    experience_id uuid NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    user_skill_id uuid NOT NULL,
    deleted_at date
);


--
-- Name: experiences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.experiences (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone,
    user_id uuid NOT NULL,
    details text,
    experience_type character varying(255) NOT NULL,
    properties jsonb
);


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: general_question_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.general_question_responses (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    pool_candidate_id uuid NOT NULL,
    general_question_id uuid NOT NULL,
    answer text NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: general_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.general_questions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    pool_id uuid NOT NULL,
    sort_order integer,
    question jsonb NOT NULL,
    deleted_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: generic_job_title_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.generic_job_title_user (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone,
    generic_job_title_id uuid NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: generic_job_titles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.generic_job_titles (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone,
    key character varying(255) NOT NULL,
    name jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb NOT NULL,
    classification_id uuid NOT NULL
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    type character varying(255) NOT NULL,
    notifiable_type character varying(255) NOT NULL,
    notifiable_id uuid NOT NULL,
    data jsonb NOT NULL,
    read_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: permission_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permission_role (
    permission_id uuid NOT NULL,
    role_id uuid NOT NULL
);


--
-- Name: permission_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permission_user (
    permission_id uuid NOT NULL,
    user_id uuid NOT NULL,
    user_type character varying(255) NOT NULL,
    team_id uuid
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    display_name jsonb,
    description jsonb,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: pool_candidate_education_requirement_experience; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pool_candidate_education_requirement_experience (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    pool_candidate_id uuid NOT NULL,
    experience_id uuid NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: pool_candidate_filters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pool_candidate_filters (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    is_woman boolean,
    has_diploma boolean,
    has_disability boolean,
    is_indigenous boolean,
    is_visible_minority boolean,
    language_ability character varying(255),
    work_regions jsonb,
    deleted_at timestamp(0) without time zone,
    operational_requirements jsonb
);


--
-- Name: pool_candidate_search_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pool_candidate_search_requests (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    job_title character varying(255) NOT NULL,
    additional_comments text,
    pool_candidate_filter_id uuid,
    admin_notes text,
    deleted_at timestamp(0) without time zone,
    department_id uuid NOT NULL,
    applicant_filter_id uuid,
    request_status_changed_at timestamp(0) without time zone,
    was_empty boolean DEFAULT false NOT NULL,
    request_status character varying(255) DEFAULT 'NEW'::character varying NOT NULL,
    manager_job_title character varying(255),
    position_type character varying(255),
    reason character varying(255),
    hr_advisor_email character varying(255),
    request_status_weight integer GENERATED ALWAYS AS (
CASE
    WHEN ((request_status)::text = 'NEW'::text) THEN 10
    WHEN ((request_status)::text = 'IN_PROGRESS'::text) THEN 20
    WHEN ((request_status)::text = 'WAITING'::text) THEN 30
    WHEN ((request_status)::text = 'DONE'::text) THEN 40
    WHEN ((request_status)::text = 'DONE_NO_CANDIDATES'::text) THEN 41
    WHEN ((request_status)::text = 'NOT_COMPLIANT'::text) THEN 50
    ELSE NULL::integer
END) STORED,
    community_id uuid NOT NULL
);


--
-- Name: pool_candidates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pool_candidates (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    expiry_date date,
    pool_candidate_status character varying(255),
    pool_id uuid NOT NULL,
    user_id uuid NOT NULL,
    deleted_at timestamp(0) without time zone,
    notes text,
    archived_at timestamp(0) without time zone,
    submitted_at timestamp(0) without time zone,
    signature character varying(255),
    profile_snapshot jsonb,
    suspended_at timestamp(0) without time zone,
    submitted_steps jsonb DEFAULT '[]'::jsonb NOT NULL,
    education_requirement_option character varying(255),
    is_bookmarked boolean DEFAULT false NOT NULL,
    status_weight integer GENERATED ALWAYS AS (
CASE
    WHEN ((pool_candidate_status)::text = 'DRAFT'::text) THEN 10
    WHEN ((pool_candidate_status)::text = 'DRAFT_EXPIRED'::text) THEN 20
    WHEN ((pool_candidate_status)::text = 'NEW_APPLICATION'::text) THEN 30
    WHEN ((pool_candidate_status)::text = 'APPLICATION_REVIEW'::text) THEN 40
    WHEN ((pool_candidate_status)::text = 'SCREENED_IN'::text) THEN 50
    WHEN ((pool_candidate_status)::text = 'SCREENED_OUT_APPLICATION'::text) THEN 60
    WHEN ((pool_candidate_status)::text = 'SCREENED_OUT_NOT_INTERESTED'::text) THEN 64
    WHEN ((pool_candidate_status)::text = 'SCREENED_OUT_NOT_RESPONSIVE'::text) THEN 65
    WHEN ((pool_candidate_status)::text = 'UNDER_ASSESSMENT'::text) THEN 70
    WHEN ((pool_candidate_status)::text = 'SCREENED_OUT_ASSESSMENT'::text) THEN 80
    WHEN ((pool_candidate_status)::text = 'QUALIFIED_AVAILABLE'::text) THEN 90
    WHEN ((pool_candidate_status)::text = 'QUALIFIED_UNAVAILABLE'::text) THEN 100
    WHEN ((pool_candidate_status)::text = 'QUALIFIED_WITHDREW'::text) THEN 110
    WHEN ((pool_candidate_status)::text = 'PLACED_TENTATIVE'::text) THEN 115
    WHEN ((pool_candidate_status)::text = 'PLACED_CASUAL'::text) THEN 120
    WHEN ((pool_candidate_status)::text = 'PLACED_TERM'::text) THEN 130
    WHEN ((pool_candidate_status)::text = 'PLACED_INDETERMINATE'::text) THEN 140
    WHEN ((pool_candidate_status)::text = 'EXPIRED'::text) THEN 150
    WHEN ((pool_candidate_status)::text = 'REMOVED'::text) THEN 160
    ELSE NULL::integer
END) STORED,
    placed_at timestamp(0) without time zone,
    placed_department_id uuid,
    removed_at timestamp(0) without time zone,
    removal_reason character varying(255),
    removal_reason_other text,
    final_decision_at timestamp(0) without time zone,
    veteran_verification character varying(255),
    veteran_verification_expiry date,
    priority_verification character varying(255),
    priority_verification_expiry date
);


--
-- Name: pool_pool_candidate_filter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pool_pool_candidate_filter (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    pool_candidate_filter_id uuid NOT NULL,
    pool_id uuid NOT NULL
);


--
-- Name: pool_skill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pool_skill (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    skill_id uuid NOT NULL,
    pool_id uuid NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    type character varying(255) NOT NULL,
    required_skill_level character varying(255)
);


--
-- Name: pool_user_bookmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pool_user_bookmarks (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    pool_id uuid NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: pools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pools (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    name jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb NOT NULL,
    user_id uuid NOT NULL,
    deleted_at timestamp(0) without time zone,
    operational_requirements jsonb,
    key_tasks jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb NOT NULL,
    closing_date timestamp(0) without time zone,
    your_impact jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb,
    advertisement_location jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb,
    security_clearance character varying(255),
    advertisement_language character varying(255),
    is_remote boolean,
    stream character varying(255),
    process_number character varying(255),
    publishing_group character varying(255),
    published_at timestamp(0) without time zone,
    team_id uuid NOT NULL,
    what_to_expect jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb,
    archived_at timestamp(0) without time zone,
    special_note jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb,
    opportunity_length character varying(255),
    what_to_expect_admission jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb,
    about_us jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb,
    classification_id uuid NOT NULL,
    closing_reason text,
    change_justification text
);


--
-- Name: role_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_user (
    role_id uuid NOT NULL,
    user_id uuid NOT NULL,
    user_type character varying(255) NOT NULL,
    team_id uuid,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    display_name jsonb,
    description jsonb,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    is_team_based boolean
);


--
-- Name: screening_question_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.screening_question_responses (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    pool_candidate_id uuid NOT NULL,
    screening_question_id uuid NOT NULL,
    answer text NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: screening_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.screening_questions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    pool_id uuid NOT NULL,
    assessment_step_id uuid NOT NULL,
    sort_order integer,
    question jsonb NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    key character varying(255) NOT NULL,
    value jsonb
);


--
-- Name: skill_families; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skill_families (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    key character varying(255) NOT NULL,
    name jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb NOT NULL,
    description jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: skill_skill_family; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skill_skill_family (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    skill_id uuid NOT NULL,
    skill_family_id uuid NOT NULL
);


--
-- Name: skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skills (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    key character varying(255) NOT NULL,
    name jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb NOT NULL,
    description jsonb DEFAULT '{"en": "", "fr": ""}'::jsonb NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone,
    keywords jsonb DEFAULT '{"en": [], "fr": []}'::jsonb,
    category character varying(255) DEFAULT 'TECHNICAL'::character varying NOT NULL
);


--
-- Name: team_department; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_department (
    team_id uuid NOT NULL,
    department_id uuid NOT NULL
);


--
-- Name: teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teams (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    display_name jsonb,
    description jsonb,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    contact_email character varying(255)
);


--
-- Name: user_search_indices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_search_indices (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    searchable tsvector
);


--
-- Name: user_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_skills (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone,
    user_id uuid NOT NULL,
    skill_id uuid NOT NULL,
    skill_level character varying(255),
    when_skill_used character varying(255),
    top_skills_rank integer,
    improve_skills_rank integer
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    email character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    telephone character varying(255),
    preferred_lang character varying(255),
    deleted_at timestamp(0) without time zone,
    sub character varying(255),
    current_province character varying(255),
    current_city character varying(255),
    looking_for_english boolean,
    looking_for_french boolean,
    looking_for_bilingual boolean,
    comprehension_level character varying(255),
    written_level character varying(255),
    verbal_level character varying(255),
    estimated_language_ability character varying(255),
    is_gov_employee boolean,
    current_classification uuid,
    location_exemptions text,
    is_woman boolean,
    has_disability boolean,
    is_visible_minority boolean,
    has_diploma boolean,
    location_preferences jsonb,
    accepted_operational_requirements jsonb,
    gov_employee_type character varying(255),
    department uuid,
    citizenship character varying(255),
    armed_forces_status character varying(255),
    has_priority_entitlement boolean,
    priority_number character varying(255),
    priority_weight integer GENERATED ALWAYS AS (
CASE
    WHEN (has_priority_entitlement = true) THEN 10
    WHEN ((armed_forces_status)::text = 'VETERAN'::text) THEN 20
    WHEN (((citizenship)::text = 'CITIZEN'::text) OR ((citizenship)::text = 'PERMANENT_RESIDENT'::text)) THEN 30
    ELSE 40
END) STORED,
    position_duration jsonb,
    indigenous_declaration_signature character varying(255),
    indigenous_communities jsonb,
    preferred_language_for_interview character varying(255),
    preferred_language_for_exam character varying(255),
    first_official_language character varying(255),
    second_language_exam_completed boolean,
    second_language_exam_validity boolean,
    enabled_email_notifications jsonb,
    enabled_in_app_notifications jsonb,
    email_verified_at timestamp(0) without time zone
);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- Name: applicant_filter_classification applicant_filter_classification_applicant_filter_id_classificat; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_classification
    ADD CONSTRAINT applicant_filter_classification_applicant_filter_id_classificat UNIQUE (applicant_filter_id, classification_id);


--
-- Name: applicant_filter_classification applicant_filter_classification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_classification
    ADD CONSTRAINT applicant_filter_classification_pkey PRIMARY KEY (id);


--
-- Name: applicant_filter_pool applicant_filter_pool_applicant_filter_id_pool_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_pool
    ADD CONSTRAINT applicant_filter_pool_applicant_filter_id_pool_id_unique UNIQUE (applicant_filter_id, pool_id);


--
-- Name: applicant_filter_pool applicant_filter_pool_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_pool
    ADD CONSTRAINT applicant_filter_pool_pkey PRIMARY KEY (id);


--
-- Name: applicant_filter_qualified_classification applicant_filter_qualified_classification_applicant_filter_id_c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_qualified_classification
    ADD CONSTRAINT applicant_filter_qualified_classification_applicant_filter_id_c UNIQUE (applicant_filter_id, classification_id);


--
-- Name: applicant_filter_qualified_classification applicant_filter_qualified_classification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_qualified_classification
    ADD CONSTRAINT applicant_filter_qualified_classification_pkey PRIMARY KEY (id);


--
-- Name: applicant_filter_skill applicant_filter_skill_applicant_filter_id_skill_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_skill
    ADD CONSTRAINT applicant_filter_skill_applicant_filter_id_skill_id_unique UNIQUE (applicant_filter_id, skill_id);


--
-- Name: applicant_filter_skill applicant_filter_skill_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_skill
    ADD CONSTRAINT applicant_filter_skill_pkey PRIMARY KEY (id);


--
-- Name: applicant_filters applicant_filters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filters
    ADD CONSTRAINT applicant_filters_pkey PRIMARY KEY (id);


--
-- Name: assessment_results assessment_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_results
    ADD CONSTRAINT assessment_results_pkey PRIMARY KEY (id);


--
-- Name: assessment_step_pool_skill assessment_step_pool_skill_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_step_pool_skill
    ADD CONSTRAINT assessment_step_pool_skill_pkey PRIMARY KEY (id);


--
-- Name: assessment_steps assessment_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_steps
    ADD CONSTRAINT assessment_steps_pkey PRIMARY KEY (id);


--
-- Name: classification_pool_candidate_filter classification_pool_candidate_filter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classification_pool_candidate_filter
    ADD CONSTRAINT classification_pool_candidate_filter_pkey PRIMARY KEY (id);


--
-- Name: classifications classifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classifications
    ADD CONSTRAINT classifications_pkey PRIMARY KEY (id);


--
-- Name: communities communities_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT communities_key_unique UNIQUE (key);


--
-- Name: communities communities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT communities_pkey PRIMARY KEY (id);


--
-- Name: department_specific_recruitment_process_forms department_specific_recruitment_process_forms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_specific_recruitment_process_forms
    ADD CONSTRAINT department_specific_recruitment_process_forms_pkey PRIMARY KEY (id);


--
-- Name: department_specific_recruitment_process_positions department_specific_recruitment_process_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_specific_recruitment_process_positions
    ADD CONSTRAINT department_specific_recruitment_process_positions_pkey PRIMARY KEY (id);


--
-- Name: departments departments_department_number_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_department_number_unique UNIQUE (department_number);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: digital_contracting_personnel_requirements digital_contracting_personnel_requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_contracting_personnel_requirements
    ADD CONSTRAINT digital_contracting_personnel_requirements_pkey PRIMARY KEY (id);


--
-- Name: digital_contracting_personnel_skills digital_contracting_personnel_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_contracting_personnel_skills
    ADD CONSTRAINT digital_contracting_personnel_skills_pkey PRIMARY KEY (id);


--
-- Name: digital_contracting_questionnaires digital_contracting_questionnaires_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_contracting_questionnaires
    ADD CONSTRAINT digital_contracting_questionnaires_pkey PRIMARY KEY (id);


--
-- Name: experience_skill experience_skill_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experience_skill
    ADD CONSTRAINT experience_skill_pkey PRIMARY KEY (id);


--
-- Name: experience_skill experience_user_skill_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experience_skill
    ADD CONSTRAINT experience_user_skill_unique UNIQUE (user_skill_id, experience_id);


--
-- Name: experiences experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: general_question_responses general_question_responses_pool_candidate_id_general_question_i; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.general_question_responses
    ADD CONSTRAINT general_question_responses_pool_candidate_id_general_question_i UNIQUE (pool_candidate_id, general_question_id);


--
-- Name: generic_job_title_user generic_job_title_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generic_job_title_user
    ADD CONSTRAINT generic_job_title_user_pkey PRIMARY KEY (id);


--
-- Name: generic_job_title_user generic_job_title_user_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generic_job_title_user
    ADD CONSTRAINT generic_job_title_user_unique UNIQUE (generic_job_title_id, user_id);


--
-- Name: generic_job_titles generic_job_titles_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generic_job_titles
    ADD CONSTRAINT generic_job_titles_key_unique UNIQUE (key);


--
-- Name: generic_job_titles generic_job_titles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generic_job_titles
    ADD CONSTRAINT generic_job_titles_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: permission_role permission_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_role
    ADD CONSTRAINT permission_role_pkey PRIMARY KEY (permission_id, role_id);


--
-- Name: permission_user permission_user_user_id_permission_id_user_type_team_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_user
    ADD CONSTRAINT permission_user_user_id_permission_id_user_type_team_id_unique UNIQUE (user_id, permission_id, user_type, team_id);


--
-- Name: permissions permissions_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_unique UNIQUE (name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: pool_candidate_education_requirement_experience pool_candidate_education_requirement_experience_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidate_education_requirement_experience
    ADD CONSTRAINT pool_candidate_education_requirement_experience_pkey PRIMARY KEY (id);


--
-- Name: pool_candidate_filters pool_candidate_filters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidate_filters
    ADD CONSTRAINT pool_candidate_filters_pkey PRIMARY KEY (id);


--
-- Name: pool_candidate_search_requests pool_candidate_search_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidate_search_requests
    ADD CONSTRAINT pool_candidate_search_requests_pkey PRIMARY KEY (id);


--
-- Name: pool_candidates pool_candidates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidates
    ADD CONSTRAINT pool_candidates_pkey PRIMARY KEY (id);


--
-- Name: pool_candidates pool_candidates_pool_user_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidates
    ADD CONSTRAINT pool_candidates_pool_user_unique UNIQUE (pool_id, user_id);


--
-- Name: pool_pool_candidate_filter pool_pool_candidate_filter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_pool_candidate_filter
    ADD CONSTRAINT pool_pool_candidate_filter_pkey PRIMARY KEY (id);


--
-- Name: pool_skill pool_skill_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_skill
    ADD CONSTRAINT pool_skill_pkey PRIMARY KEY (id);


--
-- Name: pool_skill pool_skill_skill_id_pool_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_skill
    ADD CONSTRAINT pool_skill_skill_id_pool_id_unique UNIQUE (skill_id, pool_id);


--
-- Name: pool_user_bookmarks pool_user_bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_user_bookmarks
    ADD CONSTRAINT pool_user_bookmarks_pkey PRIMARY KEY (id);


--
-- Name: pool_user_bookmarks pool_user_bookmarks_pool_id_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_user_bookmarks
    ADD CONSTRAINT pool_user_bookmarks_pool_id_user_id_unique UNIQUE (pool_id, user_id);


--
-- Name: pools pools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pools
    ADD CONSTRAINT pools_pkey PRIMARY KEY (id);


--
-- Name: role_user role_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_user
    ADD CONSTRAINT role_user_pkey PRIMARY KEY (id);


--
-- Name: role_user role_user_user_id_role_id_user_type_team_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_user
    ADD CONSTRAINT role_user_user_id_role_id_user_type_team_id_unique UNIQUE (user_id, role_id, user_type, team_id);


--
-- Name: roles roles_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_unique UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: general_question_responses screening_question_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.general_question_responses
    ADD CONSTRAINT screening_question_responses_pkey PRIMARY KEY (id);


--
-- Name: screening_question_responses screening_question_responses_pkey1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening_question_responses
    ADD CONSTRAINT screening_question_responses_pkey1 PRIMARY KEY (id);


--
-- Name: screening_question_responses screening_question_responses_pool_candidate_id_screening_questi; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening_question_responses
    ADD CONSTRAINT screening_question_responses_pool_candidate_id_screening_questi UNIQUE (pool_candidate_id, screening_question_id);


--
-- Name: general_questions screening_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.general_questions
    ADD CONSTRAINT screening_questions_pkey PRIMARY KEY (id);


--
-- Name: screening_questions screening_questions_pkey1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening_questions
    ADD CONSTRAINT screening_questions_pkey1 PRIMARY KEY (id);


--
-- Name: settings settings_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_key_unique UNIQUE (key);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: skill_families skill_families_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_families
    ADD CONSTRAINT skill_families_key_unique UNIQUE (key);


--
-- Name: skill_families skill_families_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_families
    ADD CONSTRAINT skill_families_pkey PRIMARY KEY (id);


--
-- Name: skill_skill_family skill_skill_family_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_skill_family
    ADD CONSTRAINT skill_skill_family_pkey PRIMARY KEY (id);


--
-- Name: skill_skill_family skill_skill_family_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_skill_family
    ADD CONSTRAINT skill_skill_family_unique UNIQUE (skill_id, skill_family_id);


--
-- Name: skills skills_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_key_unique UNIQUE (key);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: teams teams_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_name_unique UNIQUE (name);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: digital_contracting_personnel_skills uq_personnel_requirement_skills; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_contracting_personnel_skills
    ADD CONSTRAINT uq_personnel_requirement_skills UNIQUE (digital_contracting_personnel_requirement_id, skill_id);


--
-- Name: user_search_indices user_search_indices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_search_indices
    ADD CONSTRAINT user_search_indices_pkey PRIMARY KEY (id);


--
-- Name: user_skills user_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_pkey PRIMARY KEY (id);


--
-- Name: user_skills user_skills_user_id_skill_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_user_id_skill_id_unique UNIQUE (user_id, skill_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_sub_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_sub_unique UNIQUE (sub);


--
-- Name: activity_log_log_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activity_log_log_name_index ON public.activity_log USING btree (log_name);


--
-- Name: causer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX causer ON public.activity_log USING btree (causer_type, causer_id);


--
-- Name: experiences_experience_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX experiences_experience_type_index ON public.experiences USING btree (experience_type);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: notifications_notifiable_type_notifiable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_notifiable_type_notifiable_id_index ON public.notifications USING btree (notifiable_type, notifiable_id);


--
-- Name: subject; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX subject ON public.activity_log USING btree (subject_type, subject_id);


--
-- Name: users_created_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_created_at_index ON public.users USING btree (created_at);


--
-- Name: users_searchable_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_searchable_index ON public.user_search_indices USING gin (searchable);


--
-- Name: applicant_filter_classification applicant_filter_classification_applicant_filter_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_classification
    ADD CONSTRAINT applicant_filter_classification_applicant_filter_id_foreign FOREIGN KEY (applicant_filter_id) REFERENCES public.applicant_filters(id);


--
-- Name: applicant_filter_classification applicant_filter_classification_classification_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_classification
    ADD CONSTRAINT applicant_filter_classification_classification_id_foreign FOREIGN KEY (classification_id) REFERENCES public.classifications(id);


--
-- Name: applicant_filter_pool applicant_filter_pool_applicant_filter_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_pool
    ADD CONSTRAINT applicant_filter_pool_applicant_filter_id_foreign FOREIGN KEY (applicant_filter_id) REFERENCES public.applicant_filters(id);


--
-- Name: applicant_filter_pool applicant_filter_pool_pool_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_pool
    ADD CONSTRAINT applicant_filter_pool_pool_id_foreign FOREIGN KEY (pool_id) REFERENCES public.pools(id);


--
-- Name: applicant_filter_qualified_classification applicant_filter_qualified_classification_applicant_filter_id_f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_qualified_classification
    ADD CONSTRAINT applicant_filter_qualified_classification_applicant_filter_id_f FOREIGN KEY (applicant_filter_id) REFERENCES public.applicant_filters(id);


--
-- Name: applicant_filter_qualified_classification applicant_filter_qualified_classification_classification_id_for; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_qualified_classification
    ADD CONSTRAINT applicant_filter_qualified_classification_classification_id_for FOREIGN KEY (classification_id) REFERENCES public.classifications(id);


--
-- Name: applicant_filter_skill applicant_filter_skill_applicant_filter_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_skill
    ADD CONSTRAINT applicant_filter_skill_applicant_filter_id_foreign FOREIGN KEY (applicant_filter_id) REFERENCES public.applicant_filters(id);


--
-- Name: applicant_filter_skill applicant_filter_skill_skill_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filter_skill
    ADD CONSTRAINT applicant_filter_skill_skill_id_foreign FOREIGN KEY (skill_id) REFERENCES public.skills(id);


--
-- Name: applicant_filters applicant_filters_community_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_filters
    ADD CONSTRAINT applicant_filters_community_id_foreign FOREIGN KEY (community_id) REFERENCES public.communities(id);


--
-- Name: assessment_results assessment_results_assessment_step_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_results
    ADD CONSTRAINT assessment_results_assessment_step_id_foreign FOREIGN KEY (assessment_step_id) REFERENCES public.assessment_steps(id);


--
-- Name: assessment_results assessment_results_pool_candidate_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_results
    ADD CONSTRAINT assessment_results_pool_candidate_id_foreign FOREIGN KEY (pool_candidate_id) REFERENCES public.pool_candidates(id) ON DELETE CASCADE;


--
-- Name: assessment_results assessment_results_pool_skill_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_results
    ADD CONSTRAINT assessment_results_pool_skill_id_foreign FOREIGN KEY (pool_skill_id) REFERENCES public.pool_skill(id);


--
-- Name: assessment_step_pool_skill assessment_step_pool_skill_assessment_step_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_step_pool_skill
    ADD CONSTRAINT assessment_step_pool_skill_assessment_step_id_foreign FOREIGN KEY (assessment_step_id) REFERENCES public.assessment_steps(id) ON DELETE CASCADE;


--
-- Name: assessment_step_pool_skill assessment_step_pool_skill_pool_skill_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_step_pool_skill
    ADD CONSTRAINT assessment_step_pool_skill_pool_skill_id_foreign FOREIGN KEY (pool_skill_id) REFERENCES public.pool_skill(id) ON DELETE CASCADE;


--
-- Name: assessment_steps assessment_steps_pool_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_steps
    ADD CONSTRAINT assessment_steps_pool_id_foreign FOREIGN KEY (pool_id) REFERENCES public.pools(id) ON DELETE CASCADE;


--
-- Name: classification_pool_candidate_filter classification_pool_candidate_filter_classification_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classification_pool_candidate_filter
    ADD CONSTRAINT classification_pool_candidate_filter_classification_id_foreign FOREIGN KEY (classification_id) REFERENCES public.classifications(id);


--
-- Name: classification_pool_candidate_filter classification_pool_candidate_filter_pool_candidate_filter_id_f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classification_pool_candidate_filter
    ADD CONSTRAINT classification_pool_candidate_filter_pool_candidate_filter_id_f FOREIGN KEY (pool_candidate_filter_id) REFERENCES public.pool_candidate_filters(id);


--
-- Name: department_specific_recruitment_process_forms department_specific_recruitment_process_forms_department_id_for; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_specific_recruitment_process_forms
    ADD CONSTRAINT department_specific_recruitment_process_forms_department_id_for FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: department_specific_recruitment_process_positions department_specific_recruitment_process_positions_department_sp; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_specific_recruitment_process_positions
    ADD CONSTRAINT department_specific_recruitment_process_positions_department_sp FOREIGN KEY (department_specific_recruitment_process_form_id) REFERENCES public.department_specific_recruitment_process_forms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: digital_contracting_personnel_requirements digital_contracting_personnel_requirements_digital_contracting_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_contracting_personnel_requirements
    ADD CONSTRAINT digital_contracting_personnel_requirements_digital_contracting_ FOREIGN KEY (digital_contracting_questionnaire_id) REFERENCES public.digital_contracting_questionnaires(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: digital_contracting_personnel_skills digital_contracting_personnel_skills_digital_contracting_person; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_contracting_personnel_skills
    ADD CONSTRAINT digital_contracting_personnel_skills_digital_contracting_person FOREIGN KEY (digital_contracting_personnel_requirement_id) REFERENCES public.digital_contracting_personnel_requirements(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: digital_contracting_personnel_skills digital_contracting_personnel_skills_skill_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_contracting_personnel_skills
    ADD CONSTRAINT digital_contracting_personnel_skills_skill_id_foreign FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: digital_contracting_questionnaires digital_contracting_questionnaires_department_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_contracting_questionnaires
    ADD CONSTRAINT digital_contracting_questionnaires_department_id_foreign FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: experience_skill experience_skill_experience_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experience_skill
    ADD CONSTRAINT experience_skill_experience_id_foreign FOREIGN KEY (experience_id) REFERENCES public.experiences(id) ON DELETE CASCADE;


--
-- Name: experience_skill experience_skill_user_skill_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experience_skill
    ADD CONSTRAINT experience_skill_user_skill_id_foreign FOREIGN KEY (user_skill_id) REFERENCES public.user_skills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: experiences experiences_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: general_question_responses general_question_responses_general_question_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.general_question_responses
    ADD CONSTRAINT general_question_responses_general_question_id_foreign FOREIGN KEY (general_question_id) REFERENCES public.general_questions(id) ON DELETE CASCADE;


--
-- Name: general_question_responses general_question_responses_pool_candidate_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.general_question_responses
    ADD CONSTRAINT general_question_responses_pool_candidate_id_foreign FOREIGN KEY (pool_candidate_id) REFERENCES public.pool_candidates(id) ON DELETE CASCADE;


--
-- Name: general_questions general_questions_pool_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.general_questions
    ADD CONSTRAINT general_questions_pool_id_foreign FOREIGN KEY (pool_id) REFERENCES public.pools(id) ON DELETE CASCADE;


--
-- Name: generic_job_title_user generic_job_title_user_generic_job_title_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generic_job_title_user
    ADD CONSTRAINT generic_job_title_user_generic_job_title_id_foreign FOREIGN KEY (generic_job_title_id) REFERENCES public.generic_job_titles(id);


--
-- Name: generic_job_title_user generic_job_title_user_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generic_job_title_user
    ADD CONSTRAINT generic_job_title_user_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: generic_job_titles generic_job_titles_classification_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generic_job_titles
    ADD CONSTRAINT generic_job_titles_classification_id_foreign FOREIGN KEY (classification_id) REFERENCES public.classifications(id);


--
-- Name: permission_role permission_role_permission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_role
    ADD CONSTRAINT permission_role_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: permission_role permission_role_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_role
    ADD CONSTRAINT permission_role_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: permission_user permission_user_permission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_user
    ADD CONSTRAINT permission_user_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: permission_user permission_user_team_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_user
    ADD CONSTRAINT permission_user_team_id_foreign FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: permission_user permission_user_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_user
    ADD CONSTRAINT permission_user_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: pool_candidate_education_requirement_experience pool_candidate_education_requirement_experience_experience_id_f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidate_education_requirement_experience
    ADD CONSTRAINT pool_candidate_education_requirement_experience_experience_id_f FOREIGN KEY (experience_id) REFERENCES public.experiences(id) ON DELETE CASCADE;


--
-- Name: pool_candidate_education_requirement_experience pool_candidate_education_requirement_experience_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidate_education_requirement_experience
    ADD CONSTRAINT pool_candidate_education_requirement_experience_foreign FOREIGN KEY (pool_candidate_id) REFERENCES public.pool_candidates(id) ON DELETE CASCADE;


--
-- Name: pool_candidate_search_requests pool_candidate_search_requests_applicant_filter_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidate_search_requests
    ADD CONSTRAINT pool_candidate_search_requests_applicant_filter_id_foreign FOREIGN KEY (applicant_filter_id) REFERENCES public.applicant_filters(id);


--
-- Name: pool_candidate_search_requests pool_candidate_search_requests_community_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidate_search_requests
    ADD CONSTRAINT pool_candidate_search_requests_community_id_foreign FOREIGN KEY (community_id) REFERENCES public.communities(id);


--
-- Name: pool_candidate_search_requests pool_candidate_search_requests_department_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidate_search_requests
    ADD CONSTRAINT pool_candidate_search_requests_department_id_foreign FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: pool_candidate_search_requests pool_candidate_search_requests_pool_candidate_filter_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidate_search_requests
    ADD CONSTRAINT pool_candidate_search_requests_pool_candidate_filter_id_foreign FOREIGN KEY (pool_candidate_filter_id) REFERENCES public.pool_candidate_filters(id);


--
-- Name: pool_candidates pool_candidates_placed_department_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidates
    ADD CONSTRAINT pool_candidates_placed_department_id_foreign FOREIGN KEY (placed_department_id) REFERENCES public.departments(id);


--
-- Name: pool_candidates pool_candidates_pool_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidates
    ADD CONSTRAINT pool_candidates_pool_id_foreign FOREIGN KEY (pool_id) REFERENCES public.pools(id);


--
-- Name: pool_candidates pool_candidates_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_candidates
    ADD CONSTRAINT pool_candidates_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: pool_pool_candidate_filter pool_pool_candidate_filter_pool_candidate_filter_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_pool_candidate_filter
    ADD CONSTRAINT pool_pool_candidate_filter_pool_candidate_filter_id_foreign FOREIGN KEY (pool_candidate_filter_id) REFERENCES public.pool_candidate_filters(id);


--
-- Name: pool_pool_candidate_filter pool_pool_candidate_filter_pool_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_pool_candidate_filter
    ADD CONSTRAINT pool_pool_candidate_filter_pool_id_foreign FOREIGN KEY (pool_id) REFERENCES public.pools(id);


--
-- Name: pool_skill pool_skill_pool_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_skill
    ADD CONSTRAINT pool_skill_pool_id_foreign FOREIGN KEY (pool_id) REFERENCES public.pools(id) ON DELETE CASCADE;


--
-- Name: pool_skill pool_skill_skill_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_skill
    ADD CONSTRAINT pool_skill_skill_id_foreign FOREIGN KEY (skill_id) REFERENCES public.skills(id);


--
-- Name: pool_user_bookmarks pool_user_bookmarks_pool_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_user_bookmarks
    ADD CONSTRAINT pool_user_bookmarks_pool_id_foreign FOREIGN KEY (pool_id) REFERENCES public.pools(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pool_user_bookmarks pool_user_bookmarks_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pool_user_bookmarks
    ADD CONSTRAINT pool_user_bookmarks_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pools pools_classification_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pools
    ADD CONSTRAINT pools_classification_id_foreign FOREIGN KEY (classification_id) REFERENCES public.classifications(id);


--
-- Name: pools pools_team_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pools
    ADD CONSTRAINT pools_team_id_foreign FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: pools pools_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pools
    ADD CONSTRAINT pools_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: role_user role_user_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_user
    ADD CONSTRAINT role_user_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_user role_user_team_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_user
    ADD CONSTRAINT role_user_team_id_foreign FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_user role_user_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_user
    ADD CONSTRAINT role_user_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: screening_question_responses screening_question_responses_pool_candidate_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening_question_responses
    ADD CONSTRAINT screening_question_responses_pool_candidate_id_foreign FOREIGN KEY (pool_candidate_id) REFERENCES public.pool_candidates(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: screening_question_responses screening_question_responses_screening_question_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening_question_responses
    ADD CONSTRAINT screening_question_responses_screening_question_id_foreign FOREIGN KEY (screening_question_id) REFERENCES public.screening_questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: screening_questions screening_questions_assessment_step_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening_questions
    ADD CONSTRAINT screening_questions_assessment_step_id_foreign FOREIGN KEY (assessment_step_id) REFERENCES public.assessment_steps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: screening_questions screening_questions_pool_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening_questions
    ADD CONSTRAINT screening_questions_pool_id_foreign FOREIGN KEY (pool_id) REFERENCES public.pools(id) ON DELETE CASCADE;


--
-- Name: skill_skill_family skill_skill_family_skill_family_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_skill_family
    ADD CONSTRAINT skill_skill_family_skill_family_id_foreign FOREIGN KEY (skill_family_id) REFERENCES public.skill_families(id);


--
-- Name: skill_skill_family skill_skill_family_skill_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_skill_family
    ADD CONSTRAINT skill_skill_family_skill_id_foreign FOREIGN KEY (skill_id) REFERENCES public.skills(id);


--
-- Name: team_department team_department_department_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_department
    ADD CONSTRAINT team_department_department_id_foreign FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: team_department team_department_team_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_department
    ADD CONSTRAINT team_department_team_id_foreign FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: user_search_indices user_search_indices_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_search_indices
    ADD CONSTRAINT user_search_indices_id_foreign FOREIGN KEY (id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_skills user_skills_skill_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_skill_id_foreign FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON UPDATE CASCADE;


--
-- Name: user_skills user_skills_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_current_classification_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_current_classification_foreign FOREIGN KEY (current_classification) REFERENCES public.classifications(id);


--
-- Name: users users_department_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_department_foreign FOREIGN KEY (department) REFERENCES public.departments(id);


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 12.15 (Debian 12.15-1.pgdg120+1)
-- Dumped by pg_dump version 14.12 (Ubuntu 14.12-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	2021_05_05_163948_create_users_table	1
2	2021_05_26_195131_create_pools_table	1
3	2021_05_27_182801_create_classifications_table	1
4	2021_05_27_182826_create_cmo_assets_table	1
5	2021_05_27_182844_create_operational_requirements_table	1
6	2021_05_28_200606_create_pool_lookup_pivot_tables	1
7	2021_06_01_140524_create_pool_candidates_table	1
8	2021_06_21_205450_update_users_table_soft_deletes	1
9	2021_06_21_205640_update_pools_table_soft_deletes	1
10	2021_06_21_205647_update_classifications_table_soft_deletes	1
11	2021_06_21_205651_update_cmo_assets_table_soft_deletes	1
12	2021_06_21_205655_update_operational_requirements_table_soft_deletes	1
13	2021_06_21_205722_update_pool_candidates_table_soft_deletes	1
14	2021_08_06_153938_update_users_table_with_roles	1
15	2021_09_13_180950_create_departments_table	1
16	2021_09_17_135548_create_pool_candidate_search_requests_table	1
17	2021_09_17_190139_create_pool_candidate_filters_table	1
18	2021_09_21_201032_update_users_table_with_sub	1
19	2021_10_19_140743_remove_pool_candidate_search_request_requested_date_column	1
20	2021_11_02_142947_update_pools_table_with_key_column	1
21	2021_11_09_145430_add_constraints	1
22	2021_12_29_183502_create_skill_tables	1
23	2022_02_08_200400_create_experience_tables	1
24	2022_03_02_214626_create_experience_skill_table	1
25	2022_03_03_231414_update_users_table_with_profile_data	1
26	2022_03_31_153737_remove_operation_requirements_tables	1
27	2022_04_13_190734_convert_overtime_enum	1
28	2022_04_27_190153_update_users_table_with_gov_employee_type	1
29	2022_05_04_173542_add_extra_constraints	1
30	2022_05_12_125508_make_email_nullable	1
31	2022_05_30_182823_update_pools_table_with_key_tasks_and_status	1
32	2022_06_07_131233_add_applicant_role	1
33	2022_06_08_215802_update_pool_candidate_table_with_notes	1
34	2022_06_13_180655_update_users_and_pool_candidates_table_with_departments	1
35	2022_06_14_155502_create_generic_job_titles_table	1
36	2022_06_29_172400_index_user_created_at	1
37	2022_06_30_182650_update_pool_with_advertisement	1
38	2022_07_04_202322_update_experience_skills_table	1
39	2022_07_05_205227_create_applicant_filters_table	1
40	2022_07_06_210726_add_applicant_filter_to_requests	1
41	2022_07_20_214048_update_skills_french_keywords	1
42	2022_08_02_175856_add_citizen_veteran_fields	1
43	2022_08_04_162942_add_archiving_pool_candidate	1
44	2022_08_09_164050_add_is_remote_column_pools_table	1
45	2022_08_11_161706_submitted_at_field_added_application	1
46	2022_08_12_233627_add_signature_field_application	1
47	2022_08_16_194515_add_application_snapshot_json	1
48	2022_08_22_162754_remove_secondment_column_users_table	1
49	2022_08_25_165115_change_is_veteran_field	1
50	2022_08_26_191647_add_stream_column_pools_table	1
51	2022_08_26_215332_add_priority_entitlement	1
52	2022_09_06_032007_generated_column_priority	1
53	2022_09_06_155536_update_candidate_statuses	1
54	2022_09_07_143031_make_pool_key_nullable	1
55	2022_09_08_191031_generated_candidate_status_weight	1
56	2022_09_20_213608_repair_users_armed_forces_status_column	1
57	2022_09_22_202806_update_pool_table_add_process_number	1
58	2022_10_06_130017_create_pool_publishing_group	1
59	2022_10_06_220924_replace_pool_publish_with_time	1
60	2022_10_17_141813_change_expiry_date_to_datetime	1
61	2022_11_17_173638_request_status_to_datetime	1
62	2022_11_25_232602_would_accept_temporary_to_position_duration	1
63	2022_12_01_215438_add_self_declaration_fields	1
64	2022_12_07_235330_drop_old_poolcandidates_data	1
65	2022_12_09_230812_drop_language_ability_users	1
66	2022_12_16_163656_rename_pool_expiry_closing	1
67	2023_01_04_164338_add_removed_generated_candidate_status_weight	1
68	2023_01_09_185234_add_langugage_preference_columns	1
69	2023_01_12_205322_remove_cmo_assets_tables_constraints	1
70	2023_01_26_174600_rename_user_roles	1
71	2023_01_27_195856_laratrust_setup_tables	1
72	2023_01_27_201348_laratrust_setup_teams	1
73	2023_01_30_221936_teams_add_email_departments	1
74	2023_02_01_194314_connect_teams_pools	1
75	2023_02_03_170212_add_empty_column_requests_table	1
76	2023_02_10_170833_add_is_team_based_roles_table	1
77	2023_02_13_194532_update_role_user_table	1
78	2023_02_28_001804_add_suspended_at_to_pool_candidates	1
79	2023_03_24_220231_add_screening_questions_table	1
80	2023_03_27_135343_add_steps_to_application	1
81	2023_03_28_144927_add_streams_to_applicant_filter_table	1
82	2023_04_05_172101_create_applicant_filter_qualified_classification_table	1
83	2023_04_06_172943_add_screening_question_responses	1
84	2023_04_24_162247_drop_pool_status_field	1
85	2023_04_24_195500_experience_evidence_setup	1
86	2023_05_19_160057_remove_pool_description_column	1
87	2023_05_29_180900_update_pool_candidate_foreign_key_education_requirement_experience_table	1
88	2023_06_22_205656_drop_pool_key_column	1
89	2023_06_26_204704_create_user_skills_table	1
90	2023_06_27_212111_point_experience_skill_to_user_skills	1
91	2023_07_05_165545_create_notifications_table	1
92	2023_07_05_214529_add_request_status_column	1
93	2023_07_13_214737_drop_legacy_roles	1
94	2023_07_17_135053_add_screened_out_interest_responsiveness	1
95	2023_07_18_171856_search_request_add_fields	1
96	2023_07_18_172900_add_what_to_expect_column_pool_model	1
97	2023_07_19_140947_create_digital_contracting_questionnaires_table	1
98	2023_07_25_170247_add_archive_column_to_pool_table	1
99	2023_07_27_224640_user_skills_add_fields	1
100	2023_07_31_160346_update_experience_skill_with_soft_delete	1
101	2023_08_02_145650_cascade_pool_delete	1
102	2023_08_02_165859_remove_joblookingstatus	1
103	2023_08_18_212858_user_skills_add_showcase	1
104	2023_08_21_174523_cascade_user_delete	1
105	2023_08_22_140400_move_category_from_skill_families_to_skill_table	1
106	2023_08_30_124953_fix_questionnaire_bugs	1
107	2023_09_07_174946_add_department_directive_form	1
108	2023_09_08_142132_directive_form_changes	1
109	2023_09_20_211150_combine_pool_skills	1
110	2023_09_22_155852_add_field_to_pools	1
111	2023_09_25_230841_create_assessment_step_table	1
112	2023_10_17_183718_add_foreign_key_constraints	1
113	2023_10_23_195252_create_assessment_results_table	1
114	2023_11_06_181308_add_request_reason_column_search_requests_table	1
115	2023_11_06_185332_create_activity_log_table	1
116	2023_11_06_185333_add_event_column_to_activity_log_table	1
117	2023_11_06_185334_add_batch_uuid_column_to_activity_log_table	1
118	2023_11_22_152329_update_users_table_add_searchable_column	1
119	2023_12_05_210313_add_bookmarked_column_to_pool_candidates	1
120	2024_01_04_144452_add_notes_column_assessment_results_table	1
121	2024_01_08_203349_location_exemption_to_text	1
122	2024_01_16_201038_pool_candidates_table_is_bookmarked_non_nullable	1
123	2024_01_22_225643_rename_screening_to_general_questions	1
124	2024_01_31_193707_add_new_screening_questions_table	1
125	2024_02_13_190621_create_settings_table	1
126	2024_02_13_195514_fix_general_questions_foreign_key_pool_id	1
127	2024_02_13_234848_tentatively_placed_status_addition	1
128	2024_02_16_182944_length_of_opportunity_column_pools_table	1
129	2024_02_21_154944_add_skill_level_to_pool_skills	1
130	2024_02_23_145241_add_hr_advisor_email_column_pool_candidate_search_requests	1
131	2024_02_26_182809_remove_expected_salary_column_users_table	1
132	2024_03_11_175506_add_about_us_post_admission_columns_pools_table	1
133	2024_03_11_184829_create_jobs_table	1
134	2024_03_11_184835_create_failed_jobs_table	1
135	2024_03_11_213938_soft_delete_notifications_table	1
136	2024_03_12_030556_update_users_table_language_info	1
137	2024_03_13_134951_create_experiences_table	1
138	2024_03_13_193146_add-notification-setting-to-users-table	1
139	2024_03_26_181120_remove_pool_classification_table	1
140	2024_03_26_190919_drop_experience_type_from_experience_skill	1
141	2024_03_28_131122_add_closing_reason_column_pools_table	1
142	2024_04_04_222441_placed_mutation_fields_added	1
143	2024_04_10_192843_add_removal_columns_pool_candidates_table	1
144	2024_04_10_200445_combine-assessment-result-note-fields	1
145	2024_04_15_192939_cascase_pool_delete	1
146	2024_04_15_194823_add_final_decision_at_field	1
147	2024_04_18_210339_job_alert_default_ignored	1
148	2024_04_25_143252_remove_cmo_identifier_column_pool_candidates_table	1
149	2024_05_03_182815_update_search_request_status_weight_column_not_complicant	1
150	2024_05_08_173602_add_communities_table	1
151	2024_05_10_120743_add_edit_justification_column_pools_table	1
152	2024_05_14_194656_remove_operational_requirements_overtime_short_notice_overtime_scheduled	1
153	2024_05_17_184018_update_notifications_store_enabled	1
154	2024_05_21_141338_add_community_id_column_search_request_applicant_filter_tables	1
155	2024_05_21_180658_add_claim_verification_fields	1
156	2024_05_22_153129_create_pool_user_bookmarks_table	1
157	2024_05_27_202609_user_search_index_table	1
158	2024_06_03_173816_add_email_verification	1
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 158, true);


--
-- PostgreSQL database dump complete
--

