--
-- PostgreSQL database dump
--

\restrict OcyvE74e2soYDaePUhKEsYKZ1hmkFx5QdiJna7GBl2hZqBqLi4GskbtGxBZD9BF

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._migrations (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public._migrations OWNER TO postgres;

--
-- Name: _migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public._migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._migrations_id_seq OWNER TO postgres;

--
-- Name: _migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public._migrations_id_seq OWNED BY public._migrations.id;


--
-- Name: auth_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    access_token_hash text NOT NULL,
    refresh_token_hash text NOT NULL,
    role_code text NOT NULL,
    user_agent text,
    ip_address text,
    expires_at timestamp with time zone NOT NULL,
    refresh_expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.auth_sessions OWNER TO postgres;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    customer_id uuid NOT NULL,
    garage_id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    quote_id uuid,
    booking_type character varying(50) NOT NULL,
    scheduled_at timestamp with time zone NOT NULL,
    status character varying(50) NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    checkin_mode text DEFAULT 'self_checkin'::text,
    customer_note text,
    CONSTRAINT bookings_booking_type_check CHECK (((booking_type)::text = ANY ((ARRAY['instant'::character varying, 'quoteBased'::character varying])::text[]))),
    CONSTRAINT bookings_status_check CHECK (((status)::text = ANY ((ARRAY['pendingPayment'::character varying, 'confirmed'::character varying, 'inService'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    customer_id uuid NOT NULL,
    items jsonb DEFAULT '[]'::jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: diagnose_issue_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnose_issue_categories (
    id character varying(100) NOT NULL,
    label character varying(255) NOT NULL,
    summary text NOT NULL,
    summary_meaning text NOT NULL,
    keywords text[] DEFAULT '{}'::text[] NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.diagnose_issue_categories OWNER TO postgres;

--
-- Name: diagnose_next_steps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnose_next_steps (
    id character varying(100) NOT NULL,
    step_number character varying(10) NOT NULL,
    title character varying(255) NOT NULL,
    body text NOT NULL,
    meta character varying(255) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.diagnose_next_steps OWNER TO postgres;

--
-- Name: diagnose_possible_issues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnose_possible_issues (
    id character varying(100) NOT NULL,
    category_id character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    badge character varying(100) NOT NULL,
    badge_class character varying(255) NOT NULL,
    description text NOT NULL,
    match_score integer NOT NULL,
    risks text[] DEFAULT '{}'::text[] NOT NULL,
    estimated_cost character varying(100) NOT NULL,
    image_src text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT diagnose_possible_issues_match_score_check CHECK (((match_score >= 0) AND (match_score <= 100)))
);


ALTER TABLE public.diagnose_possible_issues OWNER TO postgres;

--
-- Name: diagnose_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnose_questions (
    id character varying(100) NOT NULL,
    category_id character varying(100) NOT NULL,
    label character varying(255) NOT NULL,
    question text NOT NULL,
    options text[] DEFAULT '{}'::text[] NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.diagnose_questions OWNER TO postgres;

--
-- Name: diagnose_result_summaries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnose_result_summaries (
    id character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    heading text NOT NULL,
    body text DEFAULT ''::text NOT NULL,
    pill character varying(100) NOT NULL,
    pill_class character varying(255) NOT NULL,
    icon character varying(100) NOT NULL,
    icon_class character varying(255) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.diagnose_result_summaries OWNER TO postgres;

--
-- Name: diagnose_trust_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnose_trust_items (
    id character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    icon character varying(100) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.diagnose_trust_items OWNER TO postgres;

--
-- Name: diagnosis_media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnosis_media (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    diagnosis_request_id uuid NOT NULL,
    media_type character varying(20) NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT diagnosis_media_media_type_check CHECK (((media_type)::text = ANY ((ARRAY['image'::character varying, 'video'::character varying, 'audio'::character varying])::text[])))
);


ALTER TABLE public.diagnosis_media OWNER TO postgres;

--
-- Name: diagnosis_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnosis_requests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    customer_id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    symptom_text text,
    status character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT diagnosis_requests_status_check CHECK (((status)::text = ANY ((ARRAY['received'::character varying, 'processing'::character varying, 'completed'::character varying, 'failed'::character varying])::text[])))
);


ALTER TABLE public.diagnosis_requests OWNER TO postgres;

--
-- Name: diagnosis_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnosis_results (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    diagnosis_request_id uuid NOT NULL,
    issues jsonb NOT NULL,
    confidence_score integer NOT NULL,
    risk_level character varying(20) NOT NULL,
    diy_allowed boolean NOT NULL,
    diy_steps text[],
    next_action character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT diagnosis_results_confidence_score_check CHECK (((confidence_score >= 0) AND (confidence_score <= 100))),
    CONSTRAINT diagnosis_results_next_action_check CHECK (((next_action)::text = ANY ((ARRAY['diy'::character varying, 'bookGarage'::character varying, 'buyParts'::character varying])::text[]))),
    CONSTRAINT diagnosis_results_risk_level_check CHECK (((risk_level)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying])::text[])))
);


ALTER TABLE public.diagnosis_results OWNER TO postgres;

--
-- Name: diagnosis_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnosis_sessions (
    id uuid NOT NULL,
    customer_user_id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    symptoms_text text,
    attachments jsonb,
    possible_issues jsonb DEFAULT '[]'::jsonb NOT NULL,
    urgency text DEFAULT 'low'::text NOT NULL,
    diy_allowed boolean DEFAULT false NOT NULL,
    risk_text text DEFAULT ''::text NOT NULL,
    next_questions jsonb DEFAULT '[]'::jsonb NOT NULL,
    draft_estimate_min numeric(12,2),
    draft_estimate_max numeric(12,2),
    status text DEFAULT 'diagnosis_ready'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.diagnosis_sessions OWNER TO postgres;

--
-- Name: garage_badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.garage_badges (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    garage_id uuid NOT NULL,
    badge_key character varying(50) NOT NULL,
    active boolean DEFAULT true NOT NULL,
    awarded_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT garage_badges_badge_key_check CHECK (((badge_key)::text = ANY ((ARRAY['topRated'::character varying, 'budgetFriendly'::character varying, 'evSpecialist'::character varying, 'mostTrusted'::character varying])::text[])))
);


ALTER TABLE public.garage_badges OWNER TO postgres;

--
-- Name: garage_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.garage_documents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    garage_id uuid NOT NULL,
    doc_type character varying(100) NOT NULL,
    file_url text NOT NULL,
    verification_status character varying(50) NOT NULL,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT garage_documents_verification_status_check CHECK (((verification_status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.garage_documents OWNER TO postgres;

--
-- Name: garage_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.garage_services (
    id uuid NOT NULL,
    garage_user_id uuid NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    price numeric(12,2) NOT NULL,
    description text,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.garage_services OWNER TO postgres;

--
-- Name: garage_slots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.garage_slots (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    garage_id uuid NOT NULL,
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone NOT NULL,
    is_available boolean DEFAULT true NOT NULL
);


ALTER TABLE public.garage_slots OWNER TO postgres;

--
-- Name: garages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.garages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    owner_user_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    address text NOT NULL,
    location jsonb,
    specializations text[],
    certifications text[],
    pickup_drop_supported boolean DEFAULT false NOT NULL,
    approval_status character varying(50) NOT NULL,
    rating_avg numeric(3,2),
    rating_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    starting_price character varying(100),
    distance_km character varying(100),
    image text,
    response_mins integer DEFAULT 30,
    address_line text,
    city text,
    state text,
    postal_code text,
    verification_status text DEFAULT 'pending'::text,
    is_approved boolean DEFAULT false,
    trust_score numeric(3,2),
    business_hours jsonb,
    CONSTRAINT garages_approval_status_check CHECK (((approval_status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'suspended'::character varying])::text[])))
);


ALTER TABLE public.garages OWNER TO postgres;

--
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid NOT NULL,
    qty_available integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT inventory_qty_available_check CHECK ((qty_available >= 0))
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- Name: issue_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issue_requests (
    id uuid NOT NULL,
    customer_user_id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    diagnosis_session_id uuid,
    summary text NOT NULL,
    issue_source text DEFAULT 'direct'::text NOT NULL,
    issue_payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.issue_requests OWNER TO postgres;

--
-- Name: known_issues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.known_issues (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    category character varying(100) NOT NULL,
    symptom_keywords text[] NOT NULL,
    makes text[],
    year_from integer,
    year_to integer,
    issue_name character varying(255) NOT NULL,
    description text NOT NULL,
    risk_level character varying(20) NOT NULL,
    diy_allowed boolean DEFAULT true NOT NULL,
    safety_critical boolean DEFAULT false NOT NULL,
    required_parts jsonb DEFAULT '[]'::jsonb,
    estimated_cost_min numeric(10,2) NOT NULL,
    estimated_cost_max numeric(10,2) NOT NULL,
    diy_steps text[] DEFAULT '{}'::text[],
    garage_steps text[] DEFAULT '{}'::text[],
    base_confidence numeric(5,2) NOT NULL,
    CONSTRAINT known_issues_risk_level_check CHECK (((risk_level)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying])::text[])))
);


ALTER TABLE public.known_issues OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    channel character varying(20) NOT NULL,
    template_key character varying(100) NOT NULL,
    payload jsonb,
    status character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT notifications_channel_check CHECK (((channel)::text = ANY ((ARRAY['sms'::character varying, 'email'::character varying, 'push'::character varying, 'inApp'::character varying])::text[]))),
    CONSTRAINT notifications_status_check CHECK (((status)::text = ANY ((ARRAY['queued'::character varying, 'sent'::character varying, 'failed'::character varying])::text[])))
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    customer_id uuid NOT NULL,
    order_number character varying(50) NOT NULL,
    status character varying(50) NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    shipping_cost numeric(12,2) NOT NULL,
    tax numeric(12,2) NOT NULL,
    total numeric(12,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    fulfillment_mode character varying(50) NOT NULL,
    shipping_address jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT orders_fulfillment_mode_check CHECK (((fulfillment_mode)::text = ANY ((ARRAY['inHouse'::character varying, 'thirdParty'::character varying])::text[]))),
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['pendingPayment'::character varying, 'paid'::character varying, 'processing'::character varying, 'shipped'::character varying, 'delivered'::character varying, 'cancelled'::character varying, 'refunded'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: otp_challenges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otp_challenges (
    id uuid NOT NULL,
    phone character varying(10) NOT NULL,
    purpose text NOT NULL,
    role_code text,
    full_name text,
    otp_code character varying(6) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    consumed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.otp_challenges OWNER TO postgres;

--
-- Name: part_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.part_orders (
    id uuid NOT NULL,
    customer_user_id uuid NOT NULL,
    part_id uuid NOT NULL,
    qty integer DEFAULT 1 NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    status text DEFAULT 'placed'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.part_orders OWNER TO postgres;

--
-- Name: parts_catalog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parts_catalog (
    id uuid NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    price numeric(12,2) NOT NULL,
    currency character(3) DEFAULT 'USD'::bpchar NOT NULL,
    in_stock boolean DEFAULT true NOT NULL,
    supplier text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.parts_catalog OWNER TO postgres;

--
-- Name: payment_intents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_intents (
    id uuid NOT NULL,
    booking_id uuid NOT NULL,
    customer_user_id uuid NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency character(3) DEFAULT 'USD'::bpchar NOT NULL,
    method text DEFAULT 'card'::text NOT NULL,
    status text DEFAULT 'created'::text NOT NULL,
    client_secret text NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:30:00'::interval) NOT NULL,
    confirmed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payment_intents OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    customer_user_id uuid NOT NULL,
    booking_id uuid,
    order_id uuid,
    method character varying(100) NOT NULL,
    transaction_id character varying(255) NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    status character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['created'::character varying, 'requiresAction'::character varying, 'succeeded'::character varying, 'failed'::character varying, 'refunded'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    seller_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category character varying(100) NOT NULL,
    price numeric(12,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    is_diy_kit boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    compatible_vehicle_rules jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    avatar_url text,
    bio text,
    address_line text,
    city text,
    state text,
    postal_code text,
    notification_preferences jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    business_hours text,
    specializations jsonb,
    certifications jsonb
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: promos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promos (
    id character varying(100) NOT NULL,
    badge character varying(255),
    icon character varying(100),
    title character varying(255) NOT NULL,
    bullets text[],
    numeric_price numeric(12,2) NOT NULL,
    strike_price numeric(12,2),
    discount_percent integer,
    valid_till timestamp with time zone,
    used_count_value integer DEFAULT 0,
    image text,
    categories text[],
    is_combo boolean DEFAULT false,
    relevance integer DEFAULT 0,
    theme_preset character varying(50) DEFAULT 'blue'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT promos_theme_preset_check CHECK (((theme_preset)::text = ANY ((ARRAY['orange'::character varying, 'green'::character varying, 'blue'::character varying, 'purple'::character varying, 'red'::character varying])::text[])))
);


ALTER TABLE public.promos OWNER TO postgres;

--
-- Name: quote_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quote_requests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    customer_id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    diagnosis_request_id uuid,
    issue_summary text NOT NULL,
    preferred_date timestamp with time zone,
    status character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT quote_requests_status_check CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'quoted'::character varying, 'selected'::character varying, 'expired'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.quote_requests OWNER TO postgres;

--
-- Name: quotes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quotes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quote_request_id uuid NOT NULL,
    garage_id uuid NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    eta_days integer,
    status character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    details jsonb,
    parts_cost numeric(12,2) DEFAULT 0 NOT NULL,
    labor_cost numeric(12,2) DEFAULT 0 NOT NULL,
    total_cost numeric(12,2) DEFAULT 0 NOT NULL,
    eta_note text,
    comparison_label text DEFAULT 'fair'::text NOT NULL,
    CONSTRAINT quotes_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'selected'::character varying, 'rejected'::character varying, 'withdrawn'::character varying])::text[])))
);


ALTER TABLE public.quotes OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    token_hash character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    booking_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    garage_id uuid NOT NULL,
    rating_overall integer NOT NULL,
    rating_price integer,
    rating_quality integer,
    rating_time integer,
    rating_behavior integer,
    comment text,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_rating_behavior_check CHECK (((rating_behavior >= 1) AND (rating_behavior <= 5))),
    CONSTRAINT reviews_rating_overall_check CHECK (((rating_overall >= 1) AND (rating_overall <= 5))),
    CONSTRAINT reviews_rating_price_check CHECK (((rating_price >= 1) AND (rating_price <= 5))),
    CONSTRAINT reviews_rating_quality_check CHECK (((rating_quality >= 1) AND (rating_quality <= 5))),
    CONSTRAINT reviews_rating_time_check CHECK (((rating_time >= 1) AND (rating_time <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT roles_code_check CHECK (((code)::text = ANY ((ARRAY['user'::character varying, 'garage'::character varying, 'vendor'::character varying, 'admin'::character varying, 'customer'::character varying])::text[])))
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: runtime_app_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.runtime_app_config (
    key text NOT NULL,
    value_json jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.runtime_app_config OWNER TO postgres;

--
-- Name: sellers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sellers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    seller_type character varying(50) NOT NULL,
    user_id uuid,
    garage_id uuid,
    approval_status character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT sellers_approval_status_check CHECK (((approval_status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))),
    CONSTRAINT sellers_seller_type_check CHECK (((seller_type)::text = ANY ((ARRAY['platform'::character varying, 'garage'::character varying, 'vendor'::character varying])::text[])))
);


ALTER TABLE public.sellers OWNER TO postgres;

--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    garage_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(12,2) NOT NULL,
    duration_mins integer,
    category character varying(100),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: sms_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sms_events (
    id uuid NOT NULL,
    user_id uuid,
    phone character varying(10) NOT NULL,
    event_type text NOT NULL,
    status text NOT NULL,
    meta jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sms_events OWNER TO postgres;

--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_tickets (
    id uuid NOT NULL,
    customer_user_id uuid NOT NULL,
    subject text NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.support_tickets OWNER TO postgres;

--
-- Name: ui_content; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ui_content (
    id integer NOT NULL,
    tenant_id text DEFAULT 'default'::text NOT NULL,
    module text NOT NULL,
    page text NOT NULL,
    locale text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    content jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ui_content OWNER TO postgres;

--
-- Name: ui_content_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ui_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ui_content_id_seq OWNER TO postgres;

--
-- Name: ui_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ui_content_id_seq OWNED BY public.ui_content.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: user_social_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_social_accounts (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    provider text NOT NULL,
    social_subject text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_social_accounts OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255),
    mobile_number character varying(20),
    password_hash character varying(255),
    name character varying(255) NOT NULL,
    status character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT users_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'suspended'::character varying, 'pendingVerification'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: vehicle_images_cache; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_images_cache (
    key character varying(255) NOT NULL,
    image_url text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vehicle_images_cache OWNER TO postgres;

--
-- Name: vehicle_repair_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_repair_history (
    id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    issue_summary text NOT NULL,
    service_done text NOT NULL,
    shop_name text,
    status text DEFAULT 'Completed'::text NOT NULL,
    price_amount numeric(12,2),
    currency character(3) DEFAULT 'USD'::bpchar NOT NULL,
    service_date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.vehicle_repair_history OWNER TO postgres;

--
-- Name: vehicle_service_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_service_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    vehicle_id uuid NOT NULL,
    service_date timestamp with time zone NOT NULL,
    description text NOT NULL,
    garage_id uuid,
    cost numeric(12,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.vehicle_service_history OWNER TO postgres;

--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    customer_id uuid NOT NULL,
    make character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    year integer NOT NULL,
    vin character varying(17),
    mileage integer,
    warranty jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    fuel_type text DEFAULT 'Unknown'::text NOT NULL,
    "trim" text,
    engine_type text,
    plate_number text,
    is_default boolean DEFAULT false NOT NULL
);


ALTER TABLE public.vehicles OWNER TO postgres;

--
-- Name: _migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._migrations ALTER COLUMN id SET DEFAULT nextval('public._migrations_id_seq'::regclass);


--
-- Name: ui_content id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ui_content ALTER COLUMN id SET DEFAULT nextval('public.ui_content_id_seq'::regclass);


--
-- Data for Name: _migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._migrations (id, filename, applied_at) FROM stdin;
1	001_initial_schema.sql	2026-07-22 13:38:53.488488+05:30
2	002_refresh_tokens.sql	2026-07-22 13:38:54.259256+05:30
3	003_add_vehicle_soft_delete.sql	2026-07-22 13:38:54.273078+05:30
4	004_known_issues.sql	2026-07-22 13:38:54.280602+05:30
5	005_dummy_test_user.sql	2026-07-22 13:38:54.333953+05:30
6	006_promos.sql	2026-07-22 13:38:54.357753+05:30
7	007_quotes.sql	2026-07-22 13:38:54.385426+05:30
8	008_bookings_seed.sql	2026-07-22 13:38:54.405328+05:30
9	009_update_garages_rich_meta.sql	2026-07-22 13:38:54.421764+05:30
10	010_remove_garages_ui_columns.sql	2026-07-22 13:38:54.455273+05:30
11	011_add_garages_response_mins.sql	2026-07-22 13:38:54.465459+05:30
12	012_add_missing_garages.sql	2026-07-22 13:38:54.472344+05:30
13	013_diagnose_ui_config.sql	2026-07-22 13:38:54.486336+05:30
14	014_diagnose_ui_config_seed.sql	2026-07-22 13:38:54.544056+05:30
15	015_garage_services.sql	2026-07-22 22:04:58.050155+05:30
\.


--
-- Data for Name: auth_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_sessions (id, user_id, access_token_hash, refresh_token_hash, role_code, user_agent, ip_address, expires_at, refresh_expires_at, revoked_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, customer_id, garage_id, vehicle_id, quote_id, booking_type, scheduled_at, status, total_amount, currency, created_at, updated_at, checkin_mode, customer_note) FROM stdin;
00000000-0000-0000-0000-000000000081	00000000-0000-0000-0000-000000000001	00000000-0000-0000-0000-000000000011	00000000-0000-0000-0000-000000000002	\N	instant	2026-07-24 13:38:54.405328+05:30	confirmed	150.00	USD	2026-07-22 13:38:54.405328+05:30	2026-07-22 13:38:54.405328+05:30	self_checkin	\N
00000000-0000-0000-0000-000000000082	00000000-0000-0000-0000-000000000001	00000000-0000-0000-0000-000000000013	00000000-0000-0000-0000-000000000002	\N	quoteBased	2026-07-21 13:38:54.405328+05:30	completed	3200.00	USD	2026-07-22 13:38:54.405328+05:30	2026-07-22 13:38:54.405328+05:30	self_checkin	\N
347bbd73-6ef8-4f50-b5f7-9fc102e85cd5	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000015	00000000-0000-0000-0000-000000000002	\N	instant	2026-07-22 18:00:00+05:30	cancelled	150.00	USD	2026-07-22 15:20:05.072047+05:30	2026-07-22 15:20:15.706597+05:30	self_checkin	\N
b1bc86a0-732b-4a11-b4be-2085347f01ca	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000012	00000000-0000-0000-0000-000000000002	\N	instant	2026-07-22 16:00:00+05:30	confirmed	150.00	USD	2026-07-22 22:46:02.531526+05:30	2026-07-22 22:46:02.531526+05:30	self_checkin	\N
8eb72b63-f52e-4703-87fc-9f6f319067da	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000015	00000000-0000-0000-0000-000000000002	\N	instant	2026-07-23 15:00:00+05:30	confirmed	150.00	USD	2026-07-23 10:29:04.862562+05:30	2026-07-23 10:29:04.862562+05:30	self_checkin	\N
ddda4ae3-127e-4544-867f-3b743c2929c2	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000015	45d26afa-2db1-4540-ba4f-aad57374c64f	\N	instant	2026-07-30 16:00:00+05:30	confirmed	150.00	USD	2026-07-30 00:54:10.732454+05:30	2026-07-30 00:54:10.732454+05:30	self_checkin	\N
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, customer_id, items, updated_at) FROM stdin;
\.


--
-- Data for Name: diagnose_issue_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnose_issue_categories (id, label, summary, summary_meaning, keywords, sort_order, created_at) FROM stdin;
engine_noise	Engine noise	Abnormal sound from the engine bay or related rotating components.	Persistent engine-side noises should be checked early to prevent wear from becoming internal engine damage.	{"engine noise","engine sound","ticking sound","knocking sound","rattling sound","whining noise","tap tap sound","noise from engine","sound from bonnet"}	1	2026-07-22 13:38:54.544056+05:30
ac_not_cooling	AC not cooling	Weak or inconsistent cabin cooling from the AC system.	Cooling issues often begin with refrigerant, airflow, or compressor-side faults and can worsen quickly in traffic or hot weather.	{"ac not cooling","air conditioner not cooling","weak ac","hot air from ac","ac weak","no cooling","ac problem","cooling issue"}	2	2026-07-22 13:38:54.544056+05:30
brake_vibration	Brake vibration	Vibration or pulsing felt mainly during braking.	Brake-related vibration usually points to rotor, pad, or suspension-side braking instability and should be inspected for safety.	{"brake vibration","brake vibe","car vibrates when braking","steering shakes when braking","pulsation while braking","brake judder","brake shaking"}	3	2026-07-22 13:38:54.544056+05:30
low_pickup	Low pickup	Poor acceleration, weak response, or power loss while driving.	Power-loss symptoms can come from airflow, fuel delivery, ignition, or exhaust restriction and need targeted follow-up.	{"low pickup","poor pickup","low power","car not accelerating","pickup issue","sluggish acceleration","power loss"}	4	2026-07-22 13:38:54.544056+05:30
starting_issue	Car not starting	Starting failure, slow cranking, or ignition-related no-start issue.	No-start complaints usually narrow down to battery, starter, or fuel-ignition readiness and should be separated quickly.	{"car not starting","not starting","start issue","engine not starting","self not working","slow crank","crank no start","no start"}	5	2026-07-22 13:38:54.544056+05:30
steering_suspension	Steering or suspension vibration	Shaking, pulling, or vibration felt while driving, usually speed-related.	Driving vibration that is not limited to braking is often tyre, wheel balance, alignment, or suspension related.	{"steering vibration","steering wheel vibration","car shaking","vibration at high speed","wheel vibration","suspension vibration","pulling to one side"}	6	2026-07-22 13:38:54.544056+05:30
\.


--
-- Data for Name: diagnose_next_steps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnose_next_steps (id, step_number, title, body, meta, sort_order, created_at) FROM stdin;
step-01	01	Get Quotes	Receive quotes from trusted garages	Within 30 mins	1	2026-07-22 13:38:54.544056+05:30
step-02	02	Compare & Choose	Compare prices, ratings & reviews	At your convenience	2	2026-07-22 13:38:54.544056+05:30
step-03	03	Book Appointment	Choose time slot & book	Instant confirmation	3	2026-07-22 13:38:54.544056+05:30
step-04	04	Get Service	Visit garage & get your car fixed	Quality service	4	2026-07-22 13:38:54.544056+05:30
\.


--
-- Data for Name: diagnose_possible_issues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnose_possible_issues (id, category_id, title, badge, badge_class, description, match_score, risks, estimated_cost, image_src, sort_order, created_at) FROM stdin;
low-engine-oil	engine_noise	Low Engine Oil or Poor Lubrication	High Match	bg-[#ffe8ea] text-[#ff4f68]	Low or degraded oil can cause ticking or knocking sounds from the top end or bottom end of the engine.	88	{"Engine wear",Overheating,"Internal damage"}	Rs. 1,500 - Rs. 4,000	/assets/Engine_oil.png	1	2026-07-22 13:38:54.544056+05:30
belt-tensioner	engine_noise	Drive Belt or Tensioner Issue	Medium Match	bg-[#fff2df] text-[#f59a23]	A loose belt or worn tensioner can create whining or rattling sounds that change with RPM or AC load.	71	{"Accessory failure","Battery not charging","Breakdown risk"}	Rs. 2,000 - Rs. 6,500	/assets/Electrical.png	2	2026-07-22 13:38:54.544056+05:30
timing-component	engine_noise	Timing Chain or Valve Train Noise	Low Match	bg-[#edf2ff] text-[#4974ff]	Worn timing or valve train parts can cause repeated ticking or rattling, especially during startup.	56	{"Poor timing","Engine misfire","Major repair if ignored"}	Rs. 6,000 - Rs. 22,000	/assets/engine_2.png	3	2026-07-22 13:38:54.544056+05:30
low-refrigerant	ac_not_cooling	Low Refrigerant Gas	High Match	bg-[#ffe8ea] text-[#ff4f68]	Low refrigerant can reduce cooling efficiency, especially in traffic or during high ambient temperatures.	86	{"Poor cooling","Compressor strain","Cabin discomfort"}	Rs. 2,000 - Rs. 4,500	/assets/new_ac.png	1	2026-07-22 13:38:54.544056+05:30
ac-filter-blower	ac_not_cooling	Cabin Filter or Blower Restriction	Medium Match	bg-[#fff2df] text-[#f59a23]	Blocked cabin filters or blower issues reduce airflow even if the AC system itself is functioning.	67	{"Weak airflow","Dust buildup","Motor overload"}	Rs. 800 - Rs. 3,000	/assets/ac_filter.png	2	2026-07-22 13:38:54.544056+05:30
compressor-performance	ac_not_cooling	AC Compressor Performance Issue	Low Match	bg-[#edf2ff] text-[#4974ff]	A weak or cycling compressor can cause fluctuating cooling and unusual noise when the AC engages.	53	{"No cooling","Compressor seizure","Higher repair cost later"}	Rs. 5,000 - Rs. 18,000	/assets/ac_compressor.png	3	2026-07-22 13:38:54.544056+05:30
warped-rotor	brake_vibration	Warped Brake Disc	High Match	bg-[#ffe8ea] text-[#ff4f68]	Warped or uneven brake rotors commonly cause steering or pedal vibration during braking.	89	{"Longer stopping distance","Pad wear","Safety risk"}	Rs. 2,500 - Rs. 6,500	/assets/brake_rotor.png	1	2026-07-22 13:38:54.544056+05:30
pad-deposit	brake_vibration	Uneven Brake Pad Deposit	Medium Match	bg-[#fff2df] text-[#f59a23]	Uneven friction deposits on the rotor surface can create pulsing and shudder while braking.	68	{"Reduced smoothness","Rotor hotspots","Noise increase"}	Rs. 1,500 - Rs. 4,000	/assets/brake_pads.png	2	2026-07-22 13:38:54.544056+05:30
brake-caliper	brake_vibration	Brake Caliper Sticking	Low Match	bg-[#edf2ff] text-[#4974ff]	A sticking caliper can overheat one side, cause vibration, and wear pads unevenly.	52	{"Brake drag","Heat damage","Uneven braking"}	Rs. 2,000 - Rs. 7,000	/assets/brake_caliper.png	3	2026-07-22 13:38:54.544056+05:30
air-intake-restriction	low_pickup	Air Intake or Filter Restriction	High Match	bg-[#ffe8ea] text-[#ff4f68]	A clogged air filter or restricted intake can reduce acceleration and make the engine feel dull.	83	{"Poor mileage","Weak response","Dirty throttle body"}	Rs. 700 - Rs. 3,000	/assets/air_filter.png	1	2026-07-22 13:38:54.544056+05:30
fuel-delivery	low_pickup	Fuel Delivery Problem	Medium Match	bg-[#fff2df] text-[#f59a23]	Fuel pump or injector-side issues can cause hesitation, weak pickup, and inconsistent acceleration.	69	{"Engine hesitation","Stalling risk","Poor combustion"}	Rs. 2,500 - Rs. 12,000	/assets/fuel_pump.png	2	2026-07-22 13:38:54.544056+05:30
ignition-performance	low_pickup	Ignition or Sensor Performance Issue	Low Match	bg-[#edf2ff] text-[#4974ff]	Weak spark or inaccurate sensor signals can reduce power and trigger a check engine light.	57	{Misfire,"Catalyst damage","Poor drivability"}	Rs. 1,500 - Rs. 9,000	/assets/spark_plug.png	3	2026-07-22 13:38:54.544056+05:30
battery-discharge	starting_issue	Weak or Discharged Battery	High Match	bg-[#ffe8ea] text-[#ff4f68]	Low battery voltage is the most common reason for slow cranking or no-start complaints.	87	{"Stranded vehicle","Repeated no-start","Alternator stress"}	Rs. 3,500 - Rs. 9,000	/assets/Electrical.png	1	2026-07-22 13:38:54.544056+05:30
starter-motor	starting_issue	Starter Motor or Solenoid Issue	Medium Match	bg-[#fff2df] text-[#f59a23]	If power is available but the engine will not crank properly, the starter system may be at fault.	66	{"Intermittent start failure","Tow requirement","Wiring heat"}	Rs. 2,500 - Rs. 10,000	/assets/starter_motor.png	2	2026-07-22 13:38:54.544056+05:30
fuel-ignition-no-start	starting_issue	Fuel or Ignition No-Start Condition	Low Match	bg-[#edf2ff] text-[#4974ff]	If the engine cranks normally but does not start, fuel or spark delivery should be checked.	54	{"Repeated crank stress","Battery drain","Breakdown risk"}	Rs. 2,000 - Rs. 12,000	/assets/fuel_pump.png	3	2026-07-22 13:38:54.544056+05:30
wheel-balance	steering_suspension	Wheel Balancing Issue	High Match	bg-[#ffe8ea] text-[#ff4f68]	Unbalanced wheels can cause vibration in the steering wheel, especially at higher speeds.	85	{"Uneven tyre wear","Suspension damage"}	Rs. 1,500 - Rs. 2,500	/assets/tyres_and_wheels.png	1	2026-07-22 13:38:54.544056+05:30
wheel-alignment	steering_suspension	Wheel Alignment Issue	Medium Match	bg-[#fff2df] text-[#f59a23]	Improper alignment can cause vibrations and pulling to one side.	65	{"Uneven tyre wear","Handling issues"}	Rs. 800 - Rs. 1,500	/assets/Tyre_rotataion.png	2	2026-07-22 13:38:54.544056+05:30
brake-disc	steering_suspension	Brake Disc Warped	Low Match	bg-[#edf2ff] text-[#4974ff]	Warped brake discs can cause vibration in the steering wheel while braking.	40	{"Reduced braking performance","Safety risk"}	Rs. 2,500 - Rs. 4,500	/assets/brake_rotor.png	3	2026-07-22 13:38:54.544056+05:30
\.


--
-- Data for Name: diagnose_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnose_questions (id, category_id, label, question, options, sort_order, created_at) FROM stdin;
noise_timing	engine_noise	Heard most clearly	When do you hear the noise most clearly?	{"At idle","During acceleration","During cold start","At high RPM"}	1	2026-07-22 13:38:54.544056+05:30
noise_character	engine_noise	Sound type	What kind of sound is it?	{Ticking,Knocking,Rattling,Whining}	2	2026-07-22 13:38:54.544056+05:30
warning_light_engine	engine_noise	Warning lights	Is any warning light visible on the dashboard?	{"Check engine light","Oil warning light","No warning light","Not sure"}	3	2026-07-22 13:38:54.544056+05:30
noise_change_with_ac	engine_noise	With AC on	Does the noise change when AC is switched on?	{"Gets louder","Gets lower","No change","Not sure"}	4	2026-07-22 13:38:54.544056+05:30
ac_condition	ac_not_cooling	Cooling worst	When is the cooling worst?	{"At idle","In traffic","Only in daytime heat","All the time"}	1	2026-07-22 13:38:54.544056+05:30
ac_airflow	ac_not_cooling	Vent airflow	How is the airflow from the vents?	{"Strong but not cold","Weak airflow","No airflow","Normal airflow"}	2	2026-07-22 13:38:54.544056+05:30
ac_compressor_sound	ac_not_cooling	AC sound	Do you hear any unusual sound when the AC is turned on?	{Clicking,Whining,"No unusual sound","Not sure"}	3	2026-07-22 13:38:54.544056+05:30
ac_recent_service	ac_not_cooling	Recent service	Has the AC been serviced or gas refilled recently?	{"Yes recently","Not recently",Never,"Not sure"}	4	2026-07-22 13:38:54.544056+05:30
brake_speed	brake_vibration	Speed range	At what speed do you feel the vibration most?	{"Low speed","Medium speed","High speed","At all speeds"}	1	2026-07-22 13:38:54.544056+05:30
brake_pedal_feedback	brake_vibration	Brake pedal feel	Do you also feel pulsing in the brake pedal?	{"Yes clearly",Slightly,No,"Not sure"}	2	2026-07-22 13:38:54.544056+05:30
brake_recent_work	brake_vibration	Recent brake work	Were the brake pads or discs changed recently?	{"Yes recently","A while ago",No,"Not sure"}	3	2026-07-22 13:38:54.544056+05:30
brake_sound	brake_vibration	Braking sound	Do you hear any noise while braking?	{Squeal,Grinding,"No noise","Not sure"}	4	2026-07-22 13:38:54.544056+05:30
pickup_condition	low_pickup	Weakness noticed	When is the weak pickup most noticeable?	{"During overtaking","On inclines","With AC on","All the time"}	1	2026-07-22 13:38:54.544056+05:30
pickup_exhaust	low_pickup	Exhaust smoke	Do you notice unusual smoke from the exhaust?	{"Black smoke","White smoke","No smoke","Not sure"}	2	2026-07-22 13:38:54.544056+05:30
pickup_warning_light	low_pickup	Dashboard light	Is the check engine light on?	{Yes,No,Sometimes,"Not sure"}	3	2026-07-22 13:38:54.544056+05:30
pickup_service_history	low_pickup	Recent service	Was the air filter, fuel filter, or spark plugs serviced recently?	{"Yes recently","Service overdue","Not sure","No idea"}	4	2026-07-22 13:38:54.544056+05:30
starting_crank	starting_issue	Starter behavior	What happens when you try to start the car?	{"No crank at all","Slow cranking","Cranks but does not start","Single click only"}	1	2026-07-22 13:38:54.544056+05:30
starting_lights	starting_issue	Electrical signs	Do dashboard lights and horn work normally?	{"Yes normal","Dim or weak","Nothing works","Not sure"}	2	2026-07-22 13:38:54.544056+05:30
starting_recent_idle	starting_issue	Vehicle idle period	Was the car parked unused for several days?	{Yes,No,"Only overnight","Not sure"}	3	2026-07-22 13:38:54.544056+05:30
starting_after_jump	starting_issue	After jump start	Does it start with jumper cables or after charging?	{Yes,No,"Not tried","Not sure"}	4	2026-07-22 13:38:54.544056+05:30
drive_vibration_speed	steering_suspension	When it happens	When do you feel the vibration most?	{"Only while braking","While accelerating","At constant speed",Always}	1	2026-07-22 13:38:54.544056+05:30
steering_shake_present	steering_suspension	Steering shake	Does the steering wheel also shake?	{Yes,No,"Only sometimes","Not sure"}	2	2026-07-22 13:38:54.544056+05:30
issue_started	steering_suspension	Issue start	When did this issue start?	{"Recently within a week","Gradually over time","After tyre work","Long back"}	3	2026-07-22 13:38:54.544056+05:30
road_surface_effect	steering_suspension	Road surface effect	Does it get worse on rough roads or uneven surfaces?	{"Yes much worse","Slightly worse","No change","Not sure"}	4	2026-07-22 13:38:54.544056+05:30
\.


--
-- Data for Name: diagnose_result_summaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnose_result_summaries (id, title, heading, body, pill, pill_class, icon, icon_class, sort_order, created_at) FROM stdin;
summary-top-concern	Top Concern	Wheel Balancing Issue	Unbalanced wheels are the most likely cause of the vibration.	High Priority	bg-[#ffe9ec] text-[#ff5a63]	CircleAlert	bg-[#fff1f1] text-[#ff5d67]	1	2026-07-22 13:38:54.544056+05:30
summary-other-issues	Other Possible Issues	Wheel Alignment, Brake Disc Warped	These issues may also contribute to the problem.	Medium Priority	bg-[#fff1de] text-[#f39b20]	Wrench	bg-[#fff5e8] text-[#f39b20]	2	2026-07-22 13:38:54.544056+05:30
summary-what-this-means	What This Means	Addressing these issues early can prevent further damage and ensure safety.		Important	bg-[#e8f8eb] text-[#25a24a]	Info	bg-[#edf2ff] text-[#4974ff]	3	2026-07-22 13:38:54.544056+05:30
\.


--
-- Data for Name: diagnose_trust_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnose_trust_items (id, title, description, icon, sort_order, created_at) FROM stdin;
trust-100-free	100% Free	No hidden charges	Shield	1	2026-07-22 13:38:54.544056+05:30
trust-trusted-garages	Trusted Garages Only	Verified & rated garages	Settings	2	2026-07-22 13:38:54.544056+05:30
trust-best-price	Best Price Guarantee	Get the best deals	Tag	3	2026-07-22 13:38:54.544056+05:30
trust-secure	Secure & Private	Your data is safe with us	Lock	4	2026-07-22 13:38:54.544056+05:30
\.


--
-- Data for Name: diagnosis_media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnosis_media (id, diagnosis_request_id, media_type, url, created_at) FROM stdin;
\.


--
-- Data for Name: diagnosis_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnosis_requests (id, customer_id, vehicle_id, symptom_text, status, created_at) FROM stdin;
68192af8-cedd-40fc-8f3b-a17ba09b5156	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	AC not cooling	completed	2026-07-22 15:19:10.015025+05:30
4afe5b15-09a0-442e-bb72-9ccdd95ad98a	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	AC not cooling	completed	2026-07-23 12:38:42.864912+05:30
bc6d50b6-ba97-4491-8289-ddc3c3ffdb04	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	AC not cooling	completed	2026-07-23 12:39:21.753039+05:30
1df73477-7a66-43e5-af93-2a72b8195081	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Brake vibration	completed	2026-07-23 12:43:16.749905+05:30
90a3108a-8e1d-4957-bb9b-44ed435e435e	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	AC not cooling	completed	2026-07-23 15:03:50.588392+05:30
b867d823-c66b-4928-af58-b6fb67b915a9	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Low pickup	completed	2026-07-23 15:09:20.511566+05:30
17e031ca-256c-46fe-9028-41c3a8b4eb8b	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Low pickup	completed	2026-07-23 15:10:20.066664+05:30
d32e47e8-1177-4370-b9a4-9fe872a54442	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	AC not cooling	completed	2026-07-23 15:23:00.968883+05:30
45ed9168-f459-4874-94a0-40deea6de06a	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	AC not cooling	completed	2026-07-23 15:38:12.174008+05:30
0c2d19e2-5025-4e35-a500-91c71940beb6	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Steering pulls to the left	completed	2026-07-23 15:50:38.198379+05:30
479ed301-655e-40e3-8d73-1be77b960710	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	AC blowing warm air	completed	2026-07-23 16:02:56.733772+05:30
c922d066-26da-4730-83a8-39358353aeb5	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	AC not cooling	completed	2026-07-23 16:21:15.286686+05:30
e53fb5fa-1603-43c5-a2a0-347b825baf59	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	AC not cooling	completed	2026-07-23 16:46:44.120137+05:30
44c4cb95-b453-4bce-b9b5-7179a6d8a927	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Engine overheating	completed	2026-07-23 16:49:00.587722+05:30
0ffd4b8a-28c2-4e15-869e-7e47d6aa9528	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Steering vibration	completed	2026-07-23 16:50:17.926241+05:30
38158953-aec6-47ba-8ef2-afe37c086137	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Battery Degradation	completed	2026-07-23 17:01:14.0734+05:30
0dca0101-8a0d-4e13-8167-aa2f9d1aa071	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Car won't start	completed	2026-07-23 17:24:01.907013+05:30
13541cc5-af17-4d98-8815-639d3bf6fd6d	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Power outlet stopped working but everything else works.	completed	2026-07-23 17:31:41.262818+05:30
d1231904-8c59-4cde-ace9-37b253cde523	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Engine noise	completed	2026-07-23 17:45:01.532538+05:30
7d8a63a3-afb7-44bd-90e7-82a82ca6bf38	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	tyre air is low	completed	2026-07-23 23:23:34.814224+05:30
59fcd66a-a24c-4f7f-933e-100f6d22f588	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Tyre air is low	completed	2026-07-24 08:02:34.942472+05:30
f53e465c-6e8a-42b8-ab15-c79b1337fd2e	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Tyre air is low	completed	2026-07-24 08:15:59.738059+05:30
2c496bae-b5e7-48b9-983c-0a30a1158c74	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Tyre air is low	completed	2026-07-24 08:34:29.704667+05:30
69c96b54-cee2-497a-bf6d-a8b36c8172f4	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	tyre air is low	completed	2026-07-24 08:49:02.121301+05:30
be2e9422-0b97-4fa2-9bdd-72eeecc091c3	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	tyre air is low\\n\\nAdditional information: I changed the tyre three days ago.	completed	2026-07-24 08:49:23.822651+05:30
91f81d38-4efd-49cb-8db1-d6849c0e1150	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Engine Heating	completed	2026-07-24 08:53:00.95003+05:30
4f540546-bcb4-4295-9bff-ba3254e68f32	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Tyre air is low	completed	2026-07-24 09:16:19.050169+05:30
f3ac92fe-e788-45fe-b09f-4280f831c261	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	tyre air is low	completed	2026-07-24 10:40:37.43863+05:30
2b871bbc-1cca-4816-b9eb-40a9ee46975c	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	tyre got flat	completed	2026-07-24 10:48:46.930509+05:30
f8d8a336-b64e-4a5f-9e6a-5670dc6929ad	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Headlight is not working	completed	2026-07-24 11:07:18.159506+05:30
86421b34-3f9f-4f31-9463-2c09988700cb	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	wiper is not working	completed	2026-07-24 11:28:26.8024+05:30
7d5c39c4-0bb8-4a0b-afbb-085ae99c162b	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	car seat issue , not able to move forward , backward	completed	2026-07-24 11:32:02.157071+05:30
faaf0753-3fc5-423b-8c2b-7cdbd127029b	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	wiper is not working	completed	2026-07-24 11:34:25.126925+05:30
7b6ad5d3-3938-41c0-be47-320d6ea7f5e1	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	bluetooth audio is nt connecting inside car	completed	2026-07-24 12:21:34.033027+05:30
7084dfd0-20b2-4fe6-8e12-e73bbe2c4fdf	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	engine oil issue	completed	2026-07-24 12:25:04.747423+05:30
f3c64393-4fef-4cd9-bc42-ba476cc8cae4	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	bluetooth is not connecting	completed	2026-07-24 12:49:19.067625+05:30
bb6c2c78-899b-444d-839a-1a0371bb8b2b	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	wiper not working	completed	2026-07-24 13:37:13.601806+05:30
4137b808-005d-4e0a-b66d-f92573de66f9	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	seatblet is stuck	completed	2026-07-24 16:45:19.360543+05:30
ee90eb82-a237-419f-a438-0f5a1839df8f	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	horn is not working	completed	2026-07-24 23:05:51.802846+05:30
68533421-8fbf-40d9-94ea-3deca8c334a5	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	tyres are screeching when i apply brakes	completed	2026-07-25 09:51:26.175677+05:30
514204a1-e56b-4aa5-9050-250b57c3f3fc	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	tyre air is low	completed	2026-07-25 13:40:30.889671+05:30
fa04ed93-e8e0-4f29-b8c9-aa967e9a9ef0	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	tyre air is low\\n\\nAdditional information: but there is no crack or sidewall bulge	completed	2026-07-25 13:41:15.953037+05:30
522af5cc-9292-444e-8ec4-d111e9c314f3	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	Engine noise	completed	2026-07-25 15:58:27.162452+05:30
d40ee76a-081a-496d-95ff-faeea8488ea8	887ae938-b723-4f0f-ab8c-b19169e4dc20	153b6fef-b6ce-4d3c-b473-776699685f0b	Low pickup	completed	2026-07-25 16:29:51.461207+05:30
45226b91-59ce-4554-ba4e-eb98dd2e8ddc	887ae938-b723-4f0f-ab8c-b19169e4dc20	153b6fef-b6ce-4d3c-b473-776699685f0b	Brake vibration	completed	2026-07-25 17:04:37.740308+05:30
bd14eee6-3d23-4f62-9074-968d09b1a935	887ae938-b723-4f0f-ab8c-b19169e4dc20	153b6fef-b6ce-4d3c-b473-776699685f0b	Brake vibration	completed	2026-07-25 19:11:43.855356+05:30
a76e61c7-e663-42a0-97d0-05ad56e9f2c9	887ae938-b723-4f0f-ab8c-b19169e4dc20	153b6fef-b6ce-4d3c-b473-776699685f0b	car is not starting	completed	2026-07-25 19:32:22.566178+05:30
42d39b98-2c0a-4b69-9086-c1c296f03849	887ae938-b723-4f0f-ab8c-b19169e4dc20	6c82464f-b9ce-48f4-9639-d8be36594587	AC not cooling	completed	2026-07-25 19:33:39.738617+05:30
1889d742-7393-4e6e-807e-78dc9aa67eac	887ae938-b723-4f0f-ab8c-b19169e4dc20	6c82464f-b9ce-48f4-9639-d8be36594587	AC not cooling	completed	2026-07-25 22:52:38.481473+05:30
aa9827a5-8395-43ee-8882-4a025ccb1294	887ae938-b723-4f0f-ab8c-b19169e4dc20	6c82464f-b9ce-48f4-9639-d8be36594587	AC not cooling	completed	2026-07-26 11:20:09.883185+05:30
ac7484a1-35fb-4458-841f-da897c2841a7	887ae938-b723-4f0f-ab8c-b19169e4dc20	6c82464f-b9ce-48f4-9639-d8be36594587	AC not cooling	completed	2026-07-26 11:29:18.346631+05:30
ebc9919b-3f7c-4289-9f06-cc4b226a7d3c	887ae938-b723-4f0f-ab8c-b19169e4dc20	6c82464f-b9ce-48f4-9639-d8be36594587	Brake vibration	completed	2026-07-26 12:32:49.387902+05:30
f668a50d-68b4-4b8f-8a70-a61dc614d53a	887ae938-b723-4f0f-ab8c-b19169e4dc20	06cd2ee9-fe36-481d-a1ec-3903925cb216	Brake vibration	completed	2026-07-26 12:33:27.147456+05:30
5837a54f-be54-413f-8ab0-b67342747f75	887ae938-b723-4f0f-ab8c-b19169e4dc20	06cd2ee9-fe36-481d-a1ec-3903925cb216	low air in right tyre	completed	2026-07-26 13:35:29.005875+05:30
27667df4-49e7-4fa4-998c-2fd3e4a57f76	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	low air in right tyre	completed	2026-07-26 13:36:12.843493+05:30
4c9ec4d7-50d7-47cd-a921-2b2fd1a3a76b	887ae938-b723-4f0f-ab8c-b19169e4dc20	ab793c5c-90bf-4128-bdc0-46e31bd1cd58	Charging is much slower than usual, and the vehicle displays "Charging System Fault" intermittently.	completed	2026-07-26 15:03:57.562949+05:30
3af585b6-8050-4574-b427-ce3979226d9c	887ae938-b723-4f0f-ab8c-b19169e4dc20	ab793c5c-90bf-4128-bdc0-46e31bd1cd58	Charging is much slower than usual, and the vehicle displays "Charging System Fault" intermittently.	completed	2026-07-26 15:37:30.907213+05:30
5d2ca93a-f5c8-4e46-8ec9-8895f8d29887	887ae938-b723-4f0f-ab8c-b19169e4dc20	ab793c5c-90bf-4128-bdc0-46e31bd1cd58	Charging is much slower than usual, and the vehicle displays "Charging System Fault" intermittently.	completed	2026-07-26 15:43:51.66607+05:30
c3e6191a-f951-42b8-af62-76735b90757b	887ae938-b723-4f0f-ab8c-b19169e4dc20	ab793c5c-90bf-4128-bdc0-46e31bd1cd58	Engine noise	completed	2026-07-26 16:49:24.725643+05:30
100292e2-37f1-4e8d-8449-e4c5f59ac28c	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	AC not cooling	completed	2026-07-26 18:05:57.950995+05:30
dbb7ecc9-8740-43c7-9f43-708c001165a8	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	Engine noise	completed	2026-07-26 18:17:41.236367+05:30
982ce3d5-81af-4ed7-806f-240f3e81ce46	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	AC not cooling	completed	2026-07-26 18:24:10.288187+05:30
8c184a31-1e98-423a-937d-cc0feb041832	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	Low pickup	completed	2026-07-26 18:35:03.168382+05:30
656179e3-9cbb-428b-a347-9dc06f9df581	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	Engine noise	completed	2026-07-26 18:54:20.088664+05:30
2fa2c0f9-ef9e-4cd0-a0ef-239983ff3e31	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	AC not cooling	completed	2026-07-26 19:01:18.991094+05:30
8076ee3f-2f99-4d07-b359-747e1e253ef5	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	Engine noise	completed	2026-07-26 19:49:03.499243+05:30
d0bbdfd5-7dd4-4c9b-bb79-ff99ed75e53c	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	Engine noise	completed	2026-07-27 10:19:50.529582+05:30
11d832b6-7413-4259-9981-1827d4817ba6	7d06ddc5-7fb8-4402-8624-a7b22f53633e	41f77633-893a-4a41-b95e-316358760e4d	Engine making clicking noise during acceleration	completed	2026-07-27 12:46:03.516121+05:30
d2c72a0a-4bb6-4b55-9a87-d8b17baed3a2	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	Engine noise	completed	2026-07-27 12:57:08.860422+05:30
c09b3e27-6551-4e15-9faa-65235168473a	7d06ddc5-7fb8-4402-8624-a7b22f53633e	41f77633-893a-4a41-b95e-316358760e4d	tyre air is low	completed	2026-07-27 13:17:58.341817+05:30
38f2c43e-cf01-4e9b-b911-bc7a2326d2c6	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	wiper is not working	completed	2026-07-27 13:20:09.235918+05:30
a55d0580-eff7-45bd-9b90-790e977d27fb	7d06ddc5-7fb8-4402-8624-a7b22f53633e	41f77633-893a-4a41-b95e-316358760e4d	Squeaking noise when braking	completed	2026-07-27 13:49:17.535762+05:30
b6b4c8b7-6514-45e8-8580-20e4e332cdab	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	engine overheating	completed	2026-07-27 15:37:57.213031+05:30
a9f05a46-3f4a-4c4e-88af-fcfc7cbadcbd	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	tyre air is low	completed	2026-07-27 16:02:02.983066+05:30
9a60a334-4cdd-4a66-bd1b-784fad67ee85	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	tyre air is low	completed	2026-07-27 16:10:10.866428+05:30
e35fc703-d52b-497a-84ff-9451abeec0ba	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	tyre air is low	completed	2026-07-27 16:21:28.420534+05:30
ee266b82-9f6f-49f8-828b-84797930d678	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	tyre air is low	completed	2026-07-27 23:09:51.76409+05:30
6d1ff241-d995-4fe5-be25-49ad35c44262	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	seatbelt is stuck	completed	2026-07-28 11:01:28.412528+05:30
6beab251-abbb-4306-8507-c0be2064ab0e	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	AC not cooling	completed	2026-07-29 08:32:22.846484+05:30
3be4537a-55b2-47da-bfae-a0c1b5c3fa4c	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	AC not cooling	completed	2026-07-29 10:23:23.109627+05:30
319cf51d-3ace-4139-bdd0-8c19d300aa43	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	AC not cooling	completed	2026-07-29 10:24:00.753206+05:30
bdc4a5ed-4ca6-43da-b4f6-4517cc59849a	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	Engine noise	completed	2026-07-29 10:26:55.767305+05:30
f461c6cc-69c4-4e35-a6d3-a0fa51187fd1	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	Brake vibration	completed	2026-07-29 10:37:01.770463+05:30
5fb6c20f-bb48-4abd-a302-d6b6bfe589fd	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	tyre air is low	completed	2026-07-29 15:47:57.849354+05:30
424bcf23-4995-4eae-afb1-25537a17c7ea	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	Low pickup	completed	2026-07-29 23:39:31.620987+05:30
81f33170-40d2-4b22-940f-a6143e5e5c71	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	Brake vibration	completed	2026-07-29 23:53:00.916068+05:30
53a09e8b-82e0-438b-ad1c-6158be0e095f	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	wiper is stuck	completed	2026-07-30 01:31:38.57348+05:30
\.


--
-- Data for Name: diagnosis_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnosis_results (id, diagnosis_request_id, issues, confidence_score, risk_level, diy_allowed, diy_steps, next_action, created_at) FROM stdin;
1900d8d9-dff2-494b-a7c3-9a7c3c7c1333	68192af8-cedd-40fc-8f3b-a17ba09b5156	[{"name": "Low Refrigerant Gas", "confidence": 80, "requiredParts": ["Refrigerant recharge kit"], "estimatedPriceRange": {"max": 55, "min": 25}}, {"name": "Cabin Filter or Blower Restriction", "confidence": 70, "requiredParts": ["Cabin air filter"], "estimatedPriceRange": {"max": 40, "min": 10}}, {"name": "AC Compressor Performance Issue", "confidence": 55, "requiredParts": ["AC compressor"], "estimatedPriceRange": {"max": 220, "min": 60}}]	68	high	f	{}	bookGarage	2026-07-22 15:19:10.015025+05:30
f42cd1b3-4a12-4129-be39-0b12431d4c08	4afe5b15-09a0-442e-bb72-9ccdd95ad98a	[{"name": "Low Refrigerant Gas", "confidence": 90, "requiredParts": ["Refrigerant recharge kit"], "estimatedPriceRange": {"max": 55, "min": 25}}]	90	medium	f	{"Locate the low-pressure AC port.","Connect the recharge hose and pressure gauge.","Add refrigerant with the engine running and AC on max.","Monitor pressure to avoid overfilling."}	bookGarage	2026-07-23 12:38:42.864912+05:30
7be52fe1-cb8f-47e6-aa84-59915b9a49b8	bc6d50b6-ba97-4491-8289-ddc3c3ffdb04	[{"name": "Low Refrigerant Gas", "confidence": 78, "requiredParts": ["Refrigerant recharge kit"], "estimatedPriceRange": {"max": 55, "min": 25}}]	78	medium	f	{"Locate the low-pressure AC port.","Connect the recharge hose and pressure gauge.","Add refrigerant with the engine running and AC on max.","Monitor pressure to avoid overfilling."}	bookGarage	2026-07-23 12:39:21.753039+05:30
62236111-3d21-4823-b8f1-53fa874716ed	1df73477-7a66-43e5-af93-2a72b8195081	[{"name": "Warped Brake Disc", "confidence": 89, "requiredParts": ["Brake rotors"], "estimatedPriceRange": {"max": 80, "min": 30}}]	90	high	f	{}	bookGarage	2026-07-23 12:43:16.749905+05:30
5da81758-699d-4f83-a475-c227fbf82cb0	90a3108a-8e1d-4957-bb9b-44ed435e435e	[{"name": "AC Compressor Performance Issue", "confidence": 78, "requiredParts": ["AC compressor"], "estimatedPriceRange": {"max": 220, "min": 60}}, {"name": "Low Refrigerant Gas", "confidence": 40, "requiredParts": ["Refrigerant recharge kit"], "estimatedPriceRange": {"max": 55, "min": 25}}]	70	high	f	{}	bookGarage	2026-07-23 15:03:50.588392+05:30
5bad4f24-6ad6-4994-ac71-cf5595062ab6	b867d823-c66b-4928-af58-b6fb67b915a9	[{"name": "Low Engine Oil or Poor Lubrication", "confidence": 85, "requiredParts": ["Engine oil", "Oil filter"], "estimatedPriceRange": {"max": 50, "min": 20}}, {"name": "Fuel Delivery Problem", "confidence": 70, "requiredParts": ["Fuel filter", "Fuel pump"], "estimatedPriceRange": {"max": 150, "min": 30}}]	78	medium	f	{"Check and correct engine oil level and condition.","If oil level is low, add the correct grade of oil and replace the oil filter if needed.","Relieve fuel system pressure and replace the fuel filter (if external).","Turn the key to prime the fuel system and check for leaks."}	bookGarage	2026-07-23 15:09:20.511566+05:30
7ec9f23e-59c0-4403-aa7c-e13309852ac8	17e031ca-256c-46fe-9028-41c3a8b4eb8b	[{"name": "Fuel Delivery Problem", "confidence": 73, "requiredParts": ["Fuel filter", "Fuel pump"], "estimatedPriceRange": {"max": 150, "min": 30}}, {"name": "Ignition or Sensor Performance Issue", "confidence": 60, "requiredParts": ["Spark plugs", "Ignition coils"], "estimatedPriceRange": {"max": 110, "min": 20}}, {"name": "Low Refrigerant Gas", "confidence": 45, "requiredParts": ["Refrigerant recharge kit"], "estimatedPriceRange": {"max": 55, "min": 25}}]	60	medium	f	{"Relieve fuel system pressure before working on the fuel system.","Replace the fuel filter (if external) and inspect fuel lines for leaks.","Inspect and replace spark plugs and ignition coils if they show wear or damage."}	bookGarage	2026-07-23 15:10:20.066664+05:30
57f70cfc-c4e8-4f92-99ac-2cf0d8d6ff9e	d32e47e8-1177-4370-b9a4-9fe872a54442	[{"name": "Low Refrigerant Gas", "confidence": 90, "requiredParts": ["Refrigerant recharge kit"], "estimatedPriceRange": {"max": 55, "min": 25}}]	88	medium	f	{"Locate the low-pressure AC port.","Connect the recharge hose and pressure gauge.","Add refrigerant with the engine running and AC on max.","Monitor pressure to avoid overfilling."}	bookGarage	2026-07-23 15:23:00.968883+05:30
de4b9a56-0c3b-4c20-a787-b361cf1ff03f	45ed9168-f459-4874-94a0-40deea6de06a	[{"name": "Low Refrigerant Gas", "confidence": 80, "requiredParts": ["Refrigerant recharge kit"], "estimatedPriceRange": {"max": 55, "min": 25}}]	80	medium	f	{"Locate the low-pressure AC port.","Connect the recharge hose and pressure gauge.","Add refrigerant with the engine running and AC on max.","Monitor pressure to avoid overfilling."}	bookGarage	2026-07-23 15:38:12.174008+05:30
7970de27-0821-4d3d-8d71-b7c75ea1c15a	0c2d19e2-5025-4e35-a500-91c71940beb6	[{"name": "Wheel Alignment Issue", "confidence": 80, "requiredParts": [], "estimatedPriceRange": {"max": 20, "min": 10}}, {"name": "Wheel Balancing Issue", "confidence": 50, "requiredParts": ["Wheel weights"], "estimatedPriceRange": {"max": 30, "min": 20}}]	75	medium	f	{}	bookGarage	2026-07-23 15:50:38.198379+05:30
af549811-7124-44d4-bc6e-319f45d30f6e	479ed301-655e-40e3-8d73-1be77b960710	[{"name": "Low Refrigerant Gas", "confidence": 90, "requiredParts": ["Refrigerant recharge kit"], "estimatedPriceRange": {"max": 55, "min": 25}}, {"name": "AC Compressor Performance Issue", "confidence": 45, "requiredParts": ["AC compressor"], "estimatedPriceRange": {"max": 220, "min": 60}}]	88	medium	f	{"Locate the low-pressure AC port.","Connect the recharge hose and pressure gauge.","Add refrigerant with the engine running and AC on max.","Monitor pressure to avoid overfilling."}	bookGarage	2026-07-23 16:02:56.733772+05:30
f371a6eb-ac1d-4c00-8e7f-2a87539ff6d2	c922d066-26da-4730-83a8-39358353aeb5	[{"name": "Cabin Filter or Blower Restriction", "confidence": 70, "requiredParts": ["Cabin air filter"], "estimatedPriceRange": {"max": 40, "min": 10}}, {"name": "Low Refrigerant Gas", "confidence": 55, "requiredParts": ["Refrigerant recharge kit"], "estimatedPriceRange": {"max": 55, "min": 25}}, {"name": "AC Compressor Performance Issue", "confidence": 60, "requiredParts": ["AC compressor"], "estimatedPriceRange": {"max": 220, "min": 60}}]	62	high	f	{}	bookGarage	2026-07-23 16:21:15.286686+05:30
2e55dc8e-9aa5-493b-9eb0-8de6f351f673	e53fb5fa-1603-43c5-a2a0-347b825baf59	[{"name": "AC Compressor Performance Issue", "confidence": 70, "requiredParts": ["AC compressor"], "estimatedPriceRange": {"max": 220, "min": 60}}, {"name": "Cabin Filter or Blower Restriction", "confidence": 65, "requiredParts": ["Cabin air filter"], "estimatedPriceRange": {"max": 40, "min": 10}}]	68	high	f	{}	bookGarage	2026-07-23 16:46:44.120137+05:30
90c16271-1aa0-4183-8bdd-650f5fe5782d	44c4cb95-b453-4bce-b9b5-7179a6d8a927	[{"name": "Starter Motor or Solenoid Issue", "confidence": 70, "requiredParts": ["Starter motor"], "estimatedPriceRange": {"max": 120, "min": 30}}]	70	medium	f	{"Disconnect battery negative cable.","Raise and support vehicle safely.","Disconnect wiring connections from starter.","Unbolt and replace starter motor."}	bookGarage	2026-07-23 16:49:00.587722+05:30
99facd33-48a7-41e7-b5f9-0b545774c663	0ffd4b8a-28c2-4e15-869e-7e47d6aa9528	[{"name": "Warped Brake Disc", "confidence": 92, "requiredParts": ["Brake rotors"], "estimatedPriceRange": {"max": 80, "min": 30}}, {"name": "Brake Caliper Sticking", "confidence": 55, "requiredParts": ["Brake caliper"], "estimatedPriceRange": {"max": 85, "min": 25}}]	80	high	f	{}	bookGarage	2026-07-23 16:50:17.926241+05:30
613d0e76-1045-494f-886a-26fb3bad1375	38158953-aec6-47ba-8ef2-afe37c086137	[{"name": "Weak or Discharged Battery", "confidence": 92, "requiredParts": ["Car battery"], "estimatedPriceRange": {"max": 110, "min": 45}}]	90	medium	f	{"Turn off engine and wear safety gear.","Disconnect negative terminal first, then positive terminal.","Remove hold-down bracket and lift battery out.","Clean terminals, install new battery, and connect positive first."}	bookGarage	2026-07-23 17:01:14.0734+05:30
6740b4f4-b357-4282-b175-935d260f941d	0dca0101-8a0d-4e13-8167-aa2f9d1aa071	[{"name": "Fuel or Ignition No-Start Condition", "confidence": 70, "requiredParts": ["Fuel pump relay"], "estimatedPriceRange": {"max": 150, "min": 25}}]	70	high	f	{}	bookGarage	2026-07-23 17:24:01.907013+05:30
b2ddb5ae-ce18-4933-82ba-0008ae6f76b1	13541cc5-af17-4d98-8815-639d3bf6fd6d	[{"name": "Power outlet fuse or wiring issue", "confidence": 45, "requiredParts": ["Power outlet fuse", "Outlet wiring connector"], "estimatedPriceRange": {"max": 20, "min": 5}}]	45	low	t	{"Locate the interior fuse box (usually under the dashboard).","Identify the fuse for the power outlet (refer to the owner’s manual).","Remove the fuse and inspect for a broken filament.","Replace with a new fuse of the same amperage.","If the fuse is intact, inspect the outlet connector for corrosion, clean or reseat it, and verify the wiring continuity."}	diy	2026-07-23 17:31:41.262818+05:30
6f76995b-cef8-4fe0-acc6-166ecf85a37b	d1231904-8c59-4cde-ace9-37b253cde523	[{"name": "Timing Chain or Valve Train Noise", "confidence": 65, "requiredParts": ["Timing chain kit"], "estimatedPriceRange": {"max": 275, "min": 75}}, {"name": "Fuel or Ignition No-Start Condition", "confidence": 70, "requiredParts": ["Fuel pump relay"], "estimatedPriceRange": {"max": 150, "min": 25}}]	70	high	f	{}	bookGarage	2026-07-23 17:45:01.532538+05:30
8cc4513f-a3b3-4b03-8d70-d6525f145d46	7d8a63a3-afb7-44bd-90e7-82a82ca6bf38	[{"name": "Low Engine Oil or Poor Lubrication", "confidence": 90, "requiredParts": ["Engine oil", "Oil filter"], "estimatedPriceRange": {"max": 50, "min": 20}}, {"name": "Cabin Filter or Blower Restriction", "confidence": 70, "requiredParts": ["Cabin air filter"], "estimatedPriceRange": {"max": 40, "min": 10}}]	80	medium	f	{"Check engine oil level via dipstick and add the correct grade of oil if low.","Replace the cabin air filter: locate housing behind glovebox, remove old filter, insert new filter with correct airflow direction, and reseal housing."}	bookGarage	2026-07-23 23:23:34.814224+05:30
860130bf-ac99-42d3-840f-47c92c06eac7	59fcd66a-a24c-4f7f-933e-100f6d22f588	[{"name": "Rapid Tire Pressure Loss (Puncture or Valve Stem Leak)", "confidence": 90, "requiredParts": ["Tire repair kit", "Replacement tire"], "estimatedPriceRange": {"max": 200, "min": 30}}]	85	high	f	{}	bookGarage	2026-07-24 08:02:34.942472+05:30
5d2638ad-0648-4e27-8e2f-f1f548c1bb04	f53e465c-6e8a-42b8-ab15-c79b1337fd2e	[{"name": "Tire Sidewall Crack Causing Slow Air Leak", "confidence": 80, "requiredParts": ["Tire patch kit", "Replacement tire"], "estimatedPriceRange": {"max": 100, "min": 30}}, {"name": "Valve Stem Leak", "confidence": 55, "requiredParts": ["Valve stem"], "estimatedPriceRange": {"max": 30, "min": 15}}, {"name": "Temperature‑Induced Pressure Drop", "confidence": 30, "requiredParts": [], "estimatedPriceRange": {"max": 0, "min": 0}}]	80	low	t	{"Technical Reasoning: The vehicle reports low tyre pressure with a visible small crack on the sidewall. Sidewall cracks can compromise the airtight seal, allowing a slow leak that may not trigger the TPMS if the loss is gradual. The absence of a TPMS light and the fact the issue was noticed only today suggest a recent, localized leak rather than temperature‑related pressure variation. This points strongly to a tyre sidewall defect as the primary cause.","Recommended Next Inspection: Visually inspect the suspect tyre for the crack, punctures, or embedded objects. Use a tyre pressure gauge to confirm current pressure versus manufacturer specs. Perform a soapy‑water test around the crack, valve stem, and bead to locate escaping air. If a leak is confirmed, decide whether to patch/plug the crack (if permissible) or replace the tyre."}	diy	2026-07-24 08:15:59.738059+05:30
1e8ce945-e5ff-491c-a260-5fa820688745	2c496bae-b5e7-48b9-983c-0a30a1158c74	[{"name": "Slow puncture in tyre causing gradual pressure loss", "confidence": 78, "requiredParts": ["Tire plug kit", "Tire pressure gauge"], "estimatedPriceRange": {"max": 80, "min": 30}}, {"name": "Faulty TPMS sensor preventing accurate pressure monitoring", "confidence": 15, "requiredParts": ["TPMS sensor", "Mounting hardware"], "estimatedPriceRange": {"max": 200, "min": 100}}, {"name": "Valve stem leak not detectable with soap test", "confidence": 7, "requiredParts": ["Valve stem", "Valve core"], "estimatedPriceRange": {"max": 30, "min": 15}}]	78	medium	f	{"Technical Reasoning: The vehicle is reporting low tyre pressure that appeared within the last few days. The owner sees a visible puncture area on the tyre but no foreign object, and the pressure holds after inflation, indicating a slow‑leak rather than a rapid loss. No soapy‑water leak was found at the valve stems, and the TPMS status is unknown. These facts point strongly to a tread‑side puncture that is self‑sealing or a very small nail that has exited, which commonly causes gradual pressure loss. A faulty TPMS sensor or a valve‑stem leak are less likely because the pressure loss is gradual and no leakage was seen at the stems.","Recommended Next Inspection: 1. Visually inspect the tyre tread and sidewalls for any nail, cut, or embedded object; use a magnifying lens if needed. 2. Inflate the tyre to the recommended PSI and perform a sub‑mersion test (or use a tyre leak detector spray) to locate any escaping air. 3. Check the TPMS sensor light (if equipped) after the tyre is inflated to see if a sensor fault is indicated. 4. If a puncture is confirmed and is ≤¼ inch in the tread, a plug/patch repair is acceptable; if the damage is in the sidewall or larger than ¼ inch, plan for tyre replacement."}	bookGarage	2026-07-24 08:34:29.704667+05:30
968fe144-8298-492d-a6b7-526db1029c9c	7d5c39c4-0bb8-4a0b-afbb-085ae99c162b	[{"name": "Passenger power seat motor/actuator failure", "confidence": 78, "requiredParts": ["Passenger seat motor assembly"], "estimatedPriceRange": {"max": 350, "min": 200}}, {"name": "Blown fuse for passenger seat motor circuit", "confidence": 55, "requiredParts": ["Seat motor fuse (typically 10A)"], "estimatedPriceRange": {"max": 30, "min": 10}}, {"name": "Seat track obstruction or jammed mechanism", "confidence": 45, "requiredParts": ["Seat track cleaning lubricant"], "estimatedPriceRange": {"max": 50, "min": 0}}]	78	low	f	{}	bookGarage	2026-07-24 11:32:02.157071+05:30
165d3b7d-4561-418a-8c40-d55fcfb0cfd4	69c96b54-cee2-497a-bf6d-a8b36c8172f4	[{"name": "Slow leak in front left tire (valve stem or micro puncture)", "confidence": 75, "requiredParts": ["Tire valve stem", "Tire sealant", "Air compressor"], "estimatedPriceRange": {"max": 70, "min": 20}}, {"name": "Faulty front left TPMS sensor", "confidence": 20, "requiredParts": ["TPMS sensor", "TPMS sensor tool"], "estimatedPriceRange": {"max": 150, "min": 60}}, {"name": "Rim bead leak or corrosion on front left wheel", "confidence": 5, "requiredParts": ["Rim sealant", "Wheel repair kit"], "estimatedPriceRange": {"max": 250, "min": 80}}]	75	medium	f	{"Technical Reasoning: The front‑left tire is consistently low, the TPMS warning light extinguishes after a few minutes (typical of the system re‑checking pressure), and you feel vibration while driving. No puncture is visible, which points to a slow leak—most often from the valve stem, a tiny nail in the tread, or a bead leak that isn’t obvious. The low pressure alone can cause the vibration and handling pull, making this the most probable cause.","Recommended Next Inspection: 1) Use a reliable tire pressure gauge to record the current pressure of the front‑left tire and compare it to the manufacturer’s spec (found on the driver‑side door jamb). 2) Inflate the tire to the correct pressure and monitor for a drop over the next hour. 3) Perform a soapy‑water test around the tread, sidewall, valve stem, and bead area – bubbles indicate escaping air. 4) If the valve stem is the source, you can replace it yourself; otherwise, note the leak location and plan a professional repair."}	bookGarage	2026-07-24 08:49:02.121301+05:30
dd95adf2-6f55-474a-9a4f-f725dc85c503	be2e9422-0b97-4fa2-9bdd-72eeecc091c3	[{"name": "Faulty or leaking front left valve stem causing slow air loss", "confidence": 70, "requiredParts": ["Front left valve stem", "Valve core seal (if needed)", "Wheel valve cap"], "estimatedPriceRange": {"max": 70, "min": 30}}, {"name": "Improper tire mounting leading to bead leak or unseated tire", "confidence": 15, "requiredParts": ["None (wheel labor)"], "estimatedPriceRange": {"max": 50, "min": 20}}, {"name": "Defective front left TPMS sensor providing false warning and not maintaining pressure reading", "confidence": 10, "requiredParts": ["Front left TPMS sensor", "Mounting hardware"], "estimatedPriceRange": {"max": 120, "min": 60}}, {"name": "Slow puncture in tread (e.g., hidden nail) not visible to the eye", "confidence": 5, "requiredParts": ["Tire patch kit or replacement tire"], "estimatedPriceRange": {"max": 150, "min": 50}}]	70	medium	f	{"Technical Reasoning: The front‑left tire was replaced only three days ago and now shows a steady loss of pressure that triggers the TPMS light briefly before it turns off. No puncture or side‑wall damage is visible, yet you feel vibration while driving – a classic sign of an under‑inflated front tire. The most common cause after a recent mount is a leaking or improperly seated valve stem (or valve core) that lets air escape slowly. An under‑inflated tire will also produce vibration because the tread isn’t contacting the road evenly.","Recommended Next Inspection: Safely jack up the front‑left wheel, remove the wheel, and inspect the valve stem and valve core. Apply soapy water around the stem and bead; watch for bubbles indicating a leak. Also check the tire bead for any unseated areas. Re‑inflate the tire to the manufacturer’s spec, reinstall the wheel, and verify the TPMS light stays off. If the valve stem is leaking, replace it and retest."}	bookGarage	2026-07-24 08:49:23.822651+05:30
b6050620-5516-4c7f-aed0-54ca2062240f	91f81d38-4efd-49cb-8db1-d6849c0e1150	[{"name": "Failed electric cooling fan motor (or fan control circuit)", "confidence": 70, "requiredParts": ["Radiator cooling fan motor", "Cooling fan relay (if needed)", "Electrical connector"], "estimatedPriceRange": {"max": 300, "min": 130}}, {"name": "Faulty cooling fan relay", "confidence": 15, "requiredParts": ["Cooling fan relay"], "estimatedPriceRange": {"max": 80, "min": 30}}, {"name": "Malfunctioning coolant temperature sensor", "confidence": 10, "requiredParts": ["Coolant temperature sensor"], "estimatedPriceRange": {"max": 120, "min": 50}}, {"name": "Stuck closed thermostat", "confidence": 5, "requiredParts": ["Thermostat"], "estimatedPriceRange": {"max": 150, "min": 80}}]	75	high	f	{"Technical Reasoning: The engine temperature spikes only on highway runs, the temperature warning light flashes intermittently, and the radiator fan never activates. On a 2018 Honda City the cooling fan is electric and should turn on automatically once the coolant reaches a preset temperature, regardless of vehicle speed. The absence of any fan operation points directly to a failure in the fan control circuit—most commonly a burned‑out fan motor or a dead fan relay/sensor that prevents the ECU from commanding the fan. No coolant leaks have been observed, so low coolant is less likely, and a stuck thermostat would still allow the fan to run once temperature is high, which is not happening. Thus the primary suspect is a failed cooling fan motor or its control circuit.","Recommended Next Inspection: Verify the fan motor voltage with a multimeter while the engine is hot (or simulate with the ignition on). Check the fan relay and related fuse (usually a 10‑15 A fuse) for continuity. If voltage is present at the relay but the motor does not spin, the motor is the culprit. If no voltage reaches the relay, inspect the coolant temperature sensor wiring and the relay itself. Also, quickly inspect coolant level (cold) to rule out low coolant as a secondary factor."}	bookGarage	2026-07-24 08:53:00.95003+05:30
8521c843-019a-4fa2-902c-dcc0def1e2eb	4f540546-bcb4-4295-9bff-ba3254e68f32	[{"name": "Leaking valve stem or valve core", "confidence": 70, "requiredParts": ["Valve stem", "Valve core tool"], "estimatedPriceRange": {"max": 30, "min": 10}}, {"name": "Bead leak at rim (corroded or damaged rim seal)", "confidence": 15, "requiredParts": ["Rim sealant", "Rim cleaning brush"], "estimatedPriceRange": {"max": 80, "min": 20}}, {"name": "Slow puncture (tiny nail or wall crack) not visible", "confidence": 10, "requiredParts": ["Tire patch kit", "Plug insertion tool"], "estimatedPriceRange": {"max": 70, "min": 30}}, {"name": "TPMS sensor malfunction (no warning yet)", "confidence": 5, "requiredParts": ["TPMS sensor", "Sensor installation tool"], "estimatedPriceRange": {"max": 150, "min": 70}}]	70	low	t	{"Technical Reasoning: The vehicle reports low tyre pressure across multiple wheels with no visible puncture, no recent impact, and no TPMS warning. This pattern points to a slow air loss rather than a sudden puncture. The most common sources of gradual pressure loss are a leaking valve stem/core or a seal leak at the bead/rim. Because the TPMS light is not illuminated, the sensor electronics are likely functional, making a valve‑stem leak the primary suspect. Temperature swings can also cause minor pressure changes, but the consistent low reading suggests an actual leak.","Recommended Next Inspection: 1. Visually inspect each valve stem for cracks, corrosion, or loose caps. 2. Apply soapy water around the valve stem and bead while the tyre is inflated; watch for bubbles indicating escaping air. 3. If a leak is detected at the valve, remove the valve core with a core tool and test for pressure loss. 4. If no valve leak is found, submerge the tyre (or use a tyre leak detection kit) to locate a bead or micro‑puncture. 5. Record which tyre(s) lose pressure and proceed with the appropriate repair."}	diy	2026-07-24 09:16:19.050169+05:30
383fc9c6-ba08-4a6a-a1cd-1f3ef746f69a	f3ac92fe-e788-45fe-b09f-4280f831c261	[{"name": "Underinflated tyre due to slow air leak", "confidence": 85, "requiredParts": ["tire sealant (optional)", "valve core kit (if needed)"], "estimatedPriceRange": {"max": 30, "min": 0}}, {"name": "Faulty TPMS sensor causing inaccurate pressure reading", "confidence": 50, "requiredParts": ["TPMS sensor"], "estimatedPriceRange": {"max": 120, "min": 50}}, {"name": "Valve stem leak or defective valve core", "confidence": 45, "requiredParts": ["valve core kit"], "estimatedPriceRange": {"max": 25, "min": 10}}]	80	low	t	{"Technical Reasoning: The vehicle reports low tyre pressure with no visible damage, no TPMS warning, and normal handling. This points to a simple under‑inflation condition, most often caused by a slow air loss through a tiny puncture, valve stem leak, or imperfect seal rather than a major mechanical fault. Since the TPMS light is off and the driver checked pressure recently, the air likely escaped after the last check, indicating a minor leak that can be resolved by re‑inflating and locating the leak.","Recommended Next Inspection: Perform a visual inspection of each tyre for embedded objects, check the valve stems for cracks, and apply a soapy‑water solution around the tread and valve to spot bubbling which indicates a leak. Listen for any hissing sounds while the tyre is inflated.","Step 1: Use a calibrated tyre pressure gauge to measure the pressure of all four tyres and compare to the Honda City’s recommended pressure (≈30‑35 psi).","Step 2: Inflate any tyre below the recommended pressure using an air compressor or a service‑station air pump to the correct pressure.","Step 3: Re‑check the pressure after 5‑10 minutes to confirm it holds. If it drops again within 24‑48 hours, the tyre likely has a slow leak and should be sealed or repaired.","Tools needed: Tyre pressure gauge, air compressor (or access to a gas‑station air pump), optional valve‑core tool, tyre sealant (if a slow leak is confirmed).","Estimated time: 15‑30 minutes total.","Safety precautions: Park the vehicle on a level surface, engage the parking brake, avoid over‑inflating the tyre, wear eye protection when using the compressor, and do not remove the wheel unless necessary.","Expected outcome: Tyres inflated to the correct pressure, restoring optimal handling. If pressure remains stable, the issue is resolved; otherwise, professional tyre repair may be required."}	diy	2026-07-24 10:40:37.43863+05:30
d354ddd1-64e5-40ed-b9be-da487af8a7e3	2b871bbc-1cca-4816-b9eb-40a9ee46975c	[{"name": "Tire puncture repair or replacement due to nail in tread", "confidence": 96, "requiredParts": ["Tire repair plug kit", "Replacement tire (if needed)", "Valve stem (if needed)"], "estimatedPriceRange": {"max": 150, "min": 15}}, {"name": "Rim damage (bent or cracked wheel) from impact", "confidence": 30, "requiredParts": ["Rim repair kit", "Rim sealant", "Replacement wheel"], "estimatedPriceRange": {"max": 150, "min": 50}}, {"name": "Valve stem leak or damage", "confidence": 20, "requiredParts": ["Valve stem", "Valve core tool"], "estimatedPriceRange": {"max": 25, "min": 10}}, {"name": "TPMS sensor malfunction", "confidence": 10, "requiredParts": ["TPMS sensor unit", "TPMS programming tool"], "estimatedPriceRange": {"max": 120, "min": 75}}]	95	low	t	{"Technical Reasoning: The flat was observed immediately after a nail punctured the tread, TPMS shows low pressure only on that wheel, and all other wheels maintain normal pressure. This pattern points to a localized puncture rather than a systemic leak, indicating the tire can likely be repaired if the puncture is in the tread and not the sidewall.","Recommended Next Inspection: Visually confirm the nail’s location, verify the puncture is within the tread area, and inspect the rim for any bends, cracks, or damage to the valve stem.","Gather required tools: car jack, lug wrench, wheel chocks, tire repair plug kit (e.g., SD Rapide), tire pressure gauge, and optionally a portable air compressor.","Secure the vehicle: Park on a flat surface, engage the parking brake, and place wheel chocks behind the opposite wheels.","Loosen the lug nuts on the affected wheel about a quarter turn while the vehicle is still on the ground.","Jack up the car and support it with jack stands, then fully remove the lug nuts and take off the wheel.","Locate the nail, mark the puncture spot, and use the plug kit to insert a plug according to the kit instructions. If the puncture is larger than ¼ in or on the sidewall, replace the tire instead.","Reinstall the wheel, hand‑tighten the lug nuts, lower the vehicle, then torque the lug nuts to the manufacturer specification (≈80 ft‑lb for a 2018 Honda City).","Inflate the tire to the recommended pressure (≈32 psi) and verify the TPMS indicator resets.","Clean up tools and dispose of the used plug. Estimated time: 45–60 minutes. Safety: ensure the vehicle is stable on jack stands, wear gloves, and do not over‑inflate the tire."}	diy	2026-07-24 10:48:46.930509+05:30
9c29fdb9-f380-47b4-b26c-cfb5b9635c7c	f8d8a336-b64e-4a5f-9e6a-5670dc6929ad	[{"name": "Burnt out left headlight bulb", "confidence": 70, "requiredParts": ["Headlight bulb (H4)"], "estimatedPriceRange": {"max": 30, "min": 15}}, {"name": "Blown fuse for left headlight circuit", "confidence": 15, "requiredParts": ["Headlight fuse (10A)"], "estimatedPriceRange": {"max": 10, "min": 5}}, {"name": "Faulty headlight relay", "confidence": 10, "requiredParts": ["Headlight relay"], "estimatedPriceRange": {"max": 40, "min": 20}}, {"name": "Damaged wiring or connector to left headlight", "confidence": 3, "requiredParts": ["Wiring repair kit or connector"], "estimatedPriceRange": {"max": 60, "min": 30}}, {"name": "Defective headlight switch", "confidence": 2, "requiredParts": ["Headlight switch assembly"], "estimatedPriceRange": {"max": 80, "min": 40}}]	78	low	t	{"Why this diagnosis?: After reviewing your description, the left headlight bulb is visibly burnt out, which is the most common cause for a single headlight failure. Although the switch seems unresponsive, the lack of any voltage drop or engine behavior change points away from an electrical system fault, making a simple bulb replacement the most probable fix.","Recommended Next Inspection: Verify the headlight fuse for the left side circuit (typically labeled H‑L or similar) in the fuse box; replace if blown before changing the bulb.","DIY Step 1: Disconnect the negative battery terminal to ensure safety.","DIY Step 2: Open the hood and locate the headlight assembly; remove the retaining clip or screws securing the bulb housing.","DIY Step 3: Carefully pull out the burnt‑out bulb, avoiding contact with the glass, and install the new bulb, aligning the tabs correctly.","DIY Step 4: Reinstall the retaining clip/screws, reconnect the battery, and test the headlight.","Estimated time: 20‑30 minutes. Required tools: Phillips screwdriver or appropriate socket, gloves, replacement bulb (H4 type for Honda City 2018). Safety precaution: Never touch the bulb glass with bare hands; use gloves to avoid oil residue that can shorten bulb life."}	diy	2026-07-24 11:07:18.159506+05:30
a82af134-1117-4c39-9d30-3d5f2b1b051a	86421b34-3f9f-4f31-9463-2c09988700cb	[{"name": "Faulty windshield wiper motor (gear/inner mechanism seized)", "confidence": 70, "requiredParts": ["Wiper motor assembly", "Mounting bolts (if not reusable)", "Wiper linkage bushings (optional)"], "estimatedPriceRange": {"max": 130, "min": 80}}, {"name": "Blown wiper fuse", "confidence": 20, "requiredParts": ["Wiper fuse (appropriate amperage)"], "estimatedPriceRange": {"max": 15, "min": 5}}, {"name": "Faulty wiper control stalk/switch", "confidence": 10, "requiredParts": ["Wiper control switch assembly"], "estimatedPriceRange": {"max": 70, "min": 30}}]	75	low	t	{"Why this diagnosis?: Based on the clicking sound from the motor when the lever is engaged, the blades not moving, and a loose feeling in the stalk, the most common cause is an internal failure of the wiper motor or its gear train. The motor is receiving power (clicking), but it cannot turn the linkage, which points to a stripped gear or seized motor. A blown fuse or faulty switch could also cause no movement, but the audible click indicates power is reaching the motor, making the motor the primary suspect.","Recommended Next Inspection: Verify the wiper fuse (Fxx) in the fuse box; if intact, remove the wiper motor cowl and inspect the motor gear for wear or seizure. Use a multimeter to check voltage at the motor connector while the wiper lever is engaged.","Step 1: Gather tools – fuse puller or needle‑nose pliers, multimeter, socket set (10 mm), screwdrivers, replacement wiper motor (if needed).","Step 2: Disconnect the battery negative terminal to prevent accidental short.","Step 3: Locate and inspect the wiper fuse; replace if blown. Reconnect battery.","Step 4: Remove the wiper cowl cover (typically 4–6 screws/clips) to access the motor.","Step 5: With the multimeter, probe the motor connector while the stalk is in the “low” position; you should see ~12 V. If voltage is present but the motor does not turn, the motor is faulty.","Step 6: If the motor is faulty, disconnect the wiring harness, remove mounting bolts, and replace with a new motor. Reinstall the cowl, reconnect the battery, and test the wipers.","Estimated time: 1.5–2 hours for an experienced DIYer.","Safety precautions: Disconnect battery, avoid contact with moving windshield, wear safety glasses."}	diy	2026-07-24 11:28:26.8024+05:30
688d13fd-0f33-4d43-9fc1-71780e4c9588	faaf0753-3fc5-423b-8c2b-7cdbd127029b	[{"name": "Blown windshield wiper fuse", "confidence": 70, "requiredParts": ["Fuse (appropriate amperage)"], "estimatedPriceRange": {"max": 10, "min": 5}}, {"name": "Faulty windshield wiper motor", "confidence": 20, "requiredParts": ["Wiper motor assembly"], "estimatedPriceRange": {"max": 250, "min": 150}}, {"name": "Defective wiper switch/relay", "confidence": 10, "requiredParts": ["Wiper switch assembly"], "estimatedPriceRange": {"max": 60, "min": 30}}]	70	low	t	{"Why this diagnosis?: The wiper switch clicks but the blades never move and you hear no motor noise. This pattern usually means power isn’t reaching the motor. The most common reason is a blown fuse in the wiper circuit, which cuts power completely and leaves the switch and indicator functional. Since you didn’t notice any other electrical issues when the switch is used, a localized fuse problem is most likely.","Recommended Next Inspection: Locate the vehicle’s fuse box (usually under the dashboard on the driver’s side or in the engine compartment) and find the windshield‑wiper fuse – refer to the fuse diagram on the cover. Visually inspect the fuse for a broken filament or use a multimeter to test continuity.","Replace Fuse: If the fuse is blown, replace it with a new fuse of the same amperage (typically 10 A for a 2018 Honda City). Use a fuse puller or needle‑nose pliers to remove the old fuse and snap the new one in place.","Test Operation: Turn the ignition on and operate the wiper switch. The wipers should now move normally. If they still do not work, the issue may be a faulty motor or switch, and a professional inspection is recommended."}	diy	2026-07-24 11:34:25.126925+05:30
01d2ecf1-5ffb-4947-a8a7-bc7cf7f56dd7	7b6ad5d3-3938-41c0-be47-320d6ea7f5e1	[{"name": "Infotainment system Bluetooth software/firmware mismatch causing connection failure", "confidence": 80, "requiredParts": [], "estimatedPriceRange": {"max": 120, "min": 0}}, {"name": "Faulty Bluetooth module hardware (radio/antenna)", "confidence": 55, "requiredParts": ["Bluetooth module"], "estimatedPriceRange": {"max": 300, "min": 150}}, {"name": "Corrupted Bluetooth pairing database", "confidence": 45, "requiredParts": [], "estimatedPriceRange": {"max": 0, "min": 0}}, {"name": "Low vehicle battery voltage affecting module operation", "confidence": 30, "requiredParts": [], "estimatedPriceRange": {"max": 50, "min": 0}}]	78	low	f	{"Why this diagnosis?: Based on the fact that the infotainment screen powers on, the car sees the phone in the Bluetooth list, but every device fails with a ‘Connection Failed’ message, and the issue started right after a recent firmware/OS update, the most likely cause is a software/firmware mismatch in the car’s Bluetooth module. The hardware appears functional (screen works, device is detected), so a reset or firmware re‑flash is the first thing to try.","Recommended Next Inspection: Verify the current infotainment firmware version and compare it to the latest Honda update; also check for any pending Bluetooth-specific patches.","DIY Step 1: Turn off the vehicle, open the driver’s door and wait 2 minutes to allow the system to fully power down.","DIY Step 2: Re‑start the car and, once the infotainment screen is on, go to Settings → System → Reset → “Reset Bluetooth/Phone Settings” (or similar). Confirm the reset and allow the system to reboot.","DIY Step 3: After reboot, navigate to Settings → Bluetooth, delete all previously paired devices, and perform a fresh pairing with the phone. Ensure the phone’s Bluetooth is set to “visible” and that no other devices are interfering.","DIY Step 4: If the connection still fails, check for an infotainment firmware update via Honda’s official website or through the dealer’s OTA service. Download the update (if available) onto a USB drive formatted FAT32, insert into the USB port, and follow the on‑screen prompts to install.","DIY Step 5: Once the update (if any) is applied, repeat the pairing process. If successful, the issue is resolved; if not, the problem may be hardware‑related and should be inspected by a professional."}	bookGarage	2026-07-24 12:21:34.033027+05:30
4d7a8c41-ef70-400b-9d8e-7d8d24cb84fe	7084dfd0-20b2-4fe6-8e12-e73bbe2c4fdf	[{"name": "Faulty oil pressure sensor (oil pressure switch)", "confidence": 70, "requiredParts": ["Oil pressure sensor"], "estimatedPriceRange": {"max": 80, "min": 50}}, {"name": "Clogged or excessively restrictive oil filter", "confidence": 20, "requiredParts": ["Oil filter"], "estimatedPriceRange": {"max": 40, "min": 20}}, {"name": "Worn or failing oil pump", "confidence": 10, "requiredParts": ["Oil pump"], "estimatedPriceRange": {"max": 500, "min": 300}}]	78	medium	f	{"Why this diagnosis?: Based on your description, the oil level is normal, there are no leaks, and the oil was changed recently. The oil pressure warning light can be triggered by a faulty oil‑pressure sensor (oil pressure switch) that is giving a false low‑pressure signal even though the engine’s oil system is likely fine. At 45,000 mi a pump or filter problem is less common, making the sensor the most probable culprit.","Recommended Next Inspection: Verify actual oil pressure with a mechanical gauge while the engine is running. If the gauge reads normal pressure, the sensor is the likely fault; if pressure is low, investigate the oil pump or filter."}	bookGarage	2026-07-24 12:25:04.747423+05:30
bb0c7432-a419-411a-8a5e-125dff6e6b30	f3c64393-4fef-4cd9-bc42-ba476cc8cae4	[{"name": "Faulty Bluetooth communication module within the infotainment head unit", "confidence": 70, "requiredParts": ["Honda City Bluetooth communication module (OEM)"], "estimatedPriceRange": {"max": 350, "min": 200}}, {"name": "Blown Bluetooth or infotainment fuse", "confidence": 20, "requiredParts": ["10 A fuse (Bluetooth/Infotainment)"], "estimatedPriceRange": {"max": 15, "min": 5}}, {"name": "Corrupted infotainment software/firmware affecting Bluetooth stack", "confidence": 10, "requiredParts": [], "estimatedPriceRange": {"max": 150, "min": 80}}]	78	low	t	{"Why this diagnosis?: Based on your description, the Bluetooth system never becomes discoverable, shows an explicit error message, and fails with every device you try. There are no other electrical symptoms and no recent software updates, which points to a problem isolated to the Bluetooth communication path—most commonly a faulty Bluetooth module or a simple fault like a blown fuse. The fact that the infotainment screen itself works fine (audio, display) makes a complete head‑unit failure unlikely, so the module or its power supply is the prime suspect.","Recommended Next Inspection: Verify the Bluetooth power fuse and perform a soft reset of the infotainment system before concluding the module is dead.","DIY Category: troubleshooting","1. Locate the vehicle’s fuse box (under the dashboard or in the engine compartment) and find the fuse labeled “Bluetooth” or “Infotainment” (typically a 10 A blade fuse). Visually inspect it and replace it if the filament is broken.","2. Perform a soft reset of the infotainment unit: with the ignition ON, press and hold the power/volume knob (or the dedicated reset button if equipped) for about 10 seconds until the screen restarts.","3. After the reset, go to Settings → Bluetooth, ensure Bluetooth is turned on and the system is set to be discoverable. Attempt to pair a phone again.","4. If pairing still fails, connect a diagnostic scan tool (or OBD‑II Bluetooth adapter) and read any infotainment fault codes related to the Bluetooth module (e.g., B000‑B099 range).","5. Expected outcome: The Bluetooth becomes visible and pairs successfully. If it still does not appear after a fresh fuse and reset, the internal Bluetooth communication module is likely defective and will need replacement."}	diy	2026-07-24 12:49:19.067625+05:30
795d03a5-6123-4994-9998-2bf47568609e	bb6c2c78-899b-444d-839a-1a0371bb8b2b	[{"name": "Blown wiper fuse or faulty wiper relay", "confidence": 78, "requiredParts": ["Wiper fuse (10 A)", "Wiper relay (if needed)"], "estimatedPriceRange": {"max": 20, "min": 5}}, {"name": "Failed wiper motor", "confidence": 45, "requiredParts": ["Wiper motor assembly"], "estimatedPriceRange": {"max": 200, "min": 150}}, {"name": "Defective wiper switch (multifunction stalk)", "confidence": 30, "requiredParts": ["Wiper switch assembly"], "estimatedPriceRange": {"max": 80, "min": 40}}, {"name": "Body Control Module (BCM) fault", "confidence": 20, "requiredParts": ["Body Control Module"], "estimatedPriceRange": {"max": 400, "min": 250}}]	78	low	t	{"Why this diagnosis?: Based on your description, the wiper motor makes no sound when you engage the switch, and you also notice several other electrical systems acting up. This pattern typically points to a loss of power in that circuit, most often caused by a blown fuse or a faulty relay that supplies power to the wiper motor and related components. Since no humming is heard, the motor itself is likely receiving no voltage, which is why checking the fuse/relay is the first step.","Recommended Next Inspection: Locate the vehicle’s fuse box (usually under the dashboard on the driver’s side or in the engine compartment), find the wiper fuse and the wiper relay, inspect the fuse for a broken filament and test the relay by swapping with an identical one, then try the wipers again.","DIY Category: troubleshooting","Step 1: Gather a fuse puller or a pair of needle‑nose pliers, a spare fuse of the same amperage (usually 10 A for the wiper circuit), and if needed, a matching relay from another circuit.","Step 2: Open the fuse box cover and refer to the diagram on the cover or the owner’s manual to identify the wiper fuse (often labeled “WIPER” or “WIPER MOTOR”).","Step 3: Remove the fuse and visually inspect the metal strip; if it’s broken or the fuse appears blackened, replace it with a new fuse of identical rating.","Step 4: If the fuse is intact, locate the wiper relay (usually next to the fuse). Remove it and install an identical relay from a non‑essential circuit (e.g., the rear defogger) to see if the wipers operate.","Step 5: Re‑assemble the fuse box, turn the ignition on, and test the wiper switch. If the wipers work, the problem was the fuse or relay. If they still do not work, further diagnosis (motor, switch, or BCM) should be done by a professional.","Estimated time: 15‑20 minutes.","Tools required: Fuse puller or needle‑nose pliers, spare fuse (10 A), optional spare relay."}	diy	2026-07-24 13:37:13.601806+05:30
98c7b211-dc6b-4386-89f3-b9fccf80e21d	4137b808-005d-4e0a-b66d-f92573de66f9	[{"name": "Seat belt retractor latch mechanism jam (possible pretensioner lock)", "confidence": 70, "requiredParts": ["Seat belt retractor assembly", "Seat belt latch plate"], "estimatedPriceRange": {"max": 250, "min": 150}}, {"name": "Deployed pretensioner permanently locked the belt system", "confidence": 20, "requiredParts": ["Seat belt pretensioner unit", "Seat belt retractor assembly"], "estimatedPriceRange": {"max": 220, "min": 120}}, {"name": "Buckle latch button internal failure", "confidence": 10, "requiredParts": ["Seat belt buckle assembly"], "estimatedPriceRange": {"max": 80, "min": 30}}]	70	high	f	{"Why this diagnosis?: Based on your description that the belt won't extend, the latch button depresses but the belt stays latched, it retracts slowly, and there was a recent impact, the most common cause is a jammed retractor latch mechanism or a deployed pretensioner that has locked the retractor. The lock pin remains engaged, preventing release and causing the motor to work against a seized spool, which explains the slow retraction.","Recommended Next Inspection: Have a qualified technician remove the seat belt assembly and inspect the retractor latch, pretensioner fuse, and the belt spool for jam or lock engagement. Test the latch release circuit with a multimeter and check for any fault codes in the SRS module.","DIY Category: none"}	bookGarage	2026-07-24 16:45:19.360543+05:30
61dde241-c974-43fd-a591-8f21c4e6b1e4	ee90eb82-a237-419f-a438-0f5a1839df8f	[{"name": "Blown horn fuse", "confidence": 65, "requiredParts": ["Horn fuse (30 A)"], "estimatedPriceRange": {"max": 10, "min": 5}}, {"name": "Faulty horn switch (clock‑spring)", "confidence": 30, "requiredParts": ["Horn switch/clock‑spring assembly"], "estimatedPriceRange": {"max": 80, "min": 40}}, {"name": "Wiring short or corroded ground", "confidence": 5, "requiredParts": ["Wire harness repair kit"], "estimatedPriceRange": {"max": 100, "min": 20}}]	65	low	t	{"Why this diagnosis?: The horn produces sound when you apply battery voltage directly, which proves the horn itself is functional. The connector under the hood is clean and tight, and there is no separate relay, so the power must travel through the horn fuse and the steering‑wheel horn switch (clock‑spring). Because nothing happens when you press the button (no click, no sound) the most common failure points are a blown fuse or a failed horn switch. Since the fuse has not been inspected yet, it is the simplest and most likely cause, followed by the switch.","Recommended Next Inspection: Locate the horn fuse in the interior fuse box (usually a 30 A fuse). Visually inspect it for a broken filament; if uncertain, pull it out with a fuse puller and test with a multimeter. Replace with a new fuse of the same rating and retest the horn. If the fuse is good, the next step is to inspect the steering‑wheel horn button/clock‑spring for continuity; this may require removal of the steering wheel cover and is best done by a professional if you are not comfortable.","DIY Category: repair","Tools needed: Fuse puller or needle‑nose pliers, replacement 30 A horn fuse, multimeter (optional)","Expected outcome: After replacing a blown fuse the horn should click and sound normally; if the fuse is fine, the horn will still not work, indicating the switch/clock‑spring needs replacement."}	diy	2026-07-24 23:05:51.802846+05:30
310a4c1a-26b7-44c4-814a-9f71e7ad831a	68533421-8fbf-40d9-94ea-3deca8c334a5	[{"name": "Warped front brake rotors", "confidence": 80, "requiredParts": ["front brake rotors", "brake hardware kit"], "estimatedPriceRange": {"max": 420, "min": 300}}, {"name": "Glazed brake pads causing squeal", "confidence": 55, "requiredParts": ["brake pads"], "estimatedPriceRange": {"max": 180, "min": 100}}, {"name": "Sticking brake caliper", "confidence": 40, "requiredParts": ["brake caliper", "brake fluid"], "estimatedPriceRange": {"max": 250, "min": 150}}]	78	medium	f	{"Why this diagnosis?: Based on your description the screeching only occurs under hard braking, never stops, and is accompanied by a pulsation in the steering wheel. Continuous high‑frequency noise under heavy brake application together with steering vibration is classic for a warped front brake rotor transmitting uneven forces through the caliper to the wheel hub. The lack of visible pad wear points to the rotors rather than the pads being the primary source.","Recommended Next Inspection: Visually inspect the front brake rotors for uneven wear, heat discoloration, or scoring, and use a dial‑indicator to check rotor run‑out (acceptable <0.002 in). Also examine the pad surface for glazing and the caliper mounting bolts for proper torque. If run‑out exceeds spec, the rotors need resurfacing or replacement.","DIY Category: none"}	bookGarage	2026-07-25 09:51:26.175677+05:30
f98e63c0-368b-44a9-ba42-f67efd06d439	514204a1-e56b-4aa5-9050-250b57c3f3fc	[{"name": "Damaged tyre sidewall (crack/bulge) requiring replacement", "confidence": 88, "requiredParts": ["Replacement tyre (225/45R17 or appropriate size)", "Valve stem (if needed)"], "estimatedPriceRange": {"max": 130, "min": 80}}, {"name": "Leaking valve stem", "confidence": 65, "requiredParts": ["Valve stem replacement kit"], "estimatedPriceRange": {"max": 30, "min": 10}}, {"name": "Bead leak (seal issue at wheel rim)", "confidence": 50, "requiredParts": ["Rim sealant or new rim seal"], "estimatedPriceRange": {"max": 50, "min": 20}}]	88	medium	f	{"Why this diagnosis?: Based on your description of a visible crack or sidewall bulge, the low tyre pressure is most likely caused by damage to the tyre structure itself, which allows air to escape. You also noted the pressure was low during a routine check and you haven't measured it yet, which aligns with a slow leak from a compromised sidewall.","Recommended Next Inspection: Visually inspect the tyre for cuts, bulges, or exposed cords, and perform a pressure test with a handheld gauge. If the bulge remains or pressure cannot be held, the tyre should be replaced.","DIY Category: none"}	bookGarage	2026-07-25 13:40:30.889671+05:30
8cc15a98-d069-44d2-a707-1aa938b74416	bd14eee6-3d23-4f62-9074-968d09b1a935	[{"name": "Worn brake pads causing pedal vibration", "confidence": 55, "requiredParts": ["Front brake pads", "Rear brake pads"], "estimatedPriceRange": {"max": 100, "min": 50}}, {"name": "Slightly warped brake rotors", "confidence": 30, "requiredParts": ["Front brake rotor", "Rear brake rotor"], "estimatedPriceRange": {"max": 250, "min": 120}}, {"name": "Sticking brake caliper slide pins", "confidence": 15, "requiredParts": ["Brake caliper slide pins", "Brake caliper lubricant"], "estimatedPriceRange": {"max": 150, "min": 80}}]	70	medium	f	{"Why this diagnosis?: Based on your description that the vibration is felt in the brake pedal when you release it, combined with the fact that the pads have never been replaced at 38,000 miles, the most common cause is worn brake pads that are unevenly contacting the rotor. This can create a pulsating feeling in the pedal during the release phase. While warped rotors can also cause pedal vibration, they usually produce a noticeable pulsation through the steering wheel while braking, which you did not report. A sticking caliper would more likely cause the pedal to stay low rather than vibrate. Therefore, worn pads are the most probable culprit.","Recommended Next Inspection: Remove the front wheels and visually inspect the brake pad thickness. Measure the remaining friction material; if it is less than 3 mm or the pads are unevenly worn, they should be replaced. While the wheels are off, also spin the rotors by hand to feel for any wobble and check for rust or scoring.","DIY Category: troubleshooting","Step 1: Raise the vehicle safely with a jack, place jack stands, and remove the front wheels. (Time: ~15 min, Tools: jack, jack stands, lug wrench).","Step 2: Use a brake pad thickness gauge or a ruler to measure the remaining pad material on each pad. Expected outcome: Pad thickness ≥3 mm and uniform wear indicates pads are OK; <3 mm or uneven wear means replace pads.","Step 3: Rotate the rotor by hand and feel for any lateral runout or rough spots. If you feel a wobble or see deep scoring, the rotor may be warped and should be machined or replaced.","Step 4: Reinstall wheels, torque lug nuts to spec (≈ 76 Nm), lower vehicle, and test the brakes. If vibration persists, schedule professional brake service."}	bookGarage	2026-07-25 19:11:43.855356+05:30
ede33400-635a-4338-97ae-b1c3c527f252	fa04ed93-e8e0-4f29-b8c9-aa967e9a9ef0	[{"name": "Faulty or leaking valve stem causing slow air loss", "confidence": 70, "requiredParts": ["Valve stem", "Valve core tool"], "estimatedPriceRange": {"max": 40, "min": 15}}, {"name": "Embedded nail or small tread puncture", "confidence": 20, "requiredParts": ["Tire plug kit", "Tire sealant"], "estimatedPriceRange": {"max": 80, "min": 30}}, {"name": "Temperature‑induced pressure drop", "confidence": 10, "requiredParts": [], "estimatedPriceRange": {"max": 0, "min": 0}}]	78	low	t	{"Why this diagnosis?: Based on your description, the tyre pressure is low without any visible cuts, bulges, or recent exposure to sharp objects. The most common reason for such a situation is a slow leak, often caused by a deteriorated valve stem or a tiny puncture that isn’t obvious to the eye. Because the car lacks a TPMS indicator, you haven’t been alerted until you checked manually, which aligns with a gradual loss of air.","Recommended Next Inspection: 1) Use a reliable handheld pressure gauge to measure each tyre’s PSI and note which is low. 2) Apply a soap‑water solution to the valve stem, tread, and sidewalls; watch for bubbles indicating escaping air. 3) Listen for a faint hissing sound near the valve. 4) If a leak is found, note its location.","DIY Category: troubleshooting","Tools Needed: Handheld tire pressure gauge, soap and water (or a commercial leak detector), a small brush, a flashlight.","Estimated Time: 15‑30 minutes.","Expected Outcome: Identify whether the loss is from the valve stem, a tiny puncture, or simply temperature‑related drop. If the leak is at the valve stem, you can replace the stem yourself or have a shop do it. If it’s a puncture, a plug/patch can be applied, otherwise you’ll need a professional tyre service."}	diy	2026-07-25 13:41:15.953037+05:30
99b32ce2-a015-47ef-aa96-a326f32c1381	522af5cc-9292-444e-8ec4-d111e9c314f3	[{"name": "Worn or loose serpentine/accessory drive belt", "confidence": 78, "requiredParts": ["Serpentine belt", "Belt tensioner (if needed)"], "estimatedPriceRange": {"max": 120, "min": 30}}, {"name": "Failing belt tensioner pulley or idler", "confidence": 55, "requiredParts": ["Belt tensioner", "Pulley bearing"], "estimatedPriceRange": {"max": 130, "min": 50}}, {"name": "Alternator bearing wear causing squeal", "confidence": 30, "requiredParts": ["Alternator"], "estimatedPriceRange": {"max": 300, "min": 150}}]	78	low	t	{"Why this diagnosis?: Based on your description that the squealing occurs only during cold starts, is a high‑pitched squeal, and there are no warning lights or performance loss, the most common cause is a worn or loose serpentine (accessory) belt or its tensioner. When the engine is cold the belt is less pliable and a marginally loose belt will slip, producing a squeal that often disappears as the engine warms up and the belt expands. At 45,000 mi a belt can start to show glazing, cracking, or stretch, especially if the tensioner is beginning to lose preload.","Recommended Next Inspection: Visually inspect the serpentine/accessory drive belt for cracks, glazing, or missing ribs. Check belt tension by pressing on the longest span – it should have about 1‑1.5 in of deflection. Spin the belt tensioner and pulleys by hand (engine off) to feel for roughness or wobble. Use a flashlight and, if available, a belt‑tension gauge to verify proper tension.","DIY Category: troubleshooting","Inspection Time Estimate: ~15 minutes","Tools Needed: Flashlight, clean rag, optional pry bar or belt‑tension gauge","Expected Outcome: If the belt shows wear, cracks, or is loose, replace the belt (and possibly the tensioner). If the belt appears in good condition, the squeal may be coming from another component such as the alternator bearing, which would then require further diagnosis."}	diy	2026-07-25 15:58:27.162452+05:30
0a73b4d9-ca26-44b7-a64d-3386b829e9e3	d40ee76a-081a-496d-95ff-faeea8488ea8	[{"name": "Clogged fuel filter", "confidence": 68, "requiredParts": ["Fuel filter"], "estimatedPriceRange": {"max": 70, "min": 30}}, {"name": "Faulty coolant temperature sensor (ECT)", "confidence": 15, "requiredParts": ["Coolant temperature sensor"], "estimatedPriceRange": {"max": 120, "min": 50}}, {"name": "Throttle body carbon buildup", "confidence": 10, "requiredParts": ["Throttle body cleaning kit"], "estimatedPriceRange": {"max": 150, "min": 80}}, {"name": "Worn spark plugs", "confidence": 7, "requiredParts": ["Spark plugs"], "estimatedPriceRange": {"max": 50, "min": 20}}]	68	low	t	{"Why this diagnosis?: Based on your description, the vehicle only lacks power when the engine is cold, the revs drop under acceleration, and there are no unusual noises. This pattern points to a restriction in fuel flow that becomes most evident before the engine reaches operating temperature. At cold temperatures the fuel pump’s output is slightly lower and a partially clogged fuel filter can’t keep up, causing the engine to stumble and lose speed. The fuel gauge reading low reinforces that the fuel system is being stressed.","Recommended Next Inspection: Check fuel pressure at the rail with a gauge while the engine is cold and compare to the spec (~40‑60 psi). Then inspect the fuel filter for debris or replace it as a precaution.","DIY Category: repair","Step 1: Relieve fuel system pressure by removing the fuel pump relay or opening the fuel filler cap and running the engine until it stalls.","Step 2: Locate the fuel filter (under the engine bay, inline with the fuel line). Place a container to catch any fuel.","Step 3: Use the appropriate wrenches to detach the filter, noting the flow direction arrow.","Step 4: Install a new fuel filter, re‑tighten fittings, reinstall the relay, and prime the system by turning the ignition on for a few seconds.","Step 5: Start the engine, let it reach normal temperature, and verify that acceleration is smooth and revs no longer drop."}	diy	2026-07-25 16:29:51.461207+05:30
9a3c02f9-552e-4ef4-bcc7-f3cc52cadec4	45226b91-59ce-4554-ba4e-eb98dd2e8ddc	[{"name": "Warped front brake rotors", "confidence": 78, "requiredParts": ["Front brake rotors (2)"], "estimatedPriceRange": {"max": 500, "min": 200}}, {"name": "Sticking front brake caliper", "confidence": 12, "requiredParts": ["Brake caliper rebuild kit or replacement caliper"], "estimatedPriceRange": {"max": 300, "min": 100}}, {"name": "Uneven or excessively worn front brake pads", "confidence": 7, "requiredParts": ["Front brake pads (set)"], "estimatedPriceRange": {"max": 150, "min": 50}}]	78	medium	f	{"Why this diagnosis?: Based on your description—a vibration felt through the steering wheel whenever you apply the brakes, at any speed, with no grinding noise or ABS pulsation—the most common culprit is a warped front brake rotor. Warped rotors create an uneven surface that makes the pads grab inconsistently, sending a vibration up through the steering column. The lack of recent brake service and the fact the symptom appears regardless of speed further points to rotor condition rather than pads or ABS faults.","Recommended Next Inspection: Perform a front‑rotor visual and manual spin check. Lift the front of the Swift, remove the front wheels, and look for discoloration, scoring, or uneven wear on the rotors. Spin each rotor by hand; feel for any wobble or “run‑out.” If you have a dial‑indicator, measure rotor run‑out—values above ~0.002 in (0.05 mm) indicate warpage.","DIY Category: troubleshooting","Step 1: Park on level ground, engage the parking brake, and loosen the front lug nuts.","Step 2: Jack up the front axle, support with jack stands, and remove the front wheels.","Step 3: Visually inspect each rotor for rust spots, hot spots, or uneven wear patterns.","Step 4: Spin the rotor by hand; listen for thumping and feel for lateral wobble.","Step 5 (optional): Attach a dial‑indicator to the hub and record run‑out while rotating the rotor slowly.","Step 6: Compare findings to the criteria above. If run‑out exceeds 0.002 in or you feel a pronounced wobble, the rotor is likely warped and should be machined or replaced.","Estimated time: 30‑45 minutes; Tools: jack, jack stands, lug wrench, (optional) dial‑indicator; Expected outcome: Confirmation whether rotors are within spec or need service."}	bookGarage	2026-07-25 17:04:37.740308+05:30
f1812eb3-f2d4-4330-a4a4-d20884d39af8	a76e61c7-e663-42a0-97d0-05ad56e9f2c9	[{"name": "Dead or severely discharged battery", "confidence": 78, "requiredParts": ["12 V battery (appropriate for 2020 Maruti Suzuki Swift)"], "estimatedPriceRange": {"max": 200, "min": 120}}, {"name": "Corroded or loose battery terminals", "confidence": 60, "requiredParts": ["Battery terminal connectors", "Terminal cleaning spray or brush"], "estimatedPriceRange": {"max": 30, "min": 10}}, {"name": "Failed starter relay or main fuse", "confidence": 45, "requiredParts": ["Starter relay", "Main fuse (appropriate amperage)"], "estimatedPriceRange": {"max": 30, "min": 10}}, {"name": "Faulty ignition switch", "confidence": 30, "requiredParts": ["Ignition switch assembly"], "estimatedPriceRange": {"max": 150, "min": 50}}]	85	low	f	{"Why this diagnosis?: Based on your description the vehicle shows absolutely no electrical activity when you attempt to start – no dashboard illumination, no starter engagement, and no warning lights. This pattern points to a loss of power at the primary source, most commonly a dead or severely discharged battery or a loss of connection to it. While you mentioned no recent battery events, batteries can fail silently after a few years of service, and a completely dead battery will prevent any lights or starter motor from operating.","Recommended Next Inspection: Verify the battery voltage and inspect the battery terminal connections for corrosion or looseness. Use a multimeter to measure voltage across the battery terminals; a healthy 12 V system should read around 12.6 V with the engine off. If the reading is well below 12 V, the battery is likely discharged or failed. Also, visually check the terminal clamps – any white/green crust or loose bolts should be cleaned and tightened. Additionally, locate the main fuse/relay for the starter circuit and ensure it is intact.","DIY Category: troubleshooting","Step 1: Open the hood and locate the battery. Set a multimeter to DC voltage, place the red probe on the positive (+) terminal and the black probe on the negative (–) terminal. Record the voltage reading.","Step 2: If voltage is below 12.0 V, attempt to jump‑start the vehicle with a known good battery or charger. If the car starts, the battery is the culprit and will need replacement.","Step 3: Inspect battery terminals for corrosion or looseness. If corrosion is present, disconnect the terminals (negative first), clean with a battery terminal cleaner or a wire brush, and re‑tighten the clamps firmly.","Step 4: Locate the starter relay and main fuse (refer to the vehicle’s fuse box diagram). Pull the relay/fuse and reseat or replace if visibly damaged."}	bookGarage	2026-07-25 19:32:22.566178+05:30
4f7a63a2-20e5-4af5-b250-3d464300a7bd	42d39b98-2c0a-4b69-9086-c1c296f03849	[{"name": "Faulty AC compressor clutch relay or blown fuse preventing compressor engagement", "confidence": 60, "requiredParts": ["AC relay", "AC fuse"], "estimatedPriceRange": {"max": 80, "min": 20}}, {"name": "Low refrigerant level triggering low‑pressure safety switch", "confidence": 25, "requiredParts": ["R‑1234yf refrigerant", "recharge kit"], "estimatedPriceRange": {"max": 200, "min": 120}}, {"name": "Failed compressor clutch (mechanical/electrical)", "confidence": 15, "requiredParts": ["compressor clutch assembly"], "estimatedPriceRange": {"max": 800, "min": 400}}, {"name": "Faulty low‑pressure sensor (switch)", "confidence": 5, "requiredParts": ["low pressure switch"], "estimatedPriceRange": {"max": 250, "min": 150}}]	65	low	t	{"Why this diagnosis?: Based on your description the AC compressor clutch never clicks when you turn the AC on, yet the blower still moves air. That pattern usually means the compressor isn’t being powered at all, which is most often caused by an electrical fault such as a blown fuse or a bad AC relay. The system also has a low‑pressure safety switch that will keep the clutch disengaged if refrigerant pressure is too low, so we also consider a low‑charge condition. Mechanical failure of the clutch itself or a faulty pressure sensor are less common but still possible, especially if the electrical checks turn out normal.","Recommended Next Inspection: 1. Locate the AC fuse and relay in the vehicle’s fuse box (under the dash and in the engine compartment). Pull the fuse and inspect it for a broken filament; swap the relay with an identical one from another circuit to see if the clutch engages. 2. If the fuse/relay are good, connect an AC manifold gauge set to the service ports and read the low‑side pressure with the engine running and AC on. A pressure below ~30 psi indicates low refrigerant. 3. After confirming proper fuse/relay and adequate pressure, observe the compressor clutch with the engine revved to ~1500 rpm; if it still does not click, the clutch itself is likely failed and needs professional replacement.","DIY Category: troubleshooting","Step 1: Gather a fuse/relay diagram for the 2023 Kia Seltos, a spare AC relay (or any identical relay), a multimeter, and an AC gauge set (optional for refrigerant check). Time required ~30 min."}	diy	2026-07-25 19:33:39.738617+05:30
f77fecdb-0f72-4fc4-9020-b3291f34c74c	1889d742-7393-4e6e-807e-78dc9aa67eac	[{"name": "Faulty AC compressor clutch relay or blown AC fuse preventing compressor engagement", "confidence": 55, "requiredParts": ["AC clutch relay", "AC fuse"], "estimatedPriceRange": {"max": 45, "min": 20}}, {"name": "Low refrigerant level causing low‑pressure safety switch to inhibit compressor", "confidence": 30, "requiredParts": ["R134a refrigerant", "Low‑pressure switch (if needed)"], "estimatedPriceRange": {"max": 80, "min": 50}}, {"name": "Defective AC low‑pressure sensor sending false low‑pressure signal", "confidence": 10, "requiredParts": ["AC low‑pressure sensor"], "estimatedPriceRange": {"max": 70, "min": 30}}, {"name": "Failed AC compressor clutch coil (mechanical/electrical)", "confidence": 5, "requiredParts": ["AC compressor assembly"], "estimatedPriceRange": {"max": 800, "min": 500}}]	70	low	t	{"Why this diagnosis?: Based on your description, the AC compressor never engages when you turn the AC on, yet there are no warning lights, smells, or obvious refrigerant loss. The most common reason for a completely non‑engaging compressor in a modern Kia is that the control circuit isn’t allowing the clutch to receive power—typically a faulty AC clutch relay or a blown fuse. This explains why nothing happens at any speed and why the system shows no error codes. Other possibilities (low refrigerant, pressure sensor failure, or a bad clutch coil) would usually still allow the clutch to try to engage or would trigger a warning light, which you don’t have.","Recommended Next Inspection: Check the AC clutch relay and associated fuse in the interior fuse box. Verify the relay clicks when the AC is turned on and test the fuse for continuity. If the relay is suspect, swap it with a known good one or replace it. Also inspect the AC low‑pressure switch wiring while you’re there as a secondary check.","DIY Category: troubleshooting","1. Locate the AC clutch relay (usually labeled “AC_CLUTCH” or “A/C Relay”) in the interior fuse box per the owner’s manual.\n2. Remove the relay and listen for a click when the AC is switched on; if no click, the relay is not energizing.\n3. Using a multimeter, check the relay’s coil resistance (typically 70‑120 Ω). Replace if out of spec.\n4. Pull the fuse for the AC circuit (often a 10 A or 15 A blade fuse) and test continuity; replace if blown.\n5. Reinstall relay and fuse, then turn the AC on while the vehicle is moving to see if the compressor clutch engages.\nTime: ~15‑20 minutes\nTools: Fuse puller, multimeter, replacement AC clutch relay (≈$15‑$30) or fuse (≈$5).\nExpected outcome: The AC compressor clutch should spin and cold air should be produced when the AC is activated."}	diy	2026-07-25 22:52:38.481473+05:30
1dbba38e-217f-40a1-b3b2-d84da776b599	aa9827a5-8395-43ee-8882-4a025ccb1294	[{"name": "Low refrigerant charge causing pressure‑switch lockout of the AC compressor", "confidence": 55, "requiredParts": ["R‑1234yf refrigerant (≈ 1‑2 kg)", "AC service gauge set (if not already owned)"], "estimatedPriceRange": {"max": 200, "min": 120}}, {"name": "Faulty AC clutch relay or blown AC fuse", "confidence": 30, "requiredParts": ["AC clutch relay (OEM)", "AC fuse (if needed)"], "estimatedPriceRange": {"max": 35, "min": 10}}, {"name": "Failed AC compressor clutch coil or internal compressor failure", "confidence": 15, "requiredParts": ["AC compressor assembly (including clutch)"], "estimatedPriceRange": {"max": 500, "min": 300}}]	55	low	t	{"Why this diagnosis?: Based on your description the blower is working (strong airflow) but the compressor never engages (no click) and no warning lights appear. In modern Kia AC systems the compressor clutch is disabled by a pressure‑switch when refrigerant pressure is too low. That is the most common reason the clutch stays silent while the rest of the HVAC operates normally. Since you don’t see any obvious leaks, a gradual loss of charge or an internal leak is still plausible, so a low refrigerant condition is the leading hypothesis.","Recommended Next Inspection: 1. Locate the vehicle’s fuse/relay box (see the owner’s manual). 2. Identify the AC fuse (usually labeled “A/C” or “AC COMPR”) and the AC clutch relay. 3. Visually inspect the fuse for a blown filament and replace it if necessary (≈ $5‑10). 4. Swap the AC clutch relay with an identical relay from another circuit to see if the compressor engages; if the AC clicks on, the relay is faulty. 5. If fuses and relay are good, connect an AC service gauge to the low‑side port and read the pressure. Low pressure confirms a refrigerant deficit and will require a recharge (or leak repair).","DIY Category: troubleshooting","Step 1: Remove the fuse panel cover, pull the AC fuse with needle‑nose pliers, inspect the metal strip; replace with a new fuse of the same amperage. Time ≈ 10 min. Tools: fuse puller or pliers. Expected outcome: If the fuse was blown, the clutch should click when AC is turned on.","Step 2: Locate the AC clutch relay (usually a 5‑pin yellow relay). Remove it and insert a known good relay of the same type. Turn the AC on; listen for the clutch click. Time ≈ 5 min. Tools: relay puller or small screwdriver. Expected outcome: If the relay was bad, the clutch will engage and you’ll feel cold air.","Step 3: If the clutch still does not engage, attach an AC manifold gauge set to the low‑side service port and read the pressure. Low pressure (< 30 psi when AC is on) indicates insufficient refrigerant. Time ≈ 15 min. Tools: AC gauge set, safety glasses. Expected outcome: Confirmation of low refrigerant, which then requires professional recharge or leak repair."}	diy	2026-07-26 11:20:09.883185+05:30
bc7218f2-b126-40a8-90c0-2769a72d9744	ac7484a1-35fb-4458-841f-da897c2841a7	[{"name": "AC compressor clutch failure (clutch not engaging)", "confidence": 68, "requiredParts": ["AC compressor clutch assembly", "AC compressor oil"], "estimatedPriceRange": {"max": 900, "min": 600}}, {"name": "Insufficient refrigerant charge", "confidence": 22, "requiredParts": ["R-1234yf refrigerant", "AC system recharge kit"], "estimatedPriceRange": {"max": 250, "min": 150}}, {"name": "AC pressure switch or sensor malfunction", "confidence": 10, "requiredParts": ["AC pressure switch"], "estimatedPriceRange": {"max": 350, "min": 200}}]	68	low	t	{"Why this diagnosis?: Based on your answers, the AC vents only blow warm air, there is no audible click from the compressor clutch, and no dashboard warnings. The most common reason for a missing clutch click is that the clutch itself is electrically or mechanically failed, preventing the compressor from ever turning. A failed clutch will produce exactly the symptoms you’re seeing – warm air with no noise and no warning lights. Low refrigerant can also stop the clutch from engaging, but that usually follows a leak and often shows a pressure‑switch warning; you reported none. Therefore the primary suspect is a faulty AC compressor clutch.","Recommended Next Inspection: 1. Locate the AC fuse (refer to the owner’s manual) and verify it’s intact. 2. With the engine running and AC set to max, use a multimeter to check for 12 V at the compressor clutch coil connector. No voltage indicates an electrical fault; voltage with no click points to a mechanical clutch failure. 3. Connect an AC manifold gauge set to the low‑ and high‑side service ports and read the pressures. Pressures near zero confirm a refrigerant shortage, while normal pressures with no clutch engagement confirm clutch failure. 4. Visually inspect the clutch coil and surrounding wiring for corrosion or damage.","DIY Category: troubleshooting","Step 1: Check AC fuse – replace if blown (no special tools, ~5 min).","Step 2: Measure clutch coil voltage with a multimeter – expect 12 V when AC is ON; if absent, check wiring or relay (~10 min).","Step 3: Read system pressures with a manifold gauge set – low pressure suggests low refrigerant (requires professional recharge) (~15 min)."}	diy	2026-07-26 11:29:18.346631+05:30
e53b0ab7-e9d5-45ef-b186-731a57991e5f	ebc9919b-3f7c-4289-9f06-cc4b226a7d3c	[{"name": "Warped front brake rotors", "confidence": 78, "requiredParts": ["Front brake rotors", "Brake hardware (shims/ clips)"], "estimatedPriceRange": {"max": 800, "min": 500}}, {"name": "Stuck or seized front brake caliper slide pins", "confidence": 55, "requiredParts": ["Brake caliper slide pins", "Caliper brackets"], "estimatedPriceRange": {"max": 400, "min": 200}}, {"name": "Loose brake hardware (shims, anti‑rattle clips)", "confidence": 45, "requiredParts": ["Brake pad shims", "Anti‑rattle clips"], "estimatedPriceRange": {"max": 200, "min": 100}}]	78	medium	f	{"Why this diagnosis?: Based on your description—vibration felt only in the brake pedal at specific speeds, accompanied by a rattling sound, and no obvious pad or rotor wear—the most common cause is a slight warp or run‑out of the front brake rotors. A warped rotor will transmit uneven forces to the pads, creating a pulsation that you feel through the pedal, especially when braking at certain speeds. The rattling suggests that the rotor may be slightly out of true or that the hardware (shims, clips) is loose, which often accompanies rotor warpage. Since the pads appear normal and there’s been no recent tire work, other sources like tire imbalance or wheel bearings are less likely.","Recommended Next Inspection: Have a qualified technician measure the front rotor run‑out with a dial‑indicator and inspect the rotor surface for uneven wear or scoring. They should also check that the caliper slide pins move freely and that all brake hardware (shims, anti‑rattle clips) is secure. If run‑out exceeds manufacturer limits (typically >0.001‑0.002 in), the rotors should be machined or replaced.","DIY Category: none"}	bookGarage	2026-07-26 12:32:49.387902+05:30
9aae3539-7949-425b-a5d4-e10db4f81f0e	f668a50d-68b4-4b8f-8a70-a61dc614d53a	[{"name": "Warped front brake rotors (rotor run‑out)", "confidence": 78, "requiredParts": ["Front brake rotors"], "estimatedPriceRange": {"max": 500, "min": 300}}, {"name": "Sticking front brake caliper", "confidence": 12, "requiredParts": ["Front brake caliper piston seal or caliper rebuild kit"], "estimatedPriceRange": {"max": 400, "min": 200}}, {"name": "Uneven brake pad material or pad transfer", "confidence": 10, "requiredParts": ["Brake pads"], "estimatedPriceRange": {"max": 150, "min": 50}}]	78	medium	f	{"Why this diagnosis?: Based on your description that the vibration is felt only through the brake pedal at low speeds, occurs after a recent pad replacement, and lessens after a few stops when the rotors warm up, the most common cause is a warped or unevenly worn brake rotor. Cold rotors that are slightly out‑of‑true will transmit a pulsating force to the pedal, which often smooths out as heat expands the metal. The absence of noise and the fact the steering wheel isn’t affected further points to rotor run‑out rather than a caliper or ABS issue.","Recommended Next Inspection: 1. Safely lift and support the front wheels. 2. Remove the wheel and inspect each rotor for visible scoring, discoloration, or uneven thickness. 3. If a dial‑indicator is available, measure rotor run‑out; values over 0.002‑0.003 in indicate warp. 4. Check the rotor thickness against the manufacturer’s minimum spec. 5. Also visually inspect the caliper pins and pistons for sticking, but focus on rotor condition.","DIY Category: troubleshooting"}	bookGarage	2026-07-26 12:33:27.147456+05:30
04c97bf5-772d-4da2-b76c-03f5e6ce7e0b	5837a54f-be54-413f-8ab0-b67342747f75	[{"name": "Slow air leak in right tyre (possible micro puncture or valve stem leak)", "confidence": 70, "requiredParts": ["Tire repair sealant", "Valve stem", "Tire pressure gauge"], "estimatedPriceRange": {"max": 250, "min": 30}}, {"name": "Temporary pressure drop due to ambient temperature change", "confidence": 20, "requiredParts": [], "estimatedPriceRange": {"max": 0, "min": 0}}, {"name": "TPMS sensor false reading (unlikely)", "confidence": 10, "requiredParts": ["TPMS sensor"], "estimatedPriceRange": {"max": 100, "min": 50}}]	78	low	t	{"Why this diagnosis?: Based on your description, the tyre currently reads the correct pressure, there’s no visible damage, and the TPMS light is off. However, you initially noticed low pressure, which often points to a slow leak that isn’t obvious—such as a tiny puncture in the tread or a marginal valve stem seal. Temperature fluctuations can also cause temporary drops, but the combination of an initial low reading and a perfectly normal valve stem makes a micro‑leak the most plausible cause.","Recommended Next Inspection: Perform a visual leak check by spraying a soap‑water solution on the tyre’s tread, sidewalls, and around the valve stem while the tyre is inflated to the recommended pressure. Watch for bubbles indicating escaping air.","DIY Category: troubleshooting","Step 1: Inflate the right tyre to the manufacturer‑specified pressure using a reliable pressure gauge.","Step 2: Mix a few drops of dish soap with water in a spray bottle and coat the tyre surface and valve stem.","Step 3: Observe the tyre for any steady stream of bubbles; a localized bubble cluster points to a leak location.","Step 4: If a leak is found on the tread, you can apply a temporary tire repair sealant or have the tyre professionally patched. If the valve stem is leaking, replace the stem with a new one (requires a valve core tool).","Step 5: Re‑check pressure after 24‑48 hours to confirm the leak is resolved."}	diy	2026-07-26 13:35:29.005875+05:30
a9f233d5-8c7d-4843-93db-69bacffa8647	27667df4-49e7-4fa4-998c-2fd3e4a57f76	[{"name": "Faulty valve stem or leaking valve core on right front tire", "confidence": 60, "requiredParts": ["Valve core (standard)", "Valve stem (if core replacement insufficient)"], "estimatedPriceRange": {"max": 30, "min": 5}}, {"name": "Embedded puncture (e.g., nail) without visible tread damage", "confidence": 30, "requiredParts": ["Tire patch kit or professional tire repair service"], "estimatedPriceRange": {"max": 80, "min": 30}}, {"name": "Bead/rim seal leak on right front wheel", "confidence": 10, "requiredParts": ["Rim sealant or professional reseating of tire on rim"], "estimatedPriceRange": {"max": 150, "min": 50}}]	70	low	t	{"Why this diagnosis?: Based on your description the right‑hand tire lost pressure suddenly within minutes, yet there’s no visible puncture, curb damage, or handling change. The most common cause for a rapid, invisible loss is a leak at the valve stem or valve core, which can let air escape quickly without leaving a hole in the tread. A tiny nail or bead leak is possible, but those usually show a puncture mark or a slower leak. Therefore the valve stem is the most probable culprit.","Recommended Next Inspection: 1. Remove the valve cap and spray a mixture of soap and water around the valve stem and base of the tire. Look for bubbles indicating escaping air. 2. If no bubbles appear, tighten the valve core with a valve‑core tool (or replace the core – inexpensive and easy). 3. Re‑inflate the tire to the recommended pressure (see driver’s door jamb) and monitor for 15‑30 minutes. If pressure holds, the valve stem was the issue. If it continues to drop, suspect a puncture or rim‑bead leak and plan a professional tire inspection.","DIY Category: troubleshooting"}	diy	2026-07-26 13:36:12.843493+05:30
f3c62144-5fdc-4507-925f-5a381ab693eb	4c9ec4d7-50d7-47cd-a921-2b2fd1a3a76b	[{"name": "Onboard charger module failure", "confidence": 68, "requiredParts": ["Onboard charger module"], "estimatedPriceRange": {"max": 1800, "min": 1200}}, {"name": "High‑voltage battery management system limiting charge due to temperature sensor fault", "confidence": 15, "requiredParts": ["Battery temperature sensor", "BMS control unit"], "estimatedPriceRange": {"max": 900, "min": 500}}, {"name": "Charging port connector corrosion or loose high‑voltage connection", "confidence": 12, "requiredParts": ["Charging port connector", "High‑voltage cable terminals"], "estimatedPriceRange": {"max": 300, "min": 150}}, {"name": "Vehicle software glitch causing false charging fault", "confidence": 5, "requiredParts": [], "estimatedPriceRange": {"max": 0, "min": 0}}]	70	medium	f	{"Why this diagnosis?: Based on your report that the vehicle only shows the \\"Charging System Fault\\" while stationary, combined with the symptom of noticeably slower charging, the most common cause in a Rivian R1T is a fault in the onboard charger electronics. The charger monitors voltage and current and will reduce power or shut down if it detects an internal fault, which matches the intermittent warning you see. Other possibilities such as a bad temperature sensor or a dirty connector would also limit charge, but they usually trigger a different warning or show temperature alerts, which you haven’t mentioned.","Recommended Next Inspection: 1) Visually inspect the charging inlet and high‑voltage connector for dirt, corrosion, or loose pins. 2) Try a known‑good Level 2 charger or a different charging cable on your R1T and see if the fault still appears. 3) Perform a full vehicle power‑cycle (close all doors, lock the vehicle, wait 5 minutes, then unlock and start). 4) Check for any available over‑the‑air software updates in the Rivian app and install them.","DIY Category: troubleshooting","Step 1: Visual inspection of charging port – Time: 5 min – Tools: Flashlight, soft brush – Expected outcome: Clean port eliminates poor contact; if corrosion is found, clean with appropriate electrical contact cleaner.","Step 2: Test with alternate charger – Time: 10 min – Tools: Another Level 2 charger or public charging station – Expected outcome: If fault disappears, original charger or cable is at fault.","Step 3: Power‑cycle the vehicle – Time: 5 min – Tools: None – Expected outcome: System reset may clear transient software fault; if warning returns, hardware issue likely.","Step 4: Check for software updates – Time: 5 min – Tools: Smartphone with Rivian app, Wi‑Fi – Expected outcome: Installing the latest firmware can resolve known charging‑system bugs."}	bookGarage	2026-07-26 15:03:57.562949+05:30
3f30ec7f-d5db-4252-a2d8-f631f44a7d95	3af585b6-8050-4574-b427-ce3979226d9c	[{"name": "On-board charger (OBC) malfunction limiting charge rate", "confidence": 68, "requiredParts": ["On-board charger module", "High‑voltage connector (if needed)"], "estimatedPriceRange": {"max": 1500, "min": 800}}, {"name": "Loose high‑voltage battery connection causing intermittent charging fault", "confidence": 20, "requiredParts": ["High‑voltage battery terminal connectors", "High‑voltage cable clamps"], "estimatedPriceRange": {"max": 600, "min": 200}}, {"name": "Battery Management System (BMS) software glitch after battery replacement", "confidence": 12, "requiredParts": [], "estimatedPriceRange": {"max": 300, "min": 0}}]	68	medium	f	{"Why this diagnosis?: The slow charging started right after the high‑voltage battery pack was replaced, and the 12 V system (alternator and auxiliary battery) is showing normal charging voltage (13.8 V) with no other warning lights. That tells us the 12 V side is healthy, so the intermittent “Charging System Fault” is most likely coming from the vehicle’s on‑board charger (OBC) or its communication with the new pack. A failing OBC will limit the maximum charge current, making every charging session take longer, and will throw a fault code that appears intermittently as the charger tries to start.","Recommended Next Inspection: Connect a Rivian dealer‑level diagnostic tool or use the Rivian app’s service mode to read the high‑voltage charger fault codes. Visually inspect the high‑voltage charging inlet and the main power connector for debris, loose pins, or corrosion. If possible, plug the truck into a different Level 2 charger to see if the charge rate improves.","DIY Category: troubleshooting","Step 1: Perform a full vehicle power‑cycle – turn the vehicle off, close all doors, wait at least 5 minutes, then start it again. This clears temporary communication glitches between the BMS and OBC.","Step 2: Using the Rivian app, go to Settings → Vehicle Diagnostics and run a “Charging System Check”. Note any codes that appear and screenshot them for later reference.","Step 3: Inspect the high‑voltage charging port with a flashlight. Remove any dust or foreign material, and gently wiggle the connector plug to feel for looseness. Re‑seat the plug firmly.","Step 4: If you have access to another Level 2 charger, charge the vehicle for at least 30 minutes and record the kW rate shown on the display. Compare it to the normal rate listed in the owner’s manual.","Step 5: If the fault persists after steps 1‑4, schedule a service appointment so the dealer can test the OBC and replace it if needed. Estimated time for the above checks: 20‑30 minutes. Tools needed: Rivian app (or smartphone), flashlight, clean rag."}	bookGarage	2026-07-26 15:37:30.907213+05:30
41b650de-c0d6-48de-9307-1ca0d2b1297f	c09b3e27-6551-4e15-9faa-65235168473a	[{"name": "Tire puncture causing low pressure", "confidence": 96, "requiredParts": ["Tire repair kit (plug/patch)", "New tire (if replacement needed)", "Air compressor or portable inflator"], "estimatedPriceRange": {"max": 150, "min": 30}}]	95	low	t	{"Inspect the tyre for the puncture location and verify no sidewall damage.","If the puncture is in the tread and ≤1/4 inch, use a tire repair kit to plug the hole according to the kit instructions.","Deflate the tyre completely before applying the plug.","Re‑inflate the tyre to the manufacturer’s recommended pressure (found on the door jamb label).","Check that the tyre pressure warning light turns off.","If the puncture is larger, in the sidewall, or the tyre cannot hold pressure, replace the tyre with the spare or a new tyre."}	diy	2026-07-27 13:17:58.341817+05:30
a3f94557-6062-410c-9757-7b2ec23c102c	5d2ca93a-f5c8-4e46-8ec9-8895f8d29887	[{"name": "High Voltage Battery Management System (BMS) fault causing pack shutdown", "confidence": 78, "requiredParts": ["Battery Management System control module", "High‑voltage pack interlock relay", "Associated high‑voltage fuses"], "estimatedPriceRange": {"max": 3000, "min": 1500}}, {"name": "Battery pack temperature sensor malfunction leading to charge throttling", "confidence": 60, "requiredParts": ["Battery temperature sensor", "Wiring harness connector"], "estimatedPriceRange": {"max": 1200, "min": 500}}, {"name": "DC‑DC converter failure resulting in loss of low‑voltage system power", "confidence": 45, "requiredParts": ["DC‑DC converter unit", "Associated fuse"], "estimatedPriceRange": {"max": 1500, "min": 800}}]	78	high	f	{"Why this diagnosis?: Based on your description, the charging slowdown started after a cold‑weather shift, the dashboard intermittently shows a “Charging System Fault,” and you cannot obtain any voltage at the battery terminals even when trying to start the vehicle. In Rivian EVs, these exact signs point to a high‑voltage Battery Management System (BMS) or pack‑interlock fault that is shutting the entire pack down to protect itself from low‑temperature operation or internal faults. The fact that no other warnings appear and there are no abnormal sounds or smells further narrows it to an electronic control issue rather than a mechanical one.","Recommended Next Inspection: Have a Rivian‑qualified technician run a full high‑voltage system diagnostic with the factory scan tool, checking BMS error codes, pack voltage, high‑voltage interlock relay status, and temperature sensor readings. Verify the integrity of the pack’s main fuses and contactors before any parts are replaced.","DIY Category: none"}	bookGarage	2026-07-26 15:43:51.66607+05:30
b851d827-9277-43c5-90c1-3103e8bb2703	c3e6191a-f951-42b8-af62-76735b90757b	[{"name": "Motor bearing wear in front drive unit", "confidence": 70, "requiredParts": ["Motor bearing set", "Lubricant (if applicable)"], "estimatedPriceRange": {"max": 2500, "min": 1500}}, {"name": "Reduction gear set wear causing whine", "confidence": 55, "requiredParts": ["Reduction gear set", "Gear housing gasket"], "estimatedPriceRange": {"max": 2000, "min": 1200}}, {"name": "Inverter PWM frequency noise (software)", "confidence": 30, "requiredParts": [], "estimatedPriceRange": {"max": 500, "min": 0}}]	72	medium	f	{"Why this diagnosis?: The Rivian R1T’s electric motor produces a humming/whining sound only when the vehicle is under load at low RPM. This pattern is typical of mechanical noise originating from the motor’s internal bearings or the reduction gear set, because electrical noise would usually be present across the RPM range and a tire or road noise would change with speed. No warning lights or performance loss suggest the power electronics are functioning, pointing toward a mechanical source within the drive unit.","Recommended Next Inspection: Have a qualified Rivian service technician inspect the front drive unit for bearing play, wear, or damage and check the reduction gear housing for wear or insufficient lubrication. They should also run a diagnostic scan to confirm there are no hidden error codes in the motor controller.","DIY Category: none"}	bookGarage	2026-07-26 16:49:24.725643+05:30
f6fb634b-6b67-436a-ae18-ce35632c7932	100292e2-37f1-4e8d-8449-e4c5f59ac28c	[{"name": "Low refrigerant charge causing AC compressor clutch disengagement", "confidence": 70, "requiredParts": ["R-134a refrigerant", "AC system leak sealant (if needed)"], "estimatedPriceRange": {"max": 300, "min": 150}}, {"name": "Faulty AC compressor clutch relay", "confidence": 15, "requiredParts": ["AC compressor clutch relay"], "estimatedPriceRange": {"max": 70, "min": 30}}, {"name": "Failed AC pressure switch", "confidence": 10, "requiredParts": ["AC pressure switch"], "estimatedPriceRange": {"max": 80, "min": 40}}, {"name": "Mechanical failure of AC compressor clutch", "confidence": 5, "requiredParts": ["AC compressor assembly"], "estimatedPriceRange": {"max": 800, "min": 400}}]	72	medium	f	{"Why this diagnosis?: Based on your description that the AC compressor never clicks when you turn the AC on, the interior fan is off, and there are no warning lights, the most common reason is that the system is low on refrigerant. Modern AC systems have a pressure switch that prevents the compressor clutch from engaging when the refrigerant pressure is too low, which protects the compressor from damage. This matches the symptoms you’re seeing, especially the lack of any audible click.","Recommended Next Inspection: Verify the AC system refrigerant pressure with a proper gauge set, and check the AC compressor clutch relay and associated fuse for continuity.","DIY Category: troubleshooting","Step 1: Locate the AC fuse and relay in the fuse box (usually labeled 'AC' or 'A/C COMP'). Remove and inspect for a blown fuse or damaged relay. Replace if needed.","Step 2: Using an AC manifold gauge set, connect the low‑side and high‑side hoses to the service ports (low side is larger, high side smaller). Read the low‑side pressure with the engine off and AC on. If the pressure is near 0 psi, the system is low on refrigerant.","Step 3: If the pressure is low, recharge the system with the correct amount of R‑134a refrigerant (approximately 20‑24 oz for a 2018 Cruze) and monitor if the compressor clutch engages (you should hear a click).","Expected outcome: Proper refrigerant charge will allow the pressure switch to permit the compressor clutch to engage, restoring cooling at highway speeds."}	bookGarage	2026-07-26 18:05:57.950995+05:30
421a61b6-64bc-427c-a1cd-2c8477263fa8	dbb7ecc9-8740-43c7-9f43-708c001165a8	[{"name": "Worn or damaged starter motor gear (Bendix) causing grinding during start‑up", "confidence": 70, "requiredParts": ["Starter motor (Bendix gear)"], "estimatedPriceRange": {"max": 400, "min": 250}}, {"name": "Damaged flywheel ring‑gear teeth causing starter gear to grind", "confidence": 45, "requiredParts": ["Flywheel ring gear (if replacement needed)", "Starter motor (if re‑installation required)"], "estimatedPriceRange": {"max": 500, "min": 300}}, {"name": "Low engine oil pressure leading to lifter noise at start‑up", "confidence": 30, "requiredParts": ["Engine oil", "Oil filter"], "estimatedPriceRange": {"max": 120, "min": 50}}]	68	medium	f	{"Why this diagnosis?: Based on your description, the grinding noise only happens at start‑up and stops once the engine is running. That pattern is classic for a starter system problem—specifically the gear (Bendix) on the starter motor or the teeth on the flywheel that the gear meshes with. When the gear is worn or the flywheel teeth are damaged, the teeth grind against each other just as the starter engages, producing a metallic grinding sound. The fact that there are no warning lights, performance changes, or diagnostic codes further points to a mechanical engagement issue rather than an electronic or internal engine fault.","Recommended Next Inspection: 1. With the vehicle in park/neutral and the parking brake set, have someone turn the key to the start position while you listen closely. Note if the grinding occurs exactly as the starter engages and then stops. 2. Check battery voltage (should be ≥12.4 V at rest). Low voltage can exacerbate starter gear chatter but does not cause grinding by itself. 3. Visually inspect the starter motor mounting bolts for looseness. 4. If comfortable, remove the starter motor (requires basic hand tools) and examine the gear teeth for wear or broken teeth. 5. With the starter removed, inspect the flywheel ring gear for chipped or worn teeth. 6. If the gear and flywheel look good, also check the engine oil level and condition as a secondary sanity check (low oil can cause lifter noise, though that typically sounds like ticking rather than grinding).","DIY Category: troubleshooting"}	bookGarage	2026-07-26 18:17:41.236367+05:30
87b2fdf2-e426-4dbf-8a55-02ca8cc3d567	982ce3d5-81af-4ed7-806f-240f3e81ce46	[{"name": "Low refrigerant charge due to a leak in the AC system", "confidence": 78, "requiredParts": ["R-134a refrigerant (approx. 2-3 lbs)", "AC service hose kit"], "estimatedPriceRange": {"max": 400, "min": 150}}, {"name": "Faulty AC compressor clutch not engaging", "confidence": 55, "requiredParts": ["AC compressor clutch assembly"], "estimatedPriceRange": {"max": 800, "min": 400}}, {"name": "Clogged cabin air filter reducing airflow", "confidence": 40, "requiredParts": ["Cabin air filter"], "estimatedPriceRange": {"max": 50, "min": 20}}]	78	low	f	{"Why this diagnosis?: Based on your description the AC blows weak air that feels hot after a few minutes, there are no abnormal noises and no warning lights. The system was last serviced over a year ago, which is a typical interval for a refrigerant recharge. When the refrigerant level drops, the compressor will disengage, resulting in warm air and reduced fan performance. This pattern is the classic sign of a low‑charge condition caused by a slow leak.","Recommended Next Inspection: Have a technician hook up AC manifold gauges to check the high and low side pressures and look for a refrigerant leak using UV dye or an electronic leak detector.","DIY Category: none"}	bookGarage	2026-07-26 18:24:10.288187+05:30
06b28a97-ce07-4049-ab00-0d80e0d829bf	8c184a31-1e98-423a-937d-cc0feb041832	[{"name": "Carbon buildup on throttle body restricting throttle plate movement", "confidence": 70, "requiredParts": ["Throttle body cleaner", "Rags", "(Optional) New throttle body"], "estimatedPriceRange": {"max": 200, "min": 0}}, {"name": "Faulty throttle position sensor (TPS) giving incorrect signal", "confidence": 20, "requiredParts": ["Throttle Position Sensor"], "estimatedPriceRange": {"max": 120, "min": 50}}, {"name": "Contaminated Mass Air Flow (MAF) sensor reducing airflow measurement", "confidence": 15, "requiredParts": ["MAF sensor cleaning kit", "(Optional) New MAF sensor"], "estimatedPriceRange": {"max": 80, "min": 30}}, {"name": "Worn spark plugs causing weak combustion and sluggish acceleration", "confidence": 10, "requiredParts": ["Spark plugs"], "estimatedPriceRange": {"max": 60, "min": 30}}]	70	low	t	{"Why this diagnosis?: Based on your 2018 Chevrolet Cruze showing slow RPM increase when you press the accelerator, no abnormal noises, unchanged fuel consumption, and no check‑engine light, the most common culprit is a throttle body that has accumulated carbon deposits. The buildup restricts the throttle plate from opening fully, so the engine revs climb slowly and the car feels sluggish.","Recommended Next Inspection: Visually inspect the throttle body for carbon buildup and test throttle plate movement with a scan tool or by gently operating the accelerator while the engine is idling.","DIY Category: troubleshooting","Tools needed: screwdriver set, throttle‑body cleaner, safety glasses, lint‑free rags.","Estimated time: ~30 minutes.","Procedure: 1) Disconnect the battery for safety. 2) Remove the air‑intake hose to expose the throttle body. 3) Spray throttle‑body cleaner on the throttle plate and surrounding surfaces, let it soak for about 2 minutes, then wipe clean with lint‑free rags. 4) Re‑install the hose, reconnect the battery, start the engine and let it idle to clear any residual cleaner. 5) Test acceleration – RPM should rise promptly and throttle response should feel normal.","Expected outcome: Throttle response returns to normal, RPM rises quickly."}	diy	2026-07-26 18:35:03.168382+05:30
1eafe125-0705-4fc2-844c-c7edf917717b	656179e3-9cbb-428b-a347-9dc06f9df581	[{"name": "Worn timing chain tensioner (timing chain rattle)", "confidence": 68, "requiredParts": ["Timing chain tensioner", "Timing chain kit (if needed)", "Gasket set"], "estimatedPriceRange": {"max": 650, "min": 350}}, {"name": "Loose or damaged exhaust heat shield", "confidence": 15, "requiredParts": ["Exhaust heat shield", "Mounting brackets"], "estimatedPriceRange": {"max": 150, "min": 50}}, {"name": "Faulty engine mount", "confidence": 12, "requiredParts": ["Engine mount"], "estimatedPriceRange": {"max": 350, "min": 150}}]	70	medium	f	{"Why this diagnosis?: Based on your description that the rattling noise appears primarily at certain RPM ranges, especially when the engine is in neutral or idle, and during acceleration, the most common source is a worn timing chain tensioner. A timing chain that is too loose will slap against the guides and produce a metallic rattling that is most noticeable at low to mid‑range RPMs and when the engine load changes (e.g., shifting from idle to throttle). The fact that no warning lights are illuminated suggests the engine control module has not yet detected a critical fault, which is typical for early‑stage timing chain wear. Other possibilities such as a loose exhaust heat shield or a bad engine mount can also cause rattling, but they tend to be more constant or linked to vibration rather than appearing only at specific RPM bands. Therefore the timing chain tensioner issue is the most probable cause.","Recommended Next Inspection: Have a qualified technician perform a visual and mechanical inspection of the timing chain and tensioner, check the condition of the chain guides, inspect engine mounts for excessive play, and verify that the exhaust heat shields are securely fastened. Listening with a mechanic’s stethoscope while the engine revs through the problematic RPM range will help pinpoint the exact source of the rattle.","DIY Category: none"}	bookGarage	2026-07-26 18:54:20.088664+05:30
d406136e-de88-4212-a88f-f567f1a19224	2fa2c0f9-ef9e-4cd0-a0ef-239983ff3e31	[{"name": "Weak blower motor or blower motor resistor causing insufficient airflow", "confidence": 78, "requiredParts": ["Blower motor", "Blower motor resistor"], "estimatedPriceRange": {"max": 250, "min": 100}}, {"name": "AC compressor clutch not engaging due to faulty clutch relay or low refrigerant pressure", "confidence": 15, "requiredParts": ["AC compressor clutch relay", "Refrigerant (R-134a)"], "estimatedPriceRange": {"max": 500, "min": 150}}, {"name": "Low refrigerant charge causing clutch disengagement and reduced cooling", "confidence": 7, "requiredParts": ["R-134a refrigerant", "Manifold gauge set"], "estimatedPriceRange": {"max": 250, "min": 120}}]	80	low	t	{"Why this diagnosis?: Based on your description, the fan only blows weakly while the air temperature at the vents does drop noticeably when the AC is turned on. This tells us the refrigerant circuit is likely functioning and providing cooling, but the limited airflow prevents the cabin from feeling properly chilled. The most common cause of weak airflow is a failing blower motor or its resistor, which matches the symptom you reported. The fact that the compressor clutch never clicks suggests the AC may not be fully engaging, but the temperature drop indicates some cooling is still occurring, reinforcing that the primary limitation is airflow rather than a refrigerant or compressor failure.","Recommended Next Inspection: Verify blower motor operation by checking voltage at the motor connector with the AC on, and test the resistance of the blower motor resistor circuit. Also inspect the blower motor fuse and AC clutch relay for power. If the motor receives power but spins slowly, the motor or resistor is faulty.","DIY Category: repair","Step 1: Disconnect the negative battery cable to ensure safety.","Step 2: Remove the glove‑box or lower dash panel to access the blower motor assembly (usually secured with 2‑3 bolts).","Step 3: Using a multimeter, measure voltage at the blower motor connector while the AC fan is set to high. It should read ~12 V. No voltage indicates a fuse/relay issue; replace as needed.","Step 4: With power disconnected, test the motor windings for appropriate resistance (typically 5‑10 Ω). Excessively high resistance means the motor is worn out and should be replaced.","Step 5: If the motor resistance is normal but the fan still runs weakly, test the blower motor resistor by measuring continuity across its terminals (refer to service manual values). A failed resistor will cause low or no fan speed on certain settings; replace the resistor if faulty.","Step 6: Replace the blower motor and/or resistor as determined. Reinstall the dash panel and reconnect the battery.","Step 7: Start the vehicle, turn the AC on, and confirm that strong airflow is restored and cabin cooling improves.","Estimated time: 1‑2 hours. Tools needed: screwdrivers, socket set, multimeter, panel removal tool (optional). Expected outcome: Full fan speed restored, AC cooling performance returns to normal."}	diy	2026-07-26 19:01:18.991094+05:30
6b52ad2c-3110-4a6e-9dee-ddf0f640a542	8076ee3f-2f99-4d07-b359-747e1e253ef5	[{"name": "Hydraulic lifter wear/ticking due to low or dirty engine oil", "confidence": 78, "requiredParts": ["Engine oil (5W-30)", "Oil filter", "Potential lifter replacement kit (if needed)"], "estimatedPriceRange": {"max": 400, "min": 100}}, {"name": "Exhaust manifold leak causing ticking at idle", "confidence": 10, "requiredParts": ["Exhaust manifold gasket", "Manifold bolts", "Potential new exhaust manifold"], "estimatedPriceRange": {"max": 350, "min": 150}}, {"name": "Normal fuel injector operation tick", "confidence": 7, "requiredParts": [], "estimatedPriceRange": {"max": 0, "min": 0}}, {"name": "Timing chain tensioner wear causing rattle", "confidence": 5, "requiredParts": ["Timing chain tensioner", "Timing chain kit"], "estimatedPriceRange": {"max": 800, "min": 300}}]	78	medium	f	{"Why this diagnosis?: Based on your description the ticking or tapping you hear while the engine is idling, combined with the fact that the last oil change was over 6,000 miles ago and you’re noticing higher fuel consumption, the most common culprit is worn or out‑of‑spec hydraulic lifters caused by low‑quality or insufficient oil. Dirty oil reduces hydraulic pressure, allowing the lifters to “tap” and also forces the engine to work harder, which shows up as increased fuel use.","Recommended Next Inspection: Check the engine oil level and condition, then perform a full oil and filter change. After the oil change, start the engine and listen for the ticking noise to see if it has diminished or disappeared.","DIY Category: troubleshooting","Step 1: Park the car on level ground, allow the engine to cool, open the hood, pull the dipstick, wipe clean, re‑insert and pull again to read the oil level. If the level is low or the oil looks dark and gritty, add the manufacturer‑specified oil (5W‑30) using a funnel. Time approx. 5 min. Tools: dipstick, funnel.","Step 2: Place a drain pan under the oil pan, remove the drain plug with a socket wrench, let the oil drain completely, replace the drain plug, remove the old oil filter with an oil‑filter wrench, install a new filter, and refill with 4‑5 qt of fresh 5W‑30 oil. Run the engine for a minute, check for leaks, then shut off and re‑check the oil level. Time approx. 30 min. Tools: socket set, oil‑filter wrench, drain pan, funnel. Expected outcome: Fresh, proper‑viscosity oil restores hydraulic lifter function, eliminating the tick and may improve fuel economy."}	bookGarage	2026-07-26 19:49:03.499243+05:30
67fce8ee-f792-44a8-9331-8d8c0c793c87	d0bbdfd5-7dd4-4c9b-bb79-ff99ed75e53c	[{"name": "Water pump bearing failure causing overheating", "confidence": 68, "requiredParts": ["water pump", "pump gasket", "coolant"], "estimatedPriceRange": {"max": 400, "min": 250}}, {"name": "Stuck closed thermostat leading to overheating and coolant surge noise", "confidence": 15, "requiredParts": ["thermostat", "thermostat gasket", "coolant"], "estimatedPriceRange": {"max": 250, "min": 150}}, {"name": "Loose exhaust heat shield causing rattling (unlikely to affect temperature)", "confidence": 10, "requiredParts": ["exhaust heat shield", "mounting brackets", "hardware"], "estimatedPriceRange": {"max": 150, "min": 50}}]	70	medium	f	{"Why this diagnosis?: Based on your description, the engine makes a rattling sound during acceleration and the temperature gauge reads high. A rattling noise that coincides with overheating most commonly points to a failing water pump – its internal bearings can loosen and create a metallic rattle, and a failing pump can’t circulate coolant effectively, causing the temperature to rise. The fact that the noise doesn’t change with load suggests it’s not a load‑dependent component like the timing chain, and the high temperature reading rules out a simple heat‑shield vibration, which wouldn’t affect coolant temperature.","Recommended Next Inspection: Visually inspect the water pump for leaks, bearing play or wobble, and check the coolant level and condition. With the engine running and warmed up, listen closely near the pump for a metallic rattle. Also verify that the radiator fan engages when the engine reaches operating temperature. If the pump shows wear or the coolant is low despite no leaks, the pump is likely the culprit.","DIY Category: none"}	bookGarage	2026-07-27 10:19:50.529582+05:30
aa99102d-15b8-40f6-a672-00ff8588cd9f	11d832b6-7413-4259-9981-1827d4817ba6	[{"name": "Timing Chain or Valve Train Noise", "confidence": 70, "requiredParts": ["Timing chain kit"], "estimatedPriceRange": {"max": 275, "min": 75}}]	78	high	f	{}	bookGarage	2026-07-27 12:46:03.516121+05:30
5d77a8c5-1190-4fdf-9f44-059bd7331d37	d2c72a0a-4bb6-4b55-9a87-d8b17baed3a2	[{"name": "Timing Chain or Valve Train Noise", "confidence": 70, "requiredParts": ["Timing chain kit"], "estimatedPriceRange": {"max": 275, "min": 75}}, {"name": "Low Engine Oil or Poor Lubrication", "confidence": 40, "requiredParts": ["Engine oil", "Oil filter"], "estimatedPriceRange": {"max": 50, "min": 20}}]	78	high	f	{}	bookGarage	2026-07-27 12:57:08.860422+05:30
3745989f-e22e-4c06-9100-2ab5e81b09f6	38f2c43e-cf01-4e9b-b911-bc7a2326d2c6	[{"name": "Blown wiper fuse", "confidence": 70, "requiredParts": ["Wiper fuse (10 A)"], "estimatedPriceRange": {"max": 20, "min": 5}}, {"name": "Wiper motor failure", "confidence": 30, "requiredParts": ["Wiper motor assembly"], "estimatedPriceRange": {"max": 250, "min": 150}}]	85	low	t	{"Locate the fuse box (typically under the dashboard on the driver side or in the engine compartment).","Consult the vehicle owner's manual to identify the fuse labeled “WIPER” or “WIPER MOTOR” (usually a 10 A fuse).","Remove the identified fuse and inspect it for a broken filament or blackened appearance.","If the fuse is blown, replace it with a new fuse of the same amperage (10 A).","Re‑install the fuse and operate the wiper switch to verify operation.","If the new fuse does not restore function, the wiper motor may be faulty; consider having a professional replace the motor."}	diy	2026-07-27 13:20:09.235918+05:30
166f26bd-cd3f-449e-b210-9dc0eadc692d	a55d0580-eff7-45bd-9b90-790e977d27fb	[{"name": "Worn Brake Pads", "confidence": 94, "requiredParts": ["Front brake pads", "Rear brake pads (if needed)"], "estimatedPriceRange": {"max": 230, "min": 150}}]	92	medium	f	{}	bookGarage	2026-07-27 13:49:17.535762+05:30
16d1f8aa-9810-4baa-905a-b4ebdbe9d347	b6b4c8b7-6514-45e8-8580-20e4e332cdab	[{"name": "Radiator Cooling Fan Motor Failure", "confidence": 78, "requiredParts": ["Radiator cooling fan motor", "Cooling fan relay (if needed)", "Cooling fan wiring connector"], "estimatedPriceRange": {"max": 400, "min": 250}}, {"name": "Low Coolant Level", "confidence": 42, "requiredParts": ["Premixed coolant/antifreeze"], "estimatedPriceRange": {"max": 50, "min": 0}}]	80	high	f	{}	bookGarage	2026-07-27 15:37:57.213031+05:30
32495069-c26c-46a8-a971-2cbe0f5380f3	a9f05a46-3f4a-4c4e-88af-fcfc7cbadcbd	[{"name": "Leaking Tire Valve Stem", "confidence": 78, "requiredParts": ["Valve stem (compatible with 2018 Chevrolet Cruze)", "Valve core sealant (optional)", "Valve stem tool"], "estimatedPriceRange": {"max": 30, "min": 15}}]	78	medium	f	{"1. Loosen the lug nuts on the affected wheel while the vehicle is still on the ground.","2. Raise the vehicle with a jack and secure it on jack stands.","3. Remove the lug nuts and take the wheel off the hub.","4. Deflate the tire completely to relieve pressure on the valve stem.","5. Use a valve stem removal tool to pull the old valve stem out of the rim.","6. Insert the new valve stem into the rim using the stem insertion tool, ensuring it sits flush.","7. Re‑inflate the tire to the manufacturer‑specified pressure (usually 30‑35 psi for a 2018 Cruze).","8. Re‑mount the wheel, hand‑tighten the lug nuts, lower the vehicle, then torque the lug nuts to spec (80‑100 Nm).","9. Check for any air loss over the next few hours; if pressure holds, the repair is complete."}	bookGarage	2026-07-27 16:02:02.983066+05:30
33572ba1-dbf5-42fe-8ea1-3c5e11cb5fad	9a60a334-4cdd-4a66-bd1b-784fad67ee85	[{"name": "Leaking Tire Valve Stem", "confidence": 82, "requiredParts": ["Rubber valve stem (or valve core)"], "estimatedPriceRange": {"max": 60, "min": 8}}]	85	medium	f	{"Park the vehicle on a flat surface and engage the parking brake.","Remove the wheel lug nuts and take off the wheel.","Deflate the tire completely by pressing the valve core.","Use a valve stem removal tool (or a tire changer) to pull the old valve stem out of the rim.","Insert the new valve stem, making sure the rubber boot sits flat against the rim.","Re‑inflate the tire to the manufacturer's recommended pressure (check the driver’s door jamb).","Apply a small amount of soapy water around the new stem to verify no leaks.","Re‑mount the wheel, torque the lug nuts to spec, and lower the vehicle."}	bookGarage	2026-07-27 16:10:10.866428+05:30
99dffe20-ecba-4ad6-ba2c-cfcf5f194ad4	e35fc703-d52b-497a-84ff-9451abeec0ba	[{"name": "Tire Puncture (slow leak)", "confidence": 85, "requiredParts": ["Tire repair patch kit", "Valve stem (if needed)", "Tire sealant (optional)"], "estimatedPriceRange": {"max": 120, "min": 30}}]	85	high	f	{"Visually inspect the tire for nails, screws, or other foreign objects.","Mark the location of the puncture and remove any debris.","If the puncture is in the tread and ≤¼ inch (6 mm) in diameter, use a tire repair patch kit to plug the hole per the kit instructions.","Re‑inflate the tire to the recommended pressure (found on the door jamb sticker).","Check for leaks by applying soapy water to the repaired area and watching for bubbles. If the puncture is in the sidewall or larger than ¼ inch, replace the tire instead of repairing."}	bookGarage	2026-07-27 16:21:28.420534+05:30
fba94c1d-d819-4096-aa61-07c0ef638d01	ee266b82-9f6f-49f8-828b-84797930d678	[{"name": "Valve stem leak (faulty valve core)", "confidence": 70, "requiredParts": ["Valve core", "Valve core tool (optional)"], "estimatedPriceRange": {"max": 15, "min": 5}}, {"name": "Small puncture in tire tread or sidewall", "confidence": 20, "requiredParts": ["Tire repair kit", "Patch kit"], "estimatedPriceRange": {"max": 50, "min": 20}}, {"name": "TPMS sensor malfunction causing inaccurate reading", "confidence": 5, "requiredParts": ["TPMS sensor"], "estimatedPriceRange": {"max": 100, "min": 50}}, {"name": "Normal temperature‑related pressure drop", "confidence": 5, "requiredParts": [], "estimatedPriceRange": {"max": 0, "min": 0}}]	70	low	t	{"Why this diagnosis?: Based on your description the tire pressure is low without any visible puncture and the TPMS light is not illuminated. The most common cause in this situation is a slow leak from the valve stem or valve core, which often doesn’t leave obvious damage on the tread. Since you haven’t monitored the pressure over days, a gradual loss points to a small leak rather than a sudden puncture. Temperature changes can also lower pressure, but they typically affect all tires equally and are less likely when only one tire is noted low.","Recommended Next Inspection: Perform a visual check of the valve stem and apply a soap‑water solution around the valve, tread, sidewall, and bead to look for bubbles indicating escaping air.","DIY Category: repair","Step 1: Use a tire pressure gauge to measure the current pressure and inflate the tire to the manufacturer‑specified PSI (found on the door jamb placard).","Step 2: Mix dish soap with water and spray or brush it onto the valve stem, tire tread, sidewall, and bead area. Watch for steady bubbling which shows a leak.","Step 3: If bubbles appear at the valve stem, tighten the valve core with a valve‑core tool. If tightening doesn’t stop the leak, replace the valve core (a cheap part that fits most passenger‑car tires).","Step 4: If bubbles appear elsewhere, use a tire repair kit to plug or patch the puncture, or take the tire to a shop for a proper repair if the damage is larger than a small puncture.","Step 5: Re‑check the pressure after repairs and after driving for a few miles to ensure it holds. If pressure continues to drop, have a professional inspect the wheel bead seal or TPMS sensor."}	diy	2026-07-27 23:09:51.76409+05:30
9671aebb-9bda-440d-af64-ed8ca0db7dd4	6d1ff241-d995-4fe5-be25-49ad35c44262	[{"name": "Seatbelt latch mechanism jam (retractor locked)", "confidence": 70, "requiredParts": ["Seatbelt latch assembly"], "estimatedPriceRange": {"max": 250, "min": 150}}, {"name": "Seatbelt retractor motor failure", "confidence": 20, "requiredParts": ["Seatbelt retractor motor"], "estimatedPriceRange": {"max": 350, "min": 200}}, {"name": "Seatbelt buckle sensor (interlock) electrical fault", "confidence": 10, "requiredParts": ["Seatbelt buckle sensor"], "estimatedPriceRange": {"max": 200, "min": 100}}]	72	high	f	{"Why this diagnosis?: Based on your description the latch stays locked, the warning light never comes on and other electronics work, indicating a mechanical problem in the latch/retractor rather than an electrical fault. The most common cause is a jammed latch or retractor spring that prevents the belt from releasing.","Recommended Next Inspection: Visually inspect the seatbelt latch and retractor for debris, corrosion, or a broken release button; manually attempt to move the latch while the belt is slack to feel for resistance.","DIY Category: troubleshooting","Step 1: Disconnect the vehicle battery for at least 5 minutes to reset any electronic modules and ensure safety.","Step 2: Remove the seat trim panels on the driver’s side using a flat‑head screwdriver or trim removal tool to expose the latch assembly.","Step 3: Examine the latch mechanism for dirt, broken spring, or a seized release lever; clean with a lint‑free cloth and apply a small amount of high‑temperature silicone spray if movement is stiff.","Step 4: With the belt retracted, gently pull the belt out while pressing the release button to see if the latch now frees; listen for the normal click sound.","Step 5: Reinstall trim, reconnect the battery, and test the seatbelt operation. If the latch still sticks, the assembly likely needs to be replaced.","Estimated time: 30–45 minutes, Tools needed: trim removal tool or flat‑head screwdriver, small socket set, silicone spray, safety gloves."}	bookGarage	2026-07-28 11:01:28.412528+05:30
54f1f51e-5edc-473f-99d2-af978ce736a1	6beab251-abbb-4306-8507-c0be2064ab0e	[{"name": "Blower motor circuit failure (motor, fuse or relay) causing no airflow", "confidence": 70, "requiredParts": ["Blower motor", "Blower motor fuse", "Blower motor relay"], "estimatedPriceRange": {"max": 425, "min": 210}}, {"name": "System low on refrigerant (never recharged) preventing cooling", "confidence": 45, "requiredParts": ["R-134a refrigerant", "Refrigerant oil", "Leak detection kit"], "estimatedPriceRange": {"max": 600, "min": 120}}, {"name": "Clogged cabin air filter restricting airflow", "confidence": 30, "requiredParts": ["Cabin air filter"], "estimatedPriceRange": {"max": 35, "min": 20}}, {"name": "Failed AC compressor clutch", "confidence": 25, "requiredParts": ["AC compressor clutch assembly"], "estimatedPriceRange": {"max": 800, "min": 400}}]	70	low	t	{"Why this diagnosis?: Based on your 2018 Chevrolet Cruze reporting no airflow from the vents and warm air when the AC is set to maximum, the most common cause is a failure in the blower motor circuit – typically a bad blower motor, a blown fuse, or a faulty relay. The lack of airflow means the AC system can’t deliver cooled air even if the compressor were working. While low refrigerant could also keep the air warm, it would still allow airflow, which you’re not experiencing. Hence the blower‑motor side is the primary suspect, with refrigerant level, cabin filter blockage, and compressor clutch failure as secondary possibilities.","Recommended Next Inspection: 1. Locate the blower motor fuse (usually in the interior fuse box – consult the owner’s manual for the exact position) and inspect it for a broken filament. Replace if blown. 2. Find the blower motor relay (often in the engine‑compartment fuse box) and swap it with an identical relay from another circuit to test. 3. With the ignition ON, listen for the blower motor humming when the fan knob is turned on – no sound suggests a dead motor. 4. If fuses/relays are good, use a multimeter to measure voltage at the blower motor connector while the fan is set to high; you should see battery voltage (~12 V). No voltage indicates a wiring or control module issue. 5. While you’re checking, visually inspect the cabin air filter; a heavily clogged filter can restrict airflow and should be replaced if dirty. 6. Finally, if the blower motor runs but the air is still warm, have someone watch the AC compressor clutch on the engine while the AC is on – if the clutch doesn’t engage, low refrigerant is likely.","DIY Category: troubleshooting"}	diy	2026-07-29 08:32:22.846484+05:30
7a1eb7ce-d39a-41d1-9694-e392c1143480	3be4537a-55b2-47da-bfae-a0c1b5c3fa4c	[{"name": "Low refrigerant charge (undercharged AC system)", "confidence": 78, "requiredParts": ["R-134a refrigerant", "UV leak detection dye (optional)"], "estimatedPriceRange": {"max": 250, "min": 150}}, {"name": "Faulty low‑pressure switch (AC pressure sensor)", "confidence": 45, "requiredParts": ["Low pressure switch"], "estimatedPriceRange": {"max": 150, "min": 80}}, {"name": "Compressor clutch coil failure", "confidence": 30, "requiredParts": ["Compressor clutch coil", "Compressor (if replacement required)"], "estimatedPriceRange": {"max": 500, "min": 300}}]	78	low	t	{"Why this diagnosis?: Based on your description that the AC only stops cooling at highway speeds, the compressor clutch clicks but does not spin, and there are no noises or warning lights, the most common cause is an under‑charged refrigerant system. When the system is low on refrigerant the low‑pressure switch tells the clutch to stay disengaged, which is why you see the clutch click without turning, especially under the higher demand of highway driving.","Recommended Next Inspection: Verify system pressure with a proper AC manifold gauge set and look for any hidden leaks using UV dye or an electronic leak detector.","DIY Category: troubleshooting","Step 1: Park the vehicle on level ground, let the engine reach normal operating temperature, and turn the AC to the lowest temperature setting.","Step 2: Connect the low‑side and high‑side ports of an AC manifold gauge set to the service ports (low side is larger, high side is smaller).","Step 3: Observe the low‑side pressure at idle (should be around 30‑40 psi) and at highway speed (should rise to 60‑70 psi). If the low‑side pressure stays below ~30 psi, the system is undercharged.","Step 4: While the system is pressurized, spray UV dye (if previously added) around hoses, fittings, and the compressor for 5‑10 minutes, then use a UV flashlight to locate any leaks.","Step 5: If a leak is found, note the component (e.g., hose, O‑ring, condenser) for repair. If no leak is found and pressure is low, the system likely needs a refrigerant recharge.","Estimated time: 30‑45 minutes.","Tools needed: AC manifold gauge set, UV leak detection kit (or electronic leak detector), safety glasses, gloves.","Expected outcome: Confirmation whether the refrigerant charge is low or if a leak exists, allowing you to decide on a recharge or repair before visiting a professional."}	diy	2026-07-29 10:23:23.109627+05:30
3185deae-13ab-4879-bf5e-e438048dced7	319cf51d-3ace-4139-bdd0-8c19d300aa43	[{"name": "Low refrigerant charge (possible leak)", "confidence": 70, "requiredParts": ["R-134a refrigerant (2‑3 lb)", "AC leak detection dye or sealant (optional)"], "estimatedPriceRange": {"max": 250, "min": 120}}, {"name": "Faulty AC low‑pressure switch", "confidence": 15, "requiredParts": ["AC pressure switch"], "estimatedPriceRange": {"max": 70, "min": 30}}, {"name": "Defective compressor clutch coil", "confidence": 10, "requiredParts": ["Compressor clutch coil assembly"], "estimatedPriceRange": {"max": 400, "min": 200}}, {"name": "Blown AC fuse or faulty relay", "confidence": 5, "requiredParts": ["AC fuse (15‑20 A)", "AC relay"], "estimatedPriceRange": {"max": 20, "min": 5}}]	70	low	t	{"Why this diagnosis?: Based on your description the AC compressor clutch never engages, the vents stay at ambient temperature, and the condenser fan never turns on. In modern Ford F‑150s the AC system will lock out the compressor clutch when the refrigerant pressure is too low, which also prevents the fan from receiving an AC‑request signal. The combination of no clutch click and no fan activity points most often to an under‑charged system (likely a leak) rather than a mechanical failure of the clutch itself.","Recommended Next Inspection: Verify refrigerant pressure with an AC gauge set and inspect the AC fuse/relay and condenser fan operation. If pressure is below the low‑side spec, the system is low on refrigerant and needs recharging and leak repair; if pressure is normal, move on to checking the pressure switch and clutch coil.","DIY Category: troubleshooting","Step 1: Locate the AC fuse (usually in the interior fuse box, labeled AC or A/C) and the AC relay (under the hood relay box). Pull each out and inspect for a broken filament or corrosion. Replace any faulty fuse (typical 15‑20 A) and relay as needed.","Step 2: With the engine running and AC set to cold, listen closely near the compressor for a faint click when the AC is engaged. No click confirms the clutch is not receiving power.","Step 3: Connect a set of AC manifold gauges to the low‑side service port (red hose). Observe the low‑side pressure; it should be around 25‑45 psi at idle with AC on. If it reads near 0 psi, the system is low on refrigerant.","Step 4: If the pressure is low, purchase the correct amount of R‑134a refrigerant (approximately 2‑3 lb for a 2020 F‑150) and a charging kit. Follow the kit instructions to add refrigerant while monitoring the pressure gauge until it reaches the specified range.","Step 5: After charging, re‑check for a clutch click and verify the condenser fan turns on. If the clutch still does not engage, the next likely culprit is the low‑pressure switch or the clutch coil, which should be inspected by a professional."}	diy	2026-07-29 10:24:00.753206+05:30
92417e1d-04dd-4283-b3de-8f485d2ec464	bdc4a5ed-4ca6-43da-b4f6-4517cc59849a	[{"name": "Loose exhaust heat shield causing rattling during deceleration", "confidence": 70, "requiredParts": ["heat shield brackets", "self-tapping screws", "heat-resistant wire"], "estimatedPriceRange": {"max": 150, "min": 50}}, {"name": "Worn engine mount generating clunk/rattle on deceleration", "confidence": 15, "requiredParts": ["engine mount", "mounting bolts"], "estimatedPriceRange": {"max": 400, "min": 200}}, {"name": "Hydraulic valve lifter tick audible at mid RPM range", "confidence": 10, "requiredParts": ["engine oil", "oil filter"], "estimatedPriceRange": {"max": 300, "min": 150}}, {"name": "Loose intake manifold bolt or gasket causing vibration", "confidence": 5, "requiredParts": ["intake manifold bolts", "gasket sealant"], "estimatedPriceRange": {"max": 200, "min": 80}}]	70	low	t	{"Why this diagnosis?: Based on your description of a rattling noise that only occurs while decelerating, specifically between 2000‑3000 RPM, and the absence of any warning lights or performance loss, the pattern most closely matches a loose or vibrating exhaust heat‑shield or other exhaust component. Those parts tend to vibrate when engine vacuum drops during deceleration, and the sound is typically a metallic rattle. Other possibilities such as engine mounts or lifter noise were considered, but they either produce a different type of sound or would usually be noticeable at other engine loads.","Recommended Next Inspection: Safely raise the vehicle and visually inspect the exhaust system, especially the heat‑shields around the catalytic converter and exhaust manifold, for loose bolts, missing clamps, or damaged shields. Gently tap the shields with a rubber mallet; a change in the noise indicates the source.","DIY Category: troubleshooting","Tools needed: jack and jack stands, flashlight, socket set with extensions, torque wrench, safety glasses.","Inspection steps: 1) Securely lift the truck and support it on jack stands. 2) Locate the exhaust heat‑shields and check all mounting bolts for tightness; tighten any loose bolts to the manufacturer’s torque spec. 3) If a shield is cracked or missing, replace it using new brackets or wrap it with heat‑resistant wire. 4) After re‑tightening, start the engine, let it idle, then decelerate in the 2000‑3000 RPM range to confirm the rattling is gone.","Estimated time: 30‑45 minutes."}	diy	2026-07-29 10:26:55.767305+05:30
98cf751f-aefe-4071-944c-942e497a9b38	f461c6cc-69c4-4e35-a6d3-a0fa51187fd1	[{"name": "Failed master cylinder (internal hydraulic leak)", "confidence": 78, "requiredParts": ["Master cylinder", "Brake fluid"], "estimatedPriceRange": {"max": 600, "min": 300}}, {"name": "Warped brake rotors", "confidence": 45, "requiredParts": ["Brake rotors", "Brake pads (optional)"], "estimatedPriceRange": {"max": 400, "min": 200}}, {"name": "Brake fluid leak (hose or caliper seal)", "confidence": 40, "requiredParts": ["Brake hose", "Caliper seal", "Brake fluid"], "estimatedPriceRange": {"max": 350, "min": 150}}, {"name": "Air in brake lines (requires bleeding)", "confidence": 35, "requiredParts": ["Brake fluid", "Bleed kit"], "estimatedPriceRange": {"max": 150, "min": 80}}]	78	high	f	{"Why this diagnosis?: Based on your description the brake pedal sinks to the floor, which indicates a loss of hydraulic pressure in the braking system. That symptom is most commonly caused by an internal leak or failure in the master cylinder. The simultaneous vibration at both low and high speeds can also be produced by a compromised brake system where pressure fluctuates, but it would not be expected if only the rotors were warped. Since the ABS light is not on and there is no squealing noise, the more likely culprit is a failing master cylinder rather than worn pads or a simple rotor issue.","Recommended Next Inspection: 1. Check the brake fluid level in the reservoir; low fluid may indicate a leak. 2. Inspect around the master cylinder and brake lines for fluid drips or wet spots. 3. Examine the brake rotors for uneven wear or run‑out using a dial indicator (if accessible). 4. Look at each caliper for brake fluid seepage. 5. If fluid is low without visible leaks, pressure test the master cylinder.","DIY Category: none"}	bookGarage	2026-07-29 10:37:01.770463+05:30
043c4e2f-4a13-4085-8766-ba703c55e4d6	5fb6c20f-bb48-4abd-a302-d6b6bfe589fd	[{"name": "Faulty valve stem causing slow air loss", "confidence": 62, "requiredParts": ["Valve stem kit", "Valve core tool (optional)"], "estimatedPriceRange": {"max": 30, "min": 10}}, {"name": "Small puncture in tread or sidewall not visible", "confidence": 25, "requiredParts": ["Tire repair plug kit", "Replacement tire (if needed)"], "estimatedPriceRange": {"max": 200, "min": 20}}, {"name": "TPMS sensor malfunction causing inaccurate pressure reading", "confidence": 13, "requiredParts": ["TPMS sensor unit", "TPMS programming tool (professional)"], "estimatedPriceRange": {"max": 100, "min": 50}}]	62	low	t	{"Why this diagnosis?: Based on your report the tire was just inflated and shows no visible puncture, yet you’re noticing low pressure. The most common hidden cause in this scenario is a leaking valve stem, which can let air escape slowly without obvious damage. Since there’s no TPMS warning, the sensor is likely still functional, pointing to a mechanical leak rather than an electronic fault.","Recommended Next Inspection: Inspect the valve stem, bead area, and tread with a soap‑water test to spot bubbles indicating a leak. Pay special attention to the valve stem base and the tire‑rim seal.","DIY Category: repair","Step 1: Apply a soap‑water solution around the valve stem, tire bead, and tread. Watch for bubbling which shows escaping air. Tools: spray bottle with soap solution. Time: 5‑10 minutes. Expected outcome: Locate the source of the leak.","Step 2: If bubbles appear at the valve stem, use a valve‑core removal tool to extract the core and replace it with a new one from a valve stem kit (or replace the entire stem if damaged). Tools: valve‑core tool, valve stem kit. Time: 15‑30 minutes. Expected outcome: Sealed valve stem that holds pressure.","Step 3: Re‑inflate the tire to the manufacturer‑specified pressure (typically 35 psi for a 2020 F‑150) using an air compressor. Re‑check pressure after 1 hour. Tools: air compressor or portable inflator. Time: 5 minutes. Expected outcome: Tire maintains pressure, confirming the issue is resolved."}	diy	2026-07-29 15:47:57.849354+05:30
8f4289ea-8f07-4456-adfd-98cf125f5ff7	424bcf23-4995-4eae-afb1-25537a17c7ea	[{"name": "Throttle body carbon buildup restricting airflow", "confidence": 70, "requiredParts": ["Throttle body cleaner", "Lint‑free cloth"], "estimatedPriceRange": {"max": 150, "min": 0}}, {"name": "Clogged fuel filter limiting fuel flow", "confidence": 15, "requiredParts": ["Fuel filter"], "estimatedPriceRange": {"max": 80, "min": 30}}, {"name": "Weak fuel pump delivering insufficient pressure", "confidence": 10, "requiredParts": ["Fuel pump assembly"], "estimatedPriceRange": {"max": 600, "min": 200}}, {"name": "Mass airflow sensor (MAF) malfunction causing inaccurate air measurement", "confidence": 5, "requiredParts": ["MAF sensor"], "estimatedPriceRange": {"max": 250, "min": 100}}]	70	low	t	{"Why this diagnosis?: Based on your description the engine’s RPM climbs very slowly and the truck feels weak at every speed, yet there’s no check‑engine light, odd noises, or smells. That pattern points to a restriction in the amount of air reaching the engine rather than a fuel‑delivery or ignition fault. The most common source of that restriction in a 2020 F‑150 with ~54k mi is carbon buildup on the throttle body, which can cause the throttle plate to stick and limit how quickly the engine can rev. This explains the gradual RPM rise and the overall lack of punch without triggering fault codes.","Recommended Next Inspection: Visually inspect the throttle body for carbon deposits and check that the throttle plate moves freely when the accelerator pedal is pressed. If it feels sticky or you see heavy buildup, clean the throttle body.","DIY Category: repair","Step 1: Gather tools – a set of screwdrivers or a 10 mm socket, throttle‑body cleaner spray, lint‑free cloth, and safety gloves. (≈15 min)","Step 2: Disconnect the negative battery cable to reset the ECU and prevent any short while working. (≈5 min)","Step 3: Locate the throttle body on the intake manifold (usually directly behind the air‑filter housing). Remove the intake hose clamp and gently pull the hose off. (≈5 min)","Step 4: Spray throttle‑body cleaner onto the throttle plate and surrounding surfaces. Use the cloth to wipe away carbon deposits, being careful not to let liquid enter the idle‑air‑control valve. Continue until the surface is clean and the plate moves smoothly. (≈10 min)","Step 5: Re‑install the intake hose, reconnect the battery, start the engine, and let it idle for a minute. Observe that the RPM rises quickly when you press the accelerator. If pickup improves, the issue is resolved. If not, further diagnosis (fuel filter, pump, MAF) will be needed."}	diy	2026-07-29 23:39:31.620987+05:30
ceda9b7f-bf26-41d3-b7e6-0966ea626d04	81f33170-40d2-4b22-940f-a6143e5e5c71	[{"name": "Warped front brake rotors", "confidence": 78, "requiredParts": ["front brake rotors"], "estimatedPriceRange": {"max": 500, "min": 250}}, {"name": "Sticking front brake caliper", "confidence": 12, "requiredParts": ["front brake caliper"], "estimatedPriceRange": {"max": 300, "min": 150}}, {"name": "Uneven front brake pad wear", "confidence": 10, "requiredParts": ["brake pads"], "estimatedPriceRange": {"max": 200, "min": 100}}]	78	medium	f	{"Why this diagnosis?: The vibration occurs only when you press the brake pedal and is felt through the steering wheel. That pattern is classic for warped front brake rotors, because the rotors are directly linked to the wheels that steer the vehicle. A warped rotor creates an uneven contact surface with the brake pads, causing the pedal pulsation that you feel in the wheel. The absence of squealing or grinding eliminates typical pad‑wear noise, and the fact that the vibration is present regardless of vehicle speed points to a problem that appears only under braking load, not a wheel‑balance issue. Since you’re not sure whether the rotors or pads have been serviced, it’s likely the rotors have accumulated heat‑induced warping over time.","Recommended Next Inspection: 1. Safely raise and support each front wheel. 2. Remove the wheel and visually inspect the rotor surface for uneven wear, scoring, or discoloration. 3. Measure rotor thickness at several points with a micrometer; compare against the manufacturer’s minimum spec (usually printed on the rotor). 4. If a dial indicator is available, check rotor run‑out; values greater than 0.002‑0.003 in indicate warpage. 5. Re‑install wheel and repeat on the opposite side for comparison.","DIY Category: troubleshooting","Step 1: Park on a flat surface, engage the parking brake, and place wheel chocks behind the rear wheels.","Step 2: Loosen the front lug nuts with a lug wrench before lifting the vehicle.","Step 3: Use a floor jack to lift the front of the truck and secure it with jack stands.","Step 4: Remove the lug nuts and wheel to expose the brake rotor.","Step 5: Perform the visual and thickness checks described above. If the rotor thickness is below spec or run‑out exceeds limits, the rotor is warped and should be replaced. If the rotor looks within spec, proceed to inspect the caliper pins and brake pads for sticking or uneven wear. Expected outcome: Confirmation whether the front rotors are warped (requiring replacement) or if another component is the cause."}	bookGarage	2026-07-29 23:53:00.916068+05:30
f79c3f3e-f525-4a87-9357-f17fa789e9b1	53a09e8b-82e0-438b-ad1c-6158be0e095f	[{"name": "Failed wiper motor (electrical failure)", "confidence": 70, "requiredParts": ["Wiper motor assembly"], "estimatedPriceRange": {"max": 300, "min": 150}}, {"name": "Faulty wiper motor relay or blown fuse", "confidence": 20, "requiredParts": ["Wiper motor relay", "Fuse"], "estimatedPriceRange": {"max": 50, "min": 20}}, {"name": "Malfunctioning wiper control module", "confidence": 10, "requiredParts": ["Wiper control module"], "estimatedPriceRange": {"max": 400, "min": 200}}]	70	medium	f	{"Why this diagnosis?: Based on your description, the wiper control lever clicks, indicating the switch is functioning, but there is no sound from the motor and the arms do not move. This points to the motor not receiving power or being internally failed. The issue appears after using washer fluid or in rain, which suggests moisture may have affected the motor's electrical contacts, leading to an intermittent open circuit. Therefore the most likely cause is a failed wiper motor.","Recommended Next Inspection: Check the wiper system fuse (refer to the owner’s manual, typically a 15 A fuse) and the wiper motor relay for continuity, then measure voltage at the motor connector while the switch is engaged. If voltage is present but the motor does not turn, the motor is likely dead.","DIY Category: repair","Step 1: Locate and inspect the wiper motor fuse; replace if blown.","Step 2: Locate the wiper motor relay in the power‑distribution box, swap with a known good relay of the same rating to test.","Step 3: If fuse and relay are good, disconnect the motor connector and measure voltage at the motor terminals with the switch on. No voltage points to wiring; voltage with no motor movement points to motor failure.","Step 4: Remove the wiper motor assembly – detach the wiper arms by removing the retaining nut (13 mm), disconnect the electrical connector, and unbolt the motor from the firewall.","Step 5: Install the new wiper motor, reconnect the connector, reattach the wiper arms and torque the nut to specification.","Step 6: Test the wipers; they should sweep smoothly and respond to the lever.","Estimated time: 1.5–2 hours.","Tools needed: socket set (13 mm), screwdrivers, multimeter, torque wrench, trim‑removal tool."}	bookGarage	2026-07-30 01:31:38.57348+05:30
\.


--
-- Data for Name: diagnosis_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnosis_sessions (id, customer_user_id, vehicle_id, symptoms_text, attachments, possible_issues, urgency, diy_allowed, risk_text, next_questions, draft_estimate_min, draft_estimate_max, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: garage_badges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.garage_badges (id, garage_id, badge_key, active, awarded_at) FROM stdin;
db1933fe-482f-4dd8-9f75-935ba4b7be69	00000000-0000-0000-0000-000000000011	budgetFriendly	t	2026-07-22 13:38:54.472344+05:30
8e427a2b-86bf-4f77-99a6-270f057ca148	00000000-0000-0000-0000-000000000012	mostTrusted	t	2026-07-22 13:38:54.472344+05:30
e6175384-13cf-4509-8d70-22ded128a55c	00000000-0000-0000-0000-000000000013	topRated	t	2026-07-22 13:38:54.472344+05:30
a8619450-9b53-49e7-bc08-b70f35fb2f32	00000000-0000-0000-0000-000000000015	topRated	t	2026-07-22 13:38:54.472344+05:30
28fa663e-24cc-46a1-8228-724e8c6ac81a	00000000-0000-0000-0000-000000000018	mostTrusted	t	2026-07-22 13:38:54.472344+05:30
\.


--
-- Data for Name: garage_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.garage_documents (id, garage_id, doc_type, file_url, verification_status, reviewed_by, reviewed_at, created_at) FROM stdin;
\.


--
-- Data for Name: garage_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.garage_services (id, garage_user_id, name, category, price, description, active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: garage_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.garage_slots (id, garage_id, start_at, end_at, is_available) FROM stdin;
\.


--
-- Data for Name: garages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.garages (id, owner_user_id, name, address, location, specializations, certifications, pickup_drop_supported, approval_status, rating_avg, rating_count, created_at, updated_at, starting_price, distance_km, image, response_mins, address_line, city, state, postal_code, verification_status, is_approved, trust_score, business_hours) FROM stdin;
00000000-0000-0000-0000-000000000011	00000000-0000-0000-0000-000000000003	QuickPit Service Center	Madhapur, Hyderabad	{"lat": 17.4483, "lng": 78.3741}	{"1 Month Warranty","Free Inspection","Free Pickup","Pay After Service"}	{"ISO 9001"}	t	approved	4.50	96	2026-07-22 13:38:54.357753+05:30	2026-07-22 13:38:54.472344+05:30	Starting ₹599	3.1 km	/assets/garage_1_1778071156220.png	40	\N	\N	\N	\N	pending	f	\N	\N
00000000-0000-0000-0000-000000000012	00000000-0000-0000-0000-000000000003	SpeedFix Auto Care	Kondapur, Hyderabad	{"lat": 17.4622, "lng": 78.3568}	{"Warranty Available","Free Pickup","Original Parts","Pay After Service"}	{"ASE Certified"}	t	approved	4.60	128	2026-07-22 13:38:54.357753+05:30	2026-07-22 13:38:54.472344+05:30	Starting ₹499	2.2 km	/assets/garage_2_1778071173295.png	30	\N	\N	\N	\N	pending	f	\N	\N
00000000-0000-0000-0000-000000000013	00000000-0000-0000-0000-000000000003	AutoWorks Garage	Gachibowli, Hyderabad	{"lat": 17.4401, "lng": 78.3489}	{"1 Month Warranty","Free Inspection","Original Parts","Pay After Service"}	{"Bosch Certified"}	f	approved	4.40	110	2026-07-22 13:38:54.357753+05:30	2026-07-22 13:38:54.472344+05:30	Starting ₹449	4.2 km	/assets/garage_3_1778071191282.png	45	\N	\N	\N	\N	pending	f	\N	\N
00000000-0000-0000-0000-000000000014	00000000-0000-0000-0000-000000000003	Five Star Automotive	Banjara Hills, Hyderabad	{"lat": 17.4156, "lng": 78.4347}	{"Free Inspection","Pay After Service","Free Pickup","1 Month Warranty"}	{"Manufacturer Approved"}	t	approved	4.30	78	2026-07-22 13:38:54.357753+05:30	2026-07-22 13:38:54.472344+05:30	Starting ₹699	5.2 km	/assets/garage_4_1778071611328.png	50	\N	\N	\N	\N	pending	f	\N	\N
00000000-0000-0000-0000-000000000016	00000000-0000-0000-0000-000000000003	Royal Motor Service	Jubilee Hills, Hyderabad	{"lat": 17.4312, "lng": 78.4008}	{"1 Month Warranty","AC Service Expert","Free Pickup","Quality Parts"}	{"ASE Certified"}	f	approved	4.20	64	2026-07-22 13:38:54.357753+05:30	2026-07-22 13:38:54.472344+05:30	Starting ₹529	3.8 km	/assets/garage_5_1778071628253.png	35	\N	\N	\N	\N	pending	f	\N	\N
00000000-0000-0000-0000-000000000017	00000000-0000-0000-0000-000000000003	PitStop Car Care	Kukatpally, Hyderabad	{"lat": 17.4948, "lng": 78.3996}	{"Free Inspection","Quick Service","Pay After Service","1 Month Warranty"}	{"Bosch Certified"}	t	approved	4.10	58	2026-07-22 13:38:54.357753+05:30	2026-07-22 13:38:54.472344+05:30	Starting ₹489	4.9 km	/assets/garage_1_1778071156220.png	40	\N	\N	\N	\N	pending	f	\N	\N
00000000-0000-0000-0000-000000000019	00000000-0000-0000-0000-000000000003	Galaxy Auto Garage	Miyapur, Hyderabad	\N	{"1 Month Warranty","Pick & Drop","Genuine Parts","Free Inspection"}	\N	f	approved	4.30	92	2026-07-22 13:38:54.472344+05:30	2026-07-22 13:38:54.472344+05:30	\N	3.6 km	/assets/garage_2_1778071173295.png	55	\N	\N	\N	\N	pending	f	\N	\N
00000000-0000-0000-0000-000000000020	00000000-0000-0000-0000-000000000003	TorquePlus Service Hub	Ameerpet, Hyderabad	\N	{"Warranty Available","Genuine Parts","Pick & Drop","Pay After Service"}	\N	f	approved	4.20	71	2026-07-22 13:38:54.472344+05:30	2026-07-22 13:38:54.472344+05:30	\N	6.1 km	/assets/garage_3_1778071191282.png	60	\N	\N	\N	\N	pending	f	\N	\N
00000000-0000-0000-0000-000000000015	00000000-0000-0000-0000-000000000003	Metro Auto Bay	Hitech City, Hyderabad	{"lat": 17.4435, "lng": 78.3772}	{"Free Inspection","Warranty Available","Free Pickup","Quick Service"}	{"ISO 9001"}	t	approved	4.70	142	2026-07-22 13:38:54.357753+05:30	2026-07-22 13:38:54.472344+05:30	Starting ₹549	2.8 km	/assets/garage_4_1778071611328.png	25	\N	\N	\N	\N	pending	f	\N	\N
00000000-0000-0000-0000-000000000021	00000000-0000-0000-0000-000000000003	Urban Garage Works	Begumpet, Hyderabad	\N	{"Pay After Service","Free Pickup","Quality Parts","AC Service Expert"}	\N	f	pending	4.00	53	2026-07-22 13:38:54.472344+05:30	2026-07-22 13:38:54.472344+05:30	\N	5.8 km	/assets/garage_5_1778071628253.png	55	\N	\N	\N	\N	pending	f	\N	\N
00000000-0000-0000-0000-000000000018	00000000-0000-0000-0000-000000000003	Prime Service Point	Secunderabad, Hyderabad	{"lat": 17.4411, "lng": 78.3499}	{"Original Parts","Pay After Service","Free Inspection","Pick & Drop"}	{"ASE Certified"}	t	approved	4.60	119	2026-07-22 13:38:54.385426+05:30	2026-07-22 13:38:54.472344+05:30	\N	4.4 km	/assets/garage_1_1778071156220.png	35	\N	\N	\N	\N	pending	f	\N	\N
00000000-0000-0000-0000-000000000022	00000000-0000-0000-0000-000000000003	CarNest Workshop	Manikonda, Hyderabad	\N	{"1 Month Warranty","Free Pickup",Inspection,"Genuine Parts"}	\N	f	pending	4.10	61	2026-07-22 13:38:54.472344+05:30	2026-07-22 13:38:54.472344+05:30	\N	6.4 km	/assets/garage_2_1778071173295.png	48	\N	\N	\N	\N	pending	f	\N	\N
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (id, product_id, qty_available, updated_at) FROM stdin;
\.


--
-- Data for Name: issue_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.issue_requests (id, customer_user_id, vehicle_id, diagnosis_session_id, summary, issue_source, issue_payload, status, created_at, updated_at) FROM stdin;
fb79b6c7-2ba9-bfa7-3e8e-772adfdc4ae1	00000000-0000-0000-0000-000000000001	00000000-0000-0000-0000-000000000002	\N	Engine knocking sound during cold start	direct	{}	open	2026-07-26 23:51:39.534392+05:30	2026-07-26 23:51:39.534392+05:30
7c9d5b3c-3f97-acc6-542b-9065149cd964	887ae938-b723-4f0f-ab8c-b19169e4dc20	ab793c5c-90bf-4128-bdc0-46e31bd1cd58	\N	Oil change and routine periodic maintenance required	direct	{}	open	2026-07-26 23:51:39.534392+05:30	2026-07-26 23:51:39.534392+05:30
bcfc3dd1-9f4e-73ad-d795-b3b4c95b3323	00000000-0000-0000-0000-000000000001	00000000-0000-0000-0000-000000000002	\N	Brake pedal feels soft and stopping distance increased	direct	{}	open	2026-07-26 23:51:39.534392+05:30	2026-07-26 23:51:39.534392+05:30
f6a41bd4-5459-cf7b-28e8-a699666ffd59	887ae938-b723-4f0f-ab8c-b19169e4dc20	ab793c5c-90bf-4128-bdc0-46e31bd1cd58	\N	AC cooling is weak in city traffic	direct	{}	open	2026-07-26 23:51:39.534392+05:30	2026-07-26 23:51:39.534392+05:30
eb14fa17-1ddf-7550-3689-9d0ec85e4ead	00000000-0000-0000-0000-000000000001	00000000-0000-0000-0000-000000000002	\N	Oil change and routine periodic maintenance required	direct	{}	open	2026-07-26 23:51:39.534392+05:30	2026-07-26 23:51:39.534392+05:30
62b7bcaa-c68f-339e-8fd3-630686753e54	887ae938-b723-4f0f-ab8c-b19169e4dc20	ab793c5c-90bf-4128-bdc0-46e31bd1cd58	\N	Engine knocking sound during cold start	direct	{}	open	2026-07-26 23:51:39.534392+05:30	2026-07-26 23:51:39.534392+05:30
50c9f719-896a-35a7-2809-a468e58d4b8e	00000000-0000-0000-0000-000000000001	00000000-0000-0000-0000-000000000002	\N	AC cooling is weak in city traffic	direct	{}	open	2026-07-26 23:51:39.534392+05:30	2026-07-26 23:51:39.534392+05:30
a2ce3aeb-9945-cc7e-db9a-6f8b95431ddb	887ae938-b723-4f0f-ab8c-b19169e4dc20	ab793c5c-90bf-4128-bdc0-46e31bd1cd58	\N	Brake pedal feels soft and stopping distance increased	direct	{}	open	2026-07-26 23:51:39.534392+05:30	2026-07-26 23:51:39.534392+05:30
\.


--
-- Data for Name: known_issues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.known_issues (id, category, symptom_keywords, makes, year_from, year_to, issue_name, description, risk_level, diy_allowed, safety_critical, required_parts, estimated_cost_min, estimated_cost_max, diy_steps, garage_steps, base_confidence) FROM stdin;
3d0c546b-d897-467a-8093-263e627ecf55	engine_noise	{"engine noise","engine sound","ticking sound","knocking sound","rattling sound","whining noise","tap tap sound","noise from engine","sound from bonnet"}	\N	\N	\N	Low Engine Oil or Poor Lubrication	Low or degraded oil can cause ticking or knocking sounds from the top end or bottom end of the engine.	medium	t	f	[{"name": "Engine oil", "category": "fluid"}, {"name": "Oil filter", "category": "filter"}]	20.00	50.00	{"Check the dipstick to confirm oil level.","Locate the oil filler cap on top of the engine.","Add the correct grade of oil in small increments.","Recheck the dipstick level."}	{"Inspect engine for oil leaks.","Drain old oil and replace oil filter.","Fill with fresh oil.","Run engine and check for leaks."}	88.00
af0aaa08-8118-47e9-b17c-43f65178c061	engine_noise	{"engine noise","engine sound","ticking sound","knocking sound","rattling sound","whining noise","tap tap sound","noise from engine","sound from bonnet"}	\N	\N	\N	Drive Belt or Tensioner Issue	A loose belt or worn tensioner can create whining or rattling sounds that change with RPM or AC load.	medium	t	f	[{"name": "Drive belt", "category": "belt"}, {"name": "Belt tensioner", "category": "pulley"}]	25.00	80.00	{"Locate the belt tensioner pulley.","Relieve tension using a wrench and remove the old belt.","Thread the new belt according to the routing diagram.","Release the tensioner to secure the belt."}	{"Inspect belt alignment and pulleys.","Check tensioner spring tension and bearings.","Replace belt and tensioner."}	71.00
a74a7446-f6f3-4dfe-949a-e2f84ad0d5b0	engine_noise	{"engine noise","engine sound","ticking sound","knocking sound","rattling sound","whining noise","tap tap sound","noise from engine","sound from bonnet"}	\N	\N	\N	Timing Chain or Valve Train Noise	Worn timing or valve train parts can cause repeated ticking or rattling, especially during startup.	high	f	f	[{"name": "Timing chain kit", "category": "engine"}]	75.00	275.00	{}	{"Remove valve cover and front engine cover.","Inspect timing chain guides and tensioner.","Replace timing chain and sprockets.","Set engine timing."}	56.00
136df4e3-40d7-47df-a2bd-36bf2d347e8e	ac_not_cooling	{"ac not cooling","air conditioner not cooling","weak ac","hot air from ac","ac weak","no cooling","ac problem","cooling issue"}	\N	\N	\N	Low Refrigerant Gas	Low refrigerant can reduce cooling efficiency, especially in traffic or during high ambient temperatures.	medium	t	f	[{"name": "Refrigerant recharge kit", "category": "fluid"}]	25.00	55.00	{"Locate the low-pressure AC port.","Connect the recharge hose and pressure gauge.","Add refrigerant with the engine running and AC on max.","Monitor pressure to avoid overfilling."}	{"Perform AC system leak test using UV dye.","Evacuate existing refrigerant.","Recharge system to exact manufacturer specification."}	86.00
7b8820a6-d445-4213-9b9a-2469283bf694	ac_not_cooling	{"ac not cooling","air conditioner not cooling","weak ac","hot air from ac","ac weak","no cooling","ac problem","cooling issue"}	\N	\N	\N	Cabin Filter or Blower Restriction	Blocked cabin filters or blower issues reduce airflow even if the AC system itself is functioning.	low	t	f	[{"name": "Cabin air filter", "category": "filter"}]	10.00	40.00	{"Locate the cabin filter housing (usually behind the glovebox).","Release the cover and slide out the old filter.","Install the new filter matching the airflow direction arrow.","Secure the cover and glovebox."}	{"Remove blower motor and check for debris.","Inspect blower resistor operation.","Replace cabin air filter."}	67.00
f6b9e9e9-e509-4793-a209-c1f72065ada1	ac_not_cooling	{"ac not cooling","air conditioner not cooling","weak ac","hot air from ac","ac weak","no cooling","ac problem","cooling issue"}	\N	\N	\N	AC Compressor Performance Issue	A weak or cycling compressor can cause fluctuating cooling and unusual noise when the AC engages.	high	f	f	[{"name": "AC compressor", "category": "electrical"}]	60.00	220.00	{}	{"Evacuate refrigerant from the system.","Disconnect electrical connector and lines from the compressor.","Replace the compressor and receiver drier.","Evacuate and recharge system."}	53.00
1665ce72-4a22-4d32-8710-b59172c66c3b	brake_vibration	{"brake vibration","brake vibe","car vibrates when braking","steering shakes when braking","pulsation while braking","brake judder","brake shaking"}	\N	\N	\N	Warped Brake Disc	Warped or uneven brake rotors commonly cause steering or pedal vibration during braking.	high	f	t	[{"name": "Brake rotors", "category": "brakes"}]	30.00	80.00	{}	{"Raise vehicle and remove wheels.","Remove brake caliper and old brake rotors.","Clean hub surface and install new rotors.","Reassemble and check torque."}	89.00
42bf7cce-afb9-4df3-aae3-2fcee5022f8e	brake_vibration	{"brake vibration","brake vibe","car vibrates when braking","steering shakes when braking","pulsation while braking","brake judder","brake shaking"}	\N	\N	\N	Uneven Brake Pad Deposit	Uneven friction deposits on the rotor surface can create pulsing and shudder while braking.	medium	f	t	[{"name": "Brake pads", "category": "brakes"}]	20.00	50.00	{}	{"Inspect pad wear pattern.","Resurface (turn) or clean rotors.","Install new brake pads and bed them in."}	68.00
32be4275-19cb-41b9-8562-ecda216ca193	brake_vibration	{"brake vibration","brake vibe","car vibrates when braking","steering shakes when braking","pulsation while braking","brake judder","brake shaking"}	\N	\N	\N	Brake Caliper Sticking	A sticking caliper can overheat one side, cause vibration, and wear pads unevenly.	high	f	t	[{"name": "Brake caliper", "category": "brakes"}]	25.00	85.00	{}	{"Raise vehicle and check wheel drag.","Remove sticking caliper.","Rebuild or replace caliper assembly.","Bleed brake lines."}	52.00
50fe539e-926d-491f-ba78-be429aa77ce3	low_pickup	{"low pickup","poor pickup","low power","car not accelerating","pickup issue","sluggish acceleration","power loss"}	\N	\N	\N	Air Intake or Filter Restriction	A clogged air filter or restricted intake can reduce acceleration and make the engine feel dull.	low	t	f	[{"name": "Engine air filter", "category": "filter"}]	10.00	40.00	{"Locate the engine air box.","Release the retaining clips.","Remove the dirty air filter and clean the air box interior.","Place the new filter and re-secure the cover."}	{"Inspect intake ducting for leaks or blockage.","Check mass airflow (MAF) sensor readings.","Replace engine air filter."}	83.00
f20be341-8afb-404a-bdde-d4869e21b8df	low_pickup	{"low pickup","poor pickup","low power","car not accelerating","pickup issue","sluggish acceleration","power loss"}	\N	\N	\N	Fuel Delivery Problem	Fuel pump or injector-side issues can cause hesitation, weak pickup, and inconsistent acceleration.	medium	t	f	[{"name": "Fuel filter", "category": "filter"}, {"name": "Fuel pump", "category": "fuel"}]	30.00	150.00	{"Relieve fuel system pressure.","Disconnect lines and replace the fuel filter (if external).","Turn key to prime system and check for leaks."}	{"Perform fuel pressure test.","Inspect fuel injectors and check resistance.","Replace fuel pump or clean injectors."}	69.00
44e1d155-36b5-4a0b-a3ea-cf1b9aef6783	low_pickup	{"low pickup","poor pickup","low power","car not accelerating","pickup issue","sluggish acceleration","power loss"}	\N	\N	\N	Ignition or Sensor Performance Issue	Weak spark or inaccurate sensor signals can reduce power and trigger a check engine light.	medium	t	f	[{"name": "Spark plugs", "category": "ignition"}, {"name": "Ignition coils", "category": "ignition"}]	20.00	110.00	{"Remove engine cover to access ignition coils.","Disconnect electrical connector and remove coil.","Use spark plug socket to remove and replace spark plugs.","Reinstall coils and torque to spec."}	{"Scan for OBD-II trouble codes.","Check misfire counters and spark plug condition.","Replace spark plugs and faulty ignition coils."}	57.00
b6a10c71-5db0-4415-8dd4-4cdf27736e67	starting_issue	{"car not starting","not starting","start issue","engine not starting","self not working","slow crank","crank no start","no start"}	\N	\N	\N	Weak or Discharged Battery	Low battery voltage is the most common reason for slow cranking or no-start complaints.	medium	t	f	[{"name": "Car battery", "category": "electrical"}]	45.00	110.00	{"Turn off engine and wear safety gear.","Disconnect negative terminal first, then positive terminal.","Remove hold-down bracket and lift battery out.","Clean terminals, install new battery, and connect positive first."}	{"Perform battery load test.","Test alternator charging output.","Check parasitical draw."}	87.00
7d43adca-7a52-47f4-8e37-cbc43f28ab44	starting_issue	{"car not starting","not starting","start issue","engine not starting","self not working","slow crank","crank no start","no start"}	\N	\N	\N	Starter Motor or Solenoid Issue	If power is available but the engine will not crank properly, the starter system may be at fault.	medium	t	f	[{"name": "Starter motor", "category": "electrical"}]	30.00	120.00	{"Disconnect battery negative cable.","Raise and support vehicle safely.","Disconnect wiring connections from starter.","Unbolt and replace starter motor."}	{"Inspect starter control circuit voltage.","Test starter solenoid current draw.","Replace starter motor assembly."}	66.00
65de9cac-d8e2-47f6-b6f8-a7efa17ebb7c	starting_issue	{"car not starting","not starting","start issue","engine not starting","self not working","slow crank","crank no start","no start"}	\N	\N	\N	Fuel or Ignition No-Start Condition	If the engine cranks normally but does not start, fuel or spark delivery should be checked.	high	f	f	[{"name": "Fuel pump relay", "category": "electrical"}]	25.00	150.00	{}	{"Verify fuel pump operation and pressure.","Check for ignition spark and cylinder compression.","Check crankshaft position sensor."}	54.00
1445b9a4-038c-48a1-88f7-c6e239d8c202	steering_suspension	{"steering vibration","steering wheel vibration","car shaking","vibration at high speed","wheel vibration","suspension vibration","pulling to one side"}	\N	\N	\N	Wheel Balancing Issue	Unbalanced wheels can cause vibration in the steering wheel, especially at higher speeds.	medium	f	t	[{"name": "Wheel weights", "category": "tyres"}]	20.00	30.00	{}	{"Mount wheels on dynamic wheel balancer.","Spin wheel to locate heavy spots.","Apply wheel weights to balance.","Verify zero imbalance."}	85.00
4c01dc9e-e2b5-46da-af8c-6f0cfdffe813	steering_suspension	{"steering vibration","steering wheel vibration","car shaking","vibration at high speed","wheel vibration","suspension vibration","pulling to one side"}	\N	\N	\N	Wheel Alignment Issue	Improper alignment can cause vibrations and pulling to one side.	medium	f	t	[]	10.00	20.00	{}	{"Mount vehicle on alignment rack.","Check caster, camber, and toe angles.","Adjust suspension linkages to factory specifications."}	65.00
4d32bb48-19af-4f5d-8d0c-100717c8aacd	steering_suspension	{"steering vibration","steering wheel vibration","car shaking","vibration at high speed","wheel vibration","suspension vibration","pulling to one side"}	\N	\N	\N	Brake Disc Warped	Warped brake discs can cause vibration in the steering wheel while braking.	high	f	t	[{"name": "Brake rotors", "category": "brakes"}]	30.00	55.00	{}	{"Check rotor runout using dial indicator.","Replace warped brake rotors and pads.","Inspect caliper slider pins."}	40.00
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, channel, template_key, payload, status, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, customer_id, order_number, status, subtotal, shipping_cost, tax, total, currency, fulfillment_mode, shipping_address, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: otp_challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otp_challenges (id, phone, purpose, role_code, full_name, otp_code, expires_at, consumed_at, created_at) FROM stdin;
\.


--
-- Data for Name: part_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.part_orders (id, customer_user_id, part_id, qty, total_amount, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: parts_catalog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parts_catalog (id, name, category, price, currency, in_stock, supplier, created_at) FROM stdin;
aaaa0000-0000-0000-0000-000000000001	Premium Brake Pad Kit	Brakes	129.00	USD	t	WrectifAI Parts	2026-07-26 23:51:39.529664+05:30
aaaa0000-0000-0000-0000-000000000002	Synthetic Oil + Filter Combo	Maintenance	59.00	USD	t	WrectifAI Parts	2026-07-26 23:51:39.529664+05:30
aaaa0000-0000-0000-0000-000000000003	All-Season Tire (Single)	Tires	189.00	USD	t	MetroDrive Supply	2026-07-26 23:51:39.529664+05:30
\.


--
-- Data for Name: payment_intents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_intents (id, booking_id, customer_user_id, amount, currency, method, status, client_secret, expires_at, confirmed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, customer_user_id, booking_id, order_id, method, transaction_id, amount, currency, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, seller_id, name, description, category, price, currency, is_diy_kit, is_active, compatible_vehicle_rules, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, user_id, avatar_url, bio, address_line, city, state, postal_code, notification_preferences, created_at, updated_at, business_hours, specializations, certifications) FROM stdin;
\.


--
-- Data for Name: promos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promos (id, badge, icon, title, bullets, numeric_price, strike_price, discount_percent, valid_till, used_count_value, image, categories, is_combo, relevance, theme_preset, created_at) FROM stdin;
summer-care-combo	SUMMER CARE COMBO	Sun	Coolant + AC + Engine Oil Combo	{"Improves engine cooling","Enhances AC performance","Extends engine life"}	2999.00	4500.00	33	2026-08-21 13:38:54.357753+05:30	1200	/assets/summner_car.png	{"Car Care",Service,"Combo Deals"}	t	99	orange	2026-07-22 13:38:54.357753+05:30
monsoon-care-combo	MONSOON CARE COMBO	CloudRain	Wiper Blades + Tyres + Checkup Combo	{"Clear visibility in rain","Better grip on wet roads","Comprehensive vehicle check"}	1999.00	3000.00	33	2026-09-05 13:38:54.357753+05:30	986	/assets/monsooncare.png	{Service,Tyres,"Combo Deals"}	t	97	green	2026-07-22 13:38:54.357753+05:30
winter-care-combo	WINTER CARE COMBO	Snowflake	Battery + Engine Oil + Coolant Combo	{"Reliable cold starts","Smooth engine performance","Prevents overheating"}	2499.00	3800.00	34	2026-09-20 13:38:54.357753+05:30	642	/assets/wintercombo.png	{Batteries,Service,"Combo Deals"}	t	95	blue	2026-07-22 13:38:54.357753+05:30
festival-shine-combo	FESTIVAL SHINE COMBO	Sparkles	Foam Wash + Wax + Interior Dressing	{"Showroom shine","Protects paint","Deep clean interior"}	1799.00	2600.00	31	2026-08-06 13:38:54.357753+05:30	852	https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=400&q=80	{"Car Care","Combo Deals"}	t	90	purple	2026-07-22 13:38:54.357753+05:30
weekend-check-combo	WEEKEND CHECK COMBO	Settings	Brake Check + Battery Test + Fluid Top-up	{"Safety first","Peace of mind","Quick 30-min service"}	1499.00	2200.00	32	2026-08-01 13:38:54.357753+05:30	431	/assets/weekend_combo_1778071208387.png	{Service,"Combo Deals"}	t	85	green	2026-07-22 13:38:54.357753+05:30
mega-car-wash-offer	MEGA CAR WASH OFFER	CarFront	Premium Wash + Interior Cleaning	{"Exterior foam wash","Vacuum cleaning","Dashboard polish"}	499.00	699.00	29	2026-08-11 13:38:54.357753+05:30	2100	/assets/mega car.png	{"Car Care"}	f	98	green	2026-07-22 13:38:54.357753+05:30
brake-care-special	BRAKE CARE SPECIAL	Disc3	Brake Pads + Disc Inspection	{"Brake wear check","Pads replacement option","Noise issue diagnosis"}	1299.00	1799.00	28	2026-08-16 13:38:54.357753+05:30	1500	/assets/brake_disc_1778070670609.png	{Service}	f	96	red	2026-07-22 13:38:54.357753+05:30
ac-service-offer	AC SERVICE OFFER	Snowflake	AC Checkup + Gas Top-up	{"Cooling effectiveness check","Filter cleaning","Gas level top-up"}	1199.00	1599.00	26	2026-08-21 13:38:54.357753+05:30	1800	/assets/ac_vent_1778070688367.png	{Service}	f	94	blue	2026-07-22 13:38:54.357753+05:30
\.


--
-- Data for Name: quote_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quote_requests (id, customer_id, vehicle_id, diagnosis_request_id, issue_summary, preferred_date, status, created_at) FROM stdin;
00000000-0000-0000-0000-000000000030	00000000-0000-0000-0000-000000000001	00000000-0000-0000-0000-000000000002	\N	Wheel Balance and Wheel Alignment	2026-07-25 13:38:54.385426+05:30	quoted	2026-07-22 11:38:54.385426+05:30
44a212f3-6df9-41ad-b8ed-a5686a8a56f8	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	68192af8-cedd-40fc-8f3b-a17ba09b5156	Low Refrigerant Gas, Cabin Filter or Blower Restriction, AC Compressor Performance Issue	\N	quoted	2026-07-22 15:19:22.52351+05:30
b25d0c77-1da7-4022-9c61-a093616a171a	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	bc6d50b6-ba97-4491-8289-ddc3c3ffdb04	Low Refrigerant Gas	\N	quoted	2026-07-23 12:40:35.877837+05:30
53b20097-5cf8-4321-b13b-3632d5dcdf31	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	86421b34-3f9f-4f31-9463-2c09988700cb	Faulty windshield wiper motor (gear/inner mechanism seized), Blown wiper fuse, Faulty wiper control stalk/switch	\N	quoted	2026-07-24 11:29:15.512454+05:30
a0b9d963-83d4-4d59-92bc-456f30c884a2	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	86421b34-3f9f-4f31-9463-2c09988700cb	Faulty windshield wiper motor (gear/inner mechanism seized), Blown wiper fuse, Faulty wiper control stalk/switch	\N	quoted	2026-07-24 11:29:27.343356+05:30
8b3a3eee-1b19-4034-8f12-cccda3e1cf08	887ae938-b723-4f0f-ab8c-b19169e4dc20	00000000-0000-0000-0000-000000000002	7d5c39c4-0bb8-4a0b-afbb-085ae99c162b	Passenger power seat motor/actuator failure, Blown fuse for passenger seat motor circuit, Seat track obstruction or jammed mechanism	\N	quoted	2026-07-24 11:33:06.350145+05:30
9705a9d8-9199-4b31-b842-73926704fd16	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	d0bbdfd5-7dd4-4c9b-bb79-ff99ed75e53c	Water pump bearing failure causing overheating, Stuck closed thermostat leading to overheating and coolant surge noise, Loose exhaust heat shield causing rattling (unlikely to affect temperature)	\N	open	2026-07-27 10:20:03.476996+05:30
47aefa0c-64d3-4808-a277-6c482af18ebb	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	\N	Wheel Balancing Issue, Wheel Alignment Issue	\N	open	2026-07-27 10:22:00.002159+05:30
82e3a14e-6cd6-4e0e-93f5-795fce69c628	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	d2c72a0a-4bb6-4b55-9a87-d8b17baed3a2	Timing Chain or Valve Train Noise, Low Engine Oil or Poor Lubrication	\N	quoted	2026-07-27 12:57:21.504314+05:30
c29d2924-61ef-4ba4-a4c6-4c4af757d1bd	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	ee266b82-9f6f-49f8-828b-84797930d678	Valve stem leak (faulty valve core), Small puncture in tire tread or sidewall, TPMS sensor malfunction causing inaccurate reading, Normal temperature‑related pressure drop	\N	quoted	2026-07-27 23:13:02.352199+05:30
6bc8a52d-119c-47c2-824f-8fb1ec968d1a	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	6d1ff241-d995-4fe5-be25-49ad35c44262	Seatbelt latch mechanism jam (retractor locked), Seatbelt retractor motor failure, Seatbelt buckle sensor (interlock) electrical fault	\N	quoted	2026-07-28 11:03:21.374502+05:30
dd1e19c0-1a09-4035-9e17-ff05a32c22ce	887ae938-b723-4f0f-ab8c-b19169e4dc20	41f77633-893a-4a41-b95e-316358760e4d	6beab251-abbb-4306-8507-c0be2064ab0e	Blower motor circuit failure (motor, fuse or relay) causing no airflow, System low on refrigerant (never recharged) preventing cooling, Clogged cabin air filter restricting airflow, Failed AC compressor clutch	\N	quoted	2026-07-29 08:32:49.017701+05:30
a402c22f-bb80-4e29-be6c-624849626a0e	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	319cf51d-3ace-4139-bdd0-8c19d300aa43	Low refrigerant charge (possible leak), Faulty AC low‑pressure switch, Defective compressor clutch coil, Blown AC fuse or faulty relay	\N	quoted	2026-07-29 10:25:14.492044+05:30
882e6162-1f89-4291-a851-d337fd9f0412	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	319cf51d-3ace-4139-bdd0-8c19d300aa43	Low refrigerant charge (possible leak), Faulty AC low‑pressure switch, Defective compressor clutch coil, Blown AC fuse or faulty relay	\N	quoted	2026-07-29 10:26:13.184952+05:30
772f6d6b-f064-44e2-a8de-e56863eae4fc	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	bdc4a5ed-4ca6-43da-b4f6-4517cc59849a	Loose exhaust heat shield causing rattling during deceleration, Worn engine mount generating clunk/rattle on deceleration, Hydraulic valve lifter tick audible at mid RPM range, Loose intake manifold bolt or gasket causing vibration	\N	quoted	2026-07-29 10:28:00.493041+05:30
e2191fff-8da4-4d0c-a068-8f4832a906f0	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	f461c6cc-69c4-4e35-a6d3-a0fa51187fd1	Failed master cylinder (internal hydraulic leak), Warped brake rotors, Brake fluid leak (hose or caliper seal), Air in brake lines (requires bleeding)	\N	quoted	2026-07-29 10:37:06.467544+05:30
d10e8139-bb32-4362-b367-95aff5e53aeb	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	5fb6c20f-bb48-4abd-a302-d6b6bfe589fd	Faulty valve stem causing slow air loss, Small puncture in tread or sidewall not visible, TPMS sensor malfunction causing inaccurate pressure reading	\N	quoted	2026-07-29 15:48:46.472679+05:30
bc6a684f-1889-483c-b740-5539e5f80b42	00000000-0000-0000-0000-000000000003	45d26afa-2db1-4540-ba4f-aad57374c64f	81f33170-40d2-4b22-940f-a6143e5e5c71	Warped front brake rotors, Sticking front brake caliper, Uneven front brake pad wear	\N	quoted	2026-07-29 23:56:03.001581+05:30
ca991af5-983f-478f-b7fc-2753485f2a18	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	81f33170-40d2-4b22-940f-a6143e5e5c71	Warped front brake rotors, Sticking front brake caliper, Uneven front brake pad wear	\N	quoted	2026-07-29 23:53:43.495664+05:30
5e383e16-117c-437c-a209-925a9eae8360	887ae938-b723-4f0f-ab8c-b19169e4dc20	45d26afa-2db1-4540-ba4f-aad57374c64f	53a09e8b-82e0-438b-ad1c-6158be0e095f	Failed wiper motor (electrical failure), Faulty wiper motor relay or blown fuse, Malfunctioning wiper control module	\N	quoted	2026-07-30 01:31:55.32442+05:30
\.


--
-- Data for Name: quotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quotes (id, quote_request_id, garage_id, amount, currency, eta_days, status, created_at, details, parts_cost, labor_cost, total_cost, eta_note, comparison_label) FROM stdin;
00000000-0000-0000-0000-000000000041	00000000-0000-0000-0000-000000000030	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-22 13:28:54.385426+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
00000000-0000-0000-0000-000000000042	00000000-0000-0000-0000-000000000030	00000000-0000-0000-0000-000000000013	3450.00	USD	2	active	2026-07-22 13:13:54.385426+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
00000000-0000-0000-0000-000000000043	00000000-0000-0000-0000-000000000030	00000000-0000-0000-0000-000000000012	3200.00	USD	1	active	2026-07-22 12:58:54.385426+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
00000000-0000-0000-0000-000000000044	00000000-0000-0000-0000-000000000030	00000000-0000-0000-0000-000000000014	3600.00	USD	2	active	2026-07-22 12:38:54.385426+05:30	{"gst": 100, "image": "/assets/garage_4_1778071611328.png", "parts": 2000, "labour": 1300, "savings": 0, "warranty": "6 Months / 8,000 km", "ui_status": "viewed", "experience": "7+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Tomorrow, 1:00 PM"}	0.00	0.00	0.00	\N	fair
00000000-0000-0000-0000-000000000045	00000000-0000-0000-0000-000000000030	00000000-0000-0000-0000-000000000015	3280.00	USD	1	active	2026-07-22 11:38:54.385426+05:30	{"gst": 120, "image": "/assets/garage_5_1778071628253.png", "parts": 1780, "labour": 1180, "savings": 200, "warranty": "1 Year / 15,000 km", "ui_status": "viewed", "experience": "9+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 5:30 PM"}	0.00	0.00	0.00	\N	fair
00000000-0000-0000-0000-000000000046	00000000-0000-0000-0000-000000000030	00000000-0000-0000-0000-000000000018	3520.00	USD	2	active	2026-07-21 13:38:54.385426+05:30	{"gst": 180, "image": "/assets/garage_1_1778071156220.png", "parts": 1880, "labour": 1240, "savings": 80, "warranty": "6 Months / 10,000 km", "ui_status": "expired", "experience": "8+ Years", "consumables": 220, "pickup_drop": "Available", "availability": "Tomorrow, 11:30 AM"}	0.00	0.00	0.00	\N	fair
00000000-0000-0000-0000-000000000047	00000000-0000-0000-0000-000000000030	00000000-0000-0000-0000-000000000016	3250.00	USD	1	active	2026-07-22 10:38:54.385426+05:30	{"gst": 140, "image": "/assets/garage_2_1778071173295.png", "parts": 1760, "labour": 1170, "savings": 150, "warranty": "3 Months / 7,500 km", "ui_status": "open", "experience": "5+ Years", "consumables": 180, "pickup_drop": "Available", "availability": "Today, 8:00 PM"}	0.00	0.00	0.00	\N	fair
00000000-0000-0000-0000-000000000048	00000000-0000-0000-0000-000000000030	00000000-0000-0000-0000-000000000017	3180.00	USD	2	active	2026-07-22 08:38:54.385426+05:30	{"gst": 100, "image": "/assets/garage_3_1778071191282.png", "parts": 1720, "labour": 1160, "savings": 220, "warranty": "6 Months / 8,000 km", "ui_status": "open", "experience": "6+ Years", "consumables": 200, "pickup_drop": "Not Available", "availability": "Tomorrow, 9:30 AM"}	0.00	0.00	0.00	\N	fair
c9a3c8aa-c5e6-4de7-b6b2-fc84ad00cdfb	44a212f3-6df9-41ad-b8ed-a5686a8a56f8	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-22 15:19:22.529084+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
0112953a-1e67-4e6d-930f-ae4743b6f105	44a212f3-6df9-41ad-b8ed-a5686a8a56f8	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-22 15:19:22.534349+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
ea92bfc5-41f4-41a0-b250-8a1462347a52	44a212f3-6df9-41ad-b8ed-a5686a8a56f8	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-22 15:19:22.537867+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
3f25456b-1287-4740-87ee-b697cd80e7b3	b25d0c77-1da7-4022-9c61-a093616a171a	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-23 12:40:35.912855+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
34533395-fd69-4ba8-a4bf-ca8f04bb4cd6	b25d0c77-1da7-4022-9c61-a093616a171a	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-23 12:40:35.927376+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
ab3cd104-f48a-42a7-a8e0-c8611e61f141	b25d0c77-1da7-4022-9c61-a093616a171a	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-23 12:40:35.93228+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
4de69351-cdb4-495b-ac1f-072e8ac281fb	53b20097-5cf8-4321-b13b-3632d5dcdf31	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-24 11:29:15.542848+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
c1b1f502-0411-4bd5-bf44-d8ddb079b64d	53b20097-5cf8-4321-b13b-3632d5dcdf31	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-24 11:29:15.551149+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
921a3158-ec3c-4834-98aa-9a280a0199e3	53b20097-5cf8-4321-b13b-3632d5dcdf31	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-24 11:29:15.554895+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
003baeec-765a-4b8c-a9a6-edd91bac2736	a0b9d963-83d4-4d59-92bc-456f30c884a2	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-24 11:29:27.34837+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
d970510e-32fc-42bf-8c0f-1ebef866c5e2	a0b9d963-83d4-4d59-92bc-456f30c884a2	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-24 11:29:27.35221+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
e494b614-0857-4a3b-b875-137b49147dd6	a0b9d963-83d4-4d59-92bc-456f30c884a2	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-24 11:29:27.358275+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
72ab9c0d-22e5-4d69-98b5-a4804828ba29	8b3a3eee-1b19-4034-8f12-cccda3e1cf08	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-24 11:33:06.369646+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
6424d577-a1c2-4df0-9acb-579d91ecc7ca	8b3a3eee-1b19-4034-8f12-cccda3e1cf08	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-24 11:33:06.376742+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
4bd7262d-3cd8-48af-bcee-d512ceff8144	8b3a3eee-1b19-4034-8f12-cccda3e1cf08	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-24 11:33:06.381892+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
ff515cba-9015-4ac1-94b8-8bd879e97f63	82e3a14e-6cd6-4e0e-93f5-795fce69c628	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-27 12:57:21.525995+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
fb1d7dd6-fc62-4cb9-ad6b-49cf353aee33	82e3a14e-6cd6-4e0e-93f5-795fce69c628	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-27 12:57:21.575354+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
3b2f000c-fcf0-41aa-a871-de7626e17b8b	82e3a14e-6cd6-4e0e-93f5-795fce69c628	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-27 12:57:21.581045+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
02b8b10b-f79b-403d-9c79-ccb7793dfb22	c29d2924-61ef-4ba4-a4c6-4c4af757d1bd	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-27 23:13:02.402525+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
ba015354-c5e5-4caf-8e86-e0445d8c4e9d	c29d2924-61ef-4ba4-a4c6-4c4af757d1bd	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-27 23:13:02.419934+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
88918a94-d1d5-40f8-b500-6a1e4914c1a1	c29d2924-61ef-4ba4-a4c6-4c4af757d1bd	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-27 23:13:02.424067+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
e41d8b55-46fa-458f-9400-700f0d7a7627	6bc8a52d-119c-47c2-824f-8fb1ec968d1a	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-28 11:03:21.393496+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
a17ac77c-176f-4224-bec4-004aa7d0ed75	6bc8a52d-119c-47c2-824f-8fb1ec968d1a	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-28 11:03:21.404114+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
1fd1646e-5cd0-4973-9826-c37de297e59e	6bc8a52d-119c-47c2-824f-8fb1ec968d1a	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-28 11:03:21.408671+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
e73d9479-7d16-41b5-9417-94433cbed948	dd1e19c0-1a09-4035-9e17-ff05a32c22ce	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-29 08:32:49.030554+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
aaabfb3d-2ce1-4939-a295-9b9072ddfdc2	dd1e19c0-1a09-4035-9e17-ff05a32c22ce	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-29 08:32:49.049338+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
e0c97cc3-5d20-44ab-8266-e7ea1487c4d4	dd1e19c0-1a09-4035-9e17-ff05a32c22ce	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-29 08:32:49.055327+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
bbf11a4d-e425-49d6-9765-76dbd0365a97	a402c22f-bb80-4e29-be6c-624849626a0e	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-29 10:25:14.502581+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
035e3d5f-2f8b-4585-beb6-132066d0ec16	a402c22f-bb80-4e29-be6c-624849626a0e	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-29 10:25:14.511001+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
4f134454-aa04-4176-a609-554ab02ad2a2	a402c22f-bb80-4e29-be6c-624849626a0e	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-29 10:25:14.513842+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
1ab210fb-61b9-4999-ab57-57d4c64be4b3	882e6162-1f89-4291-a851-d337fd9f0412	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-29 10:26:13.199005+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
074ba2d7-80aa-46c2-9de8-32e46a974689	882e6162-1f89-4291-a851-d337fd9f0412	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-29 10:26:13.203301+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
78f273c2-c542-401d-bf0c-17528d3ac2d2	882e6162-1f89-4291-a851-d337fd9f0412	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-29 10:26:13.206254+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
7dba71f2-94ed-4de1-bca7-d1f2d6e2aec1	772f6d6b-f064-44e2-a8de-e56863eae4fc	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-29 10:28:00.503745+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
3daa4696-9dd9-497e-914a-e7051b60f62e	772f6d6b-f064-44e2-a8de-e56863eae4fc	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-29 10:28:00.507447+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
2958526d-b5d0-4eb1-8cd2-5d818e7dc3a1	772f6d6b-f064-44e2-a8de-e56863eae4fc	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-29 10:28:00.510163+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
a4ea4f9b-075f-4df5-833d-f34c86373c44	e2191fff-8da4-4d0c-a068-8f4832a906f0	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-29 10:37:06.473048+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
29139207-64b3-4e9c-b030-806e1d2b6f81	e2191fff-8da4-4d0c-a068-8f4832a906f0	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-29 10:37:06.477712+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
f57c8536-0929-4090-996a-f26f50ea3271	e2191fff-8da4-4d0c-a068-8f4832a906f0	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-29 10:37:06.480162+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
e9a23d15-e30f-456e-877b-c65af79040e6	d10e8139-bb32-4362-b367-95aff5e53aeb	00000000-0000-0000-0000-000000000011	3050.00	USD	1	active	2026-07-29 15:48:46.542811+05:30	{"gst": 150, "tag": "Express service", "image": "/assets/garage_2_1778071173295.png", "parts": 1650, "labour": 1050, "savings": 450, "warranty": "6 Months / 10,000 km", "ui_status": "new", "experience": "8+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 6:00 PM"}	0.00	0.00	0.00	\N	fair
46f216f4-7eeb-4122-932c-70c890939f16	d10e8139-bb32-4362-b367-95aff5e53aeb	00000000-0000-0000-0000-000000000012	3450.00	USD	2	active	2026-07-29 15:48:46.636734+05:30	{"gst": 200, "tag": "Specialized repair", "image": "/assets/garage_3_1778071191282.png", "parts": 1900, "labour": 1250, "savings": 250, "warranty": "3 Months / 5,000 km", "ui_status": "new", "experience": "6+ Years", "consumables": 250, "pickup_drop": "Not Available", "availability": "Tomorrow, 10:00 AM"}	0.00	0.00	0.00	\N	fair
731c11ca-a995-48ea-98cc-820fb9787683	d10e8139-bb32-4362-b367-95aff5e53aeb	00000000-0000-0000-0000-000000000013	3200.00	USD	1	active	2026-07-29 15:48:46.645706+05:30	{"gst": 100, "tag": "Free pickup & drop", "image": "/assets/garage_1_1778071156220.png", "parts": 1700, "labour": 1200, "savings": 150, "warranty": "2 Years / 20,000 km", "ui_status": "new", "experience": "10+ Years", "consumables": 200, "pickup_drop": "Available", "availability": "Today, 7:30 PM"}	0.00	0.00	0.00	\N	fair
1e2a9652-b204-47a1-81b9-f2a3c0c8aef5	bc6a684f-1889-483c-b740-5539e5f80b42	00000000-0000-0000-0000-000000000011	15.00	USD	\N	active	2026-07-29 23:59:15.242748+05:30	{"remarks": ""}	10.00	5.00	15.00	2 days 	fair
a9325185-26e5-4655-be3e-cd92957451dc	ca991af5-983f-478f-b7fc-2753485f2a18	00000000-0000-0000-0000-000000000011	14.00	USD	\N	active	2026-07-30 00:24:36.61385+05:30	{"remarks": ""}	10.00	4.00	14.00	2 days	fair
73178659-a06f-4a01-b724-83c9ea491d64	5e383e16-117c-437c-a209-925a9eae8360	00000000-0000-0000-0000-000000000011	133.00	USD	\N	active	2026-07-30 01:33:32.427309+05:30	{"remarks": ""}	123.00	10.00	133.00	3 days	fair
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, user_id, token_hash, expires_at, created_at) FROM stdin;
08cc69a7-7128-47b0-81b4-a0284aa4a946	7d06ddc5-7fb8-4402-8624-a7b22f53633e	06b923af6a15e233174db06f3346285b40fb2ad7ae025b283bc99f7991b85533	2026-08-02 16:37:03.123+05:30	2026-07-26 16:37:03.126028+05:30
00280a8e-0ced-4d07-915c-de311b298e8b	7d06ddc5-7fb8-4402-8624-a7b22f53633e	7e8f1b53a61bdf092265659337512ae65bb5b1235e0d5f632c1137cf03a0b6c1	2026-08-02 16:38:25.058+05:30	2026-07-26 16:38:25.059713+05:30
38806c13-96ce-4225-a70f-846d528ea052	887ae938-b723-4f0f-ab8c-b19169e4dc20	bfbbf741623c61126745885e4416c9f0a1056a23a6a7fcf7382b629a7aeea43e	2026-07-29 16:28:48.352+05:30	2026-07-22 16:28:48.356848+05:30
557ace63-3726-4dcc-a82e-165d5b740b95	887ae938-b723-4f0f-ab8c-b19169e4dc20	8adab472625cd6d72abef0471af3e5a2c749cf9ab522ef7964a98d2751edc7fe	2026-08-02 16:39:57.783+05:30	2026-07-26 16:39:57.785219+05:30
45b32e40-1cf5-4425-be40-35a7000c9457	f1493215-ef42-40ec-9079-064e3665b4c7	c26ad0cf1ba033423da3394f8da1b0852578dd52ca7ef95bf6a125342d8efbe2	2026-08-06 11:01:38.19+05:30	2026-07-30 11:01:38.191393+05:30
c5188ff3-bde8-4d12-9fbc-2f53fadb1faf	887ae938-b723-4f0f-ab8c-b19169e4dc20	a11a043f70b749e418abf7034d3e832cf797e21f15cb2257479f13fcf3aa2634	2026-08-06 11:20:56.858+05:30	2026-07-30 11:20:56.859984+05:30
f86c70c0-bf1a-4a97-8de4-6eadff0f9f15	887ae938-b723-4f0f-ab8c-b19169e4dc20	a836f5fe5e274ec81245e514397f21b414065278ccf24b214b00a371e8114ca1	2026-08-02 19:37:48.765+05:30	2026-07-26 19:37:48.765977+05:30
0c17f539-752d-425b-a12f-c6f46df999ce	f1493215-ef42-40ec-9079-064e3665b4c7	8af1b8dddd913e11c5072e1882cc73fe35a777e2f433d9024106c62fbc1943c7	2026-08-06 13:15:19.65+05:30	2026-07-30 13:15:19.651119+05:30
e5a93d4e-8029-4085-860d-744830ba2486	00000000-0000-0000-0000-000000000003	7997e126756bbd63c9a501ed67973233d01f364a240971c879e1b90aad2f3e00	2026-08-06 14:28:29.734+05:30	2026-07-30 14:28:29.735341+05:30
164a461e-1b58-495a-8b53-bd67c8303dac	7d06ddc5-7fb8-4402-8624-a7b22f53633e	4d27f86bc76e319b44419f9fae3a57c50c4d71b83ffd0d7c945241a9be547301	2026-08-03 11:58:51.786+05:30	2026-07-27 11:58:51.800996+05:30
fc99321c-47c5-4d04-973e-4854d0ea58e7	887ae938-b723-4f0f-ab8c-b19169e4dc20	d56c7d68af9db7d5f9857fc844d345621f276f2ad174030b08c26990fb3afebc	2026-08-06 14:50:52.079+05:30	2026-07-30 14:50:52.08016+05:30
d4a2692e-beaa-4754-a3d5-47c6c11589ab	4ffbfd29-a2bb-40cb-903e-66ad95b76c9f	c3c31f01d705940db08141b6feb7998a5535c40bab6f595c776416176bc1ad43	2026-08-06 15:41:32.173+05:30	2026-07-30 15:41:32.174776+05:30
45e5edf2-63ab-415f-b17f-f00e16d8de55	4ffbfd29-a2bb-40cb-903e-66ad95b76c9f	7435cb6bbba90be776bd4f4a1d54c9b2d5c0f18b762c5cf4f868a428a92dafe8	2026-08-06 16:02:14.918+05:30	2026-07-30 16:02:14.920073+05:30
f343f17a-e7cb-4be9-967a-d787a6c466f0	4ffbfd29-a2bb-40cb-903e-66ad95b76c9f	07b4f851ff141275eae7dd97183728bf91ec0ea5071de6a11dffa872fac265f0	2026-08-06 16:19:46.607+05:30	2026-07-30 16:19:46.608108+05:30
b0b3bcce-1c2b-4a0e-bbf3-7a24123864ec	7d06ddc5-7fb8-4402-8624-a7b22f53633e	c3e50dbc1bd7ca9a71b472f02fa888a68cbedf8d735674e1f6bdaea1a2122de5	2026-08-03 13:47:56.198+05:30	2026-07-27 13:47:56.203222+05:30
e07ed961-1fac-4121-bf6f-c089b8360ca6	4ffbfd29-a2bb-40cb-903e-66ad95b76c9f	1610dd3be2eb2433aa0905fd69797e80504102989120e19a60a562e5a63f3729	2026-08-06 17:13:55.551+05:30	2026-07-30 17:13:55.553031+05:30
2db53481-0e16-47d2-a23f-21c91c35a53c	4ffbfd29-a2bb-40cb-903e-66ad95b76c9f	2b4e294778fc8558ab866a498464ea453f075ff3be6bb198534f03ca9f0a7d71	2026-08-06 17:36:51.054+05:30	2026-07-30 17:36:51.056364+05:30
5f4d7e0e-1be5-4403-9e11-00035f32327e	887ae938-b723-4f0f-ab8c-b19169e4dc20	e7d5ec977720633fc18a9af5464c6cc7da140bf1ff86fd39dd320ef8afd5f1d8	2026-08-03 17:16:36.033+05:30	2026-07-27 17:16:36.036166+05:30
a074929e-5a67-4c69-b55e-0f2a3bad88e3	887ae938-b723-4f0f-ab8c-b19169e4dc20	a9a70ab507b21ec2375ba6ab9e43da9a90be5b5203025b17f72d17a950b3a071	2026-08-05 10:36:31.851+05:30	2026-07-29 10:36:31.852493+05:30
f0fdb288-2b53-4ef4-9c1b-01857bf6055f	00000000-0000-0000-0000-000000000003	aa47ade3d7aeabe4c8ee2a872ceefdac69d235210c5fa980b1f6ed861c2392a9	2026-08-05 13:06:13.709+05:30	2026-07-29 13:06:13.72455+05:30
87e6e525-af8c-4507-8477-1161d3cce66d	00000000-0000-0000-0000-000000000003	c29d6d1f2735feb04e73916f8af9dcf661d36ac737724999b6f930acc4bb8f71	2026-08-05 13:58:05.082+05:30	2026-07-29 13:58:05.087129+05:30
4f69458f-01d5-4119-a707-5dfe7a819dc5	00000000-0000-0000-0000-000000000003	d07bad7e5db0887f859cb4e542402ae74c3abc48f44fe02f996e925237bbb232	2026-08-05 15:49:07.074+05:30	2026-07-29 15:49:07.079146+05:30
87119b73-dc31-4455-a10a-ab6ea6ea8eac	887ae938-b723-4f0f-ab8c-b19169e4dc20	7a7e99a0dfcbf2deb2ad07c2e464c80a34c5b863a0eac150227de0bbf830b587	2026-08-01 19:30:11.784+05:30	2026-07-25 19:30:11.786339+05:30
45d8dbbd-74a6-4e81-b296-05fbdc856707	00000000-0000-0000-0000-000000000003	4b6d7fd5f062ea4e1f3b34c91c05cc0cf1826283706ca377e7bc9e435c9f3a98	2026-08-05 16:18:12.332+05:30	2026-07-29 16:18:12.337064+05:30
d7d4bd12-311d-4ff3-88d0-747ed55511fd	00000000-0000-0000-0000-000000000003	964cd3330bfc0d71855a9be311199290b43654eeb6c8c0f4f4ae326fbabb89b0	2026-08-05 18:30:45.795+05:30	2026-07-29 18:30:45.796679+05:30
65632ffb-ceb4-4921-975b-a7a0449998c9	4ffbfd29-a2bb-40cb-903e-66ad95b76c9f	38de13fb764172b5697c6e39d530447c651214bc96d962cccccecb3618a0db7f	2026-08-05 18:32:43.934+05:30	2026-07-29 18:32:43.935744+05:30
10efe173-4a17-4e60-8b31-4f152b8d97c4	887ae938-b723-4f0f-ab8c-b19169e4dc20	ff43e9648810d034a57cfb9cfddf58af73b8ec4a64c234b187e508820382181f	2026-08-02 15:36:32.172+05:30	2026-07-26 15:36:32.173686+05:30
2885c090-8627-463b-940f-ff0b9e262358	00000000-0000-0000-0000-000000000003	bea48aedab6c122ab2c08b73775068d26adce9567894f93b4a5da1b818c25787	2026-08-05 22:44:44.327+05:30	2026-07-29 22:44:44.329312+05:30
687bbba2-3413-4a46-9b2d-4bd13723627c	00000000-0000-0000-0000-000000000003	d529dd2aeaea1744815af89ee0e07140125af26912643173b9ac6b363300fd3d	2026-08-06 00:19:17.099+05:30	2026-07-30 00:19:17.101126+05:30
4f633c45-1c96-4423-aa91-c1479f8f1653	00000000-0000-0000-0000-000000000003	7ed2094748d685b2500bb7be335b11ad71190b3bc9591ca8b0fee3d1d31c57a2	2026-08-06 00:44:40.148+05:30	2026-07-30 00:44:40.148933+05:30
c6873d42-0b9b-4aa9-b541-1e31ea582ee8	00000000-0000-0000-0000-000000000003	98da4abeb028ba26a05b808f107387fd6fbfb55a3f13ab0afcf365aad31eb7b6	2026-08-06 00:55:53.114+05:30	2026-07-30 00:55:53.11551+05:30
07d38aa3-cea8-48ee-bd63-36aa29e00bde	887ae938-b723-4f0f-ab8c-b19169e4dc20	86acdedd205ec9c7eafc8686b1c675467c8f232a05007d135ce845001e1c1917	2026-08-06 01:28:34.76+05:30	2026-07-30 01:28:34.762024+05:30
7fdea932-d1a3-43c5-86db-38da7ccb8433	00000000-0000-0000-0000-000000000003	5022d435866e7acc642f19934a0230b176a9acbf4b9a7dbe1a8d395fe3fd2651	2026-08-06 01:28:48.133+05:30	2026-07-30 01:28:48.134469+05:30
b5780944-e174-43c7-aefd-54284afa9cfc	00000000-0000-0000-0000-000000000003	87c7c0a96fa5ba02f73b1e5b8522983ba62be580afc9bcf7da27522543e07e55	2026-08-06 01:32:39.165+05:30	2026-07-30 01:32:39.166606+05:30
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, booking_id, customer_id, garage_id, rating_overall, rating_price, rating_quality, rating_time, rating_behavior, comment, is_verified, created_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, code, name, created_at, updated_at) FROM stdin;
039f268d-1057-42a5-96eb-8544736f09d7	garage	Garage Owner	2026-07-22 13:38:53.488488+05:30	2026-07-22 13:38:53.488488+05:30
ac3b4a17-7b6b-4bc5-9077-0c56f5210cbe	vendor	Vendor	2026-07-22 13:38:53.488488+05:30	2026-07-22 13:38:53.488488+05:30
260a1b47-d44a-41b8-bd57-477da1375a1b	admin	Administrator	2026-07-22 13:38:53.488488+05:30	2026-07-22 13:38:53.488488+05:30
d0fd510c-8cff-4bce-a671-bfe673be4ff9	user	User	2026-07-22 13:38:53.488488+05:30	2026-07-26 23:51:39.510133+05:30
\.


--
-- Data for Name: runtime_app_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.runtime_app_config (key, value_json, updated_at) FROM stdin;
app_identity	{"name": "WrectifAI", "logoUrl": "https://wrectifai.s3.ap-south-1.amazonaws.com/Assests+/Logo.jpeg", "tagline": "Service. Quotes. Simplified."}	2026-07-26 23:51:39.518103+05:30
\.


--
-- Data for Name: sellers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sellers (id, seller_type, user_id, garage_id, approval_status, created_at) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, garage_id, name, description, price, duration_mins, category, is_active, created_at, updated_at) FROM stdin;
c80fba83-c8f4-46f4-b158-50957d61aac5	00000000-0000-0000-0000-000000000011	Basic Oil Change	Engine oil and filter replacement	1500.00	45	Maintenance	t	2026-07-23 10:40:58.147818+05:30	2026-07-23 10:40:58.147818+05:30
7c6660bc-9ce6-4fc2-b628-0044af3ce2fc	00000000-0000-0000-0000-000000000011	Brake Pad Replacement	Front and rear brake pad replacement	2500.00	90	Repairs	t	2026-07-23 10:40:58.200421+05:30	2026-07-23 10:40:58.200421+05:30
fb56fb6d-6dcf-4d8a-8a42-ff4ede678290	00000000-0000-0000-0000-000000000011	Comprehensive Checkup	Full 50-point vehicle inspection	999.00	60	Inspection	t	2026-07-23 10:40:58.203451+05:30	2026-07-23 10:40:58.203451+05:30
099b42b3-a489-416a-a5ad-1f4f1cc9a517	00000000-0000-0000-0000-000000000012	Basic Oil Change	Engine oil and filter replacement	1500.00	45	Maintenance	t	2026-07-23 10:40:58.210093+05:30	2026-07-23 10:40:58.210093+05:30
ffc5c0ef-2dd8-4303-979f-dde2a03232d4	00000000-0000-0000-0000-000000000012	Brake Pad Replacement	Front and rear brake pad replacement	2500.00	90	Repairs	t	2026-07-23 10:40:58.213815+05:30	2026-07-23 10:40:58.213815+05:30
f85de36d-5c49-41b3-99d4-cf5764c50f2e	00000000-0000-0000-0000-000000000012	Comprehensive Checkup	Full 50-point vehicle inspection	999.00	60	Inspection	t	2026-07-23 10:40:58.216805+05:30	2026-07-23 10:40:58.216805+05:30
5b16b3c4-7da9-4e1c-9792-eabb157b44cc	00000000-0000-0000-0000-000000000013	Basic Oil Change	Engine oil and filter replacement	1500.00	45	Maintenance	t	2026-07-23 10:40:58.221335+05:30	2026-07-23 10:40:58.221335+05:30
1370f5e1-f7e6-487a-b9aa-b54ef3750d70	00000000-0000-0000-0000-000000000013	Brake Pad Replacement	Front and rear brake pad replacement	2500.00	90	Repairs	t	2026-07-23 10:40:58.225413+05:30	2026-07-23 10:40:58.225413+05:30
d321bc58-9c77-480f-9cb7-e15496416f44	00000000-0000-0000-0000-000000000013	Comprehensive Checkup	Full 50-point vehicle inspection	999.00	60	Inspection	t	2026-07-23 10:40:58.229455+05:30	2026-07-23 10:40:58.229455+05:30
a6b4756e-0e61-49c4-8224-b06d24cbcbdd	00000000-0000-0000-0000-000000000014	Basic Oil Change	Engine oil and filter replacement	1500.00	45	Maintenance	t	2026-07-23 10:40:58.233702+05:30	2026-07-23 10:40:58.233702+05:30
7b9452c0-7f08-456a-b9a1-aaacc097a93e	00000000-0000-0000-0000-000000000014	Brake Pad Replacement	Front and rear brake pad replacement	2500.00	90	Repairs	t	2026-07-23 10:40:58.236729+05:30	2026-07-23 10:40:58.236729+05:30
d835a1e9-1994-4361-8a71-e365121ea90c	00000000-0000-0000-0000-000000000014	Comprehensive Checkup	Full 50-point vehicle inspection	999.00	60	Inspection	t	2026-07-23 10:40:58.239746+05:30	2026-07-23 10:40:58.239746+05:30
f9080ce9-37d0-4c31-9ac1-4d2df0afd781	00000000-0000-0000-0000-000000000016	Basic Oil Change	Engine oil and filter replacement	1500.00	45	Maintenance	t	2026-07-23 10:40:58.243919+05:30	2026-07-23 10:40:58.243919+05:30
beb13236-0bc8-4e48-be16-46384ad30b9a	00000000-0000-0000-0000-000000000016	Brake Pad Replacement	Front and rear brake pad replacement	2500.00	90	Repairs	t	2026-07-23 10:40:58.246951+05:30	2026-07-23 10:40:58.246951+05:30
959cd887-af00-424d-bb3d-e266607ea79c	00000000-0000-0000-0000-000000000016	Comprehensive Checkup	Full 50-point vehicle inspection	999.00	60	Inspection	t	2026-07-23 10:40:58.250001+05:30	2026-07-23 10:40:58.250001+05:30
6bbfda21-aa95-4e43-a2d4-48e2efcc8b17	00000000-0000-0000-0000-000000000017	Basic Oil Change	Engine oil and filter replacement	1500.00	45	Maintenance	t	2026-07-23 10:40:58.25442+05:30	2026-07-23 10:40:58.25442+05:30
5b175d64-c0ff-42b3-bb86-8cad39dde2a2	00000000-0000-0000-0000-000000000017	Brake Pad Replacement	Front and rear brake pad replacement	2500.00	90	Repairs	t	2026-07-23 10:40:58.257645+05:30	2026-07-23 10:40:58.257645+05:30
a43ef2bc-c92e-46fa-8092-505fb0fde25d	00000000-0000-0000-0000-000000000017	Comprehensive Checkup	Full 50-point vehicle inspection	999.00	60	Inspection	t	2026-07-23 10:40:58.261437+05:30	2026-07-23 10:40:58.261437+05:30
a9fef9e0-ece4-4838-b4e3-aa8ed9e939a9	00000000-0000-0000-0000-000000000019	Basic Oil Change	Engine oil and filter replacement	1500.00	45	Maintenance	t	2026-07-23 10:40:58.266066+05:30	2026-07-23 10:40:58.266066+05:30
ca81075d-36ff-4df8-babc-80ff2d32b6a2	00000000-0000-0000-0000-000000000019	Brake Pad Replacement	Front and rear brake pad replacement	2500.00	90	Repairs	t	2026-07-23 10:40:58.269241+05:30	2026-07-23 10:40:58.269241+05:30
af4a0343-c16e-4acb-86ca-87d4483fe05e	00000000-0000-0000-0000-000000000019	Comprehensive Checkup	Full 50-point vehicle inspection	999.00	60	Inspection	t	2026-07-23 10:40:58.272031+05:30	2026-07-23 10:40:58.272031+05:30
64d442fe-0100-42cf-8f0b-7f0b0820bf59	00000000-0000-0000-0000-000000000020	Basic Oil Change	Engine oil and filter replacement	1500.00	45	Maintenance	t	2026-07-23 10:40:58.27607+05:30	2026-07-23 10:40:58.27607+05:30
48196917-c471-4c29-a899-145e10b93d33	00000000-0000-0000-0000-000000000020	Brake Pad Replacement	Front and rear brake pad replacement	2500.00	90	Repairs	t	2026-07-23 10:40:58.279886+05:30	2026-07-23 10:40:58.279886+05:30
387bdba0-b06e-47f3-8083-a064f8b52db3	00000000-0000-0000-0000-000000000020	Comprehensive Checkup	Full 50-point vehicle inspection	999.00	60	Inspection	t	2026-07-23 10:40:58.28267+05:30	2026-07-23 10:40:58.28267+05:30
f6f50323-e686-4ab8-bff9-6894bd4d1f8f	00000000-0000-0000-0000-000000000015	Basic Oil Change	Engine oil and filter replacement	1500.00	45	Maintenance	t	2026-07-23 10:40:58.286247+05:30	2026-07-23 10:40:58.286247+05:30
17006fb1-d858-4f56-928f-1f8c84074a48	00000000-0000-0000-0000-000000000015	Brake Pad Replacement	Front and rear brake pad replacement	2500.00	90	Repairs	t	2026-07-23 10:40:58.289503+05:30	2026-07-23 10:40:58.289503+05:30
370735da-504e-490f-9408-8cbd903d9d67	00000000-0000-0000-0000-000000000015	Comprehensive Checkup	Full 50-point vehicle inspection	999.00	60	Inspection	t	2026-07-23 10:40:58.292082+05:30	2026-07-23 10:40:58.292082+05:30
57bca356-c474-4997-a581-d9019bbd6c8d	00000000-0000-0000-0000-000000000021	Basic Oil Change	Engine oil and filter replacement	1500.00	45	Maintenance	t	2026-07-23 10:40:58.29615+05:30	2026-07-23 10:40:58.29615+05:30
04a95a57-2305-4056-9284-fa4e1f7fd014	00000000-0000-0000-0000-000000000021	Brake Pad Replacement	Front and rear brake pad replacement	2500.00	90	Repairs	t	2026-07-23 10:40:58.298987+05:30	2026-07-23 10:40:58.298987+05:30
3ecfedc2-f0ab-4367-8800-444224b37776	00000000-0000-0000-0000-000000000021	Comprehensive Checkup	Full 50-point vehicle inspection	999.00	60	Inspection	t	2026-07-23 10:40:58.301419+05:30	2026-07-23 10:40:58.301419+05:30
2fdc4ca3-965a-44a0-9377-8ea555d80e8d	00000000-0000-0000-0000-000000000018	Basic Oil Change	Engine oil and filter replacement	1500.00	45	Maintenance	t	2026-07-23 10:40:58.306828+05:30	2026-07-23 10:40:58.306828+05:30
6875c1f1-3522-4db4-b6ad-3500d26934a0	00000000-0000-0000-0000-000000000018	Brake Pad Replacement	Front and rear brake pad replacement	2500.00	90	Repairs	t	2026-07-23 10:40:58.310106+05:30	2026-07-23 10:40:58.310106+05:30
c8cb7ae5-c604-4f92-ad6b-c73069437468	00000000-0000-0000-0000-000000000018	Comprehensive Checkup	Full 50-point vehicle inspection	999.00	60	Inspection	t	2026-07-23 10:40:58.312911+05:30	2026-07-23 10:40:58.312911+05:30
debbe8d1-3090-4e7a-a354-496b81348168	00000000-0000-0000-0000-000000000022	Basic Oil Change	Engine oil and filter replacement	1500.00	45	Maintenance	t	2026-07-23 10:40:58.31679+05:30	2026-07-23 10:40:58.31679+05:30
4fa6899b-ce71-4c08-96b7-47f8806eddc5	00000000-0000-0000-0000-000000000022	Brake Pad Replacement	Front and rear brake pad replacement	2500.00	90	Repairs	t	2026-07-23 10:40:58.320537+05:30	2026-07-23 10:40:58.320537+05:30
d96591d0-7a81-450d-a949-cb23c32e9874	00000000-0000-0000-0000-000000000022	Comprehensive Checkup	Full 50-point vehicle inspection	999.00	60	Inspection	t	2026-07-23 10:40:58.323467+05:30	2026-07-23 10:40:58.323467+05:30
\.


--
-- Data for Name: sms_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sms_events (id, user_id, phone, event_type, status, meta, created_at) FROM stdin;
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_tickets (id, customer_user_id, subject, description, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ui_content; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ui_content (id, tenant_id, module, page, locale, version, content, updated_at) FROM stdin;
3	default	auth	verify	en-US	1	{"form": {"title": "Verify OTP", "ctaLabel": "Verify and Continue", "otpLabel": "OTP", "otpPlaceholder": "Please enter 6 digit OTP", "ctaLoadingLabel": "Verifying...", "subtitleTemplate": "Please enter 6 digit OTP sent to {phone}."}, "hero": {"body": "Security check for your account session.", "title": "Verify Your Secure Access.", "kicker": "AUTOMOTIVE INTELLIGENCE"}, "links": {"backToPrefix": "Back to", "backToLoginCta": "Login", "backToRegisterCta": "Register"}, "errors": {"otpInvalid": "OTP must be 6 digits", "unexpected": "Unexpected error", "verifyFailed": "Unable to verify OTP"}, "appName": "WrectifAI", "authModeLabel": "Phone + OTP authentication"}	2026-07-26 23:51:39.52226+05:30
4	default	user	sidebar	en-US	1	{"nav": {"support": "Support", "payments": "Payments", "settings": "Settings", "dashboard": "Dashboard", "my-garage": "My Garage", "spare-parts": "Spare Parts", "ai-diagnosis": "AI Diagnosis", "quotes-bookings": "Quotes & Bookings"}, "logoUrl": "https://wrectifai.s3.ap-south-1.amazonaws.com/Assests+/Logo.jpeg", "brandName": "PrecisionCurator", "brandTagline": "MASTER TECHNICIAN", "quickScanLabel": "Quick Scan"}	2026-07-26 23:51:39.52226+05:30
5	default	user	dashboard	en-US	1	{"title": "Dashboard", "kicker": "Service Hub", "description": "Track your complete service experience across diagnostics, bookings, and payments.", "emptyStateBody": "This section will show summary cards, pending tasks, and activity feed.", "emptyStateTitle": "Dashboard Insights Coming Soon"}	2026-07-26 23:51:39.52226+05:30
6	default	user	my-garage	en-US	1	{"hero": {"title": "2022 BMW M3", "subtitle": "Competition Package - xDrive", "odometerLabel": "Current Odometer", "odometerValue": "12,482 mi"}, "forms": {"vinLabel": "VIN", "makeLabel": "Make *", "trimLabel": "Trim", "yearLabel": "Year *", "modelLabel": "Model *", "plateLabel": "Plate Number", "cancelLabel": "Cancel", "mileageLabel": "Mileage", "rcInputLabel": "Upload RC Text", "fuelTypeLabel": "Fuel Type *", "addVehicleTitle": "Add New Vehicle", "engineTypeLabel": "Engine Type", "saveVehicleLabel": "Save Vehicle", "rcInputPlaceholder": "Paste RC text here to auto-fill details...", "selectVehicleLabel": "Select", "processRcErrorLabel": "Failed to process RC.", "addVehicleErrorLabel": "Failed to add vehicle.", "loadHistoryErrorLabel": "Failed to load service history.", "addVehicleSuccessLabel": "Vehicle added successfully.", "applyRcSuggestionLabel": "Apply RC Suggestion", "loadVehiclesErrorLabel": "Failed to load vehicles.", "requiredFieldsErrorLabel": "Make, model, year, and fuel type are required."}, "header": {"title": "My Garage", "description": "Manage your fleet and track precision maintenance schedules with AI-driven insights.", "uploadRcLabel": "Upload RC", "addVehicleLabel": "Add New Vehicle", "activeFleetLabel": "Active Fleet", "serviceHistoryLabel": "Service History", "viewAllHistoryLabel": "View All History", "registerVehicleLabel": "Register Vehicle"}, "states": {"noHistoryLabel": "No service history yet for this vehicle.", "noVehiclesLabel": "No vehicles found. Add your first vehicle.", "loadingHistoryLabel": "Loading service history...", "loadingVehiclesLabel": "Loading vehicles..."}, "topBar": {"sectionLabel": "Service Hub", "searchPlaceholder": "Search components, VINs or fleet...", "bookAppointmentLabel": "Book Appointment"}, "promotion": {"title": "Extended Protection", "ctaLabel": "Explore Extensions", "description": "Upgrade your drivetrain warranty for another 24 months with exclusive partner rates and peace of mind coverage."}, "fleetCards": [{"statusLabel": "Optimal", "vehicleMeta": "Sedan - Alpine White", "vehicleName": "2022 BMW M3", "completionPercentLabel": "98%"}, {"statusLabel": "Service Due", "vehicleMeta": "SUV - Magnetic Gray", "vehicleName": "2018 Toyota RAV4", "completionPercentLabel": "62%"}], "serviceHistory": [{"title": "Routine Oil Change", "subtitle": "Synthetic 0W-30 - BMW Service Center", "dateLabel": "Oct 12, 2023", "statusLabel": "Completed"}, {"title": "Brake Pad Replacement", "subtitle": "Ceramic Front Pads - Specialized Auto", "dateLabel": "Aug 04, 2023", "statusLabel": "Completed"}, {"title": "Tire Rotation & Balancing", "subtitle": "All 4 Wheels - Michelin Certified Service", "dateLabel": "Jun 15, 2023", "statusLabel": "Completed"}]}	2026-07-26 23:51:39.52226+05:30
7	default	user	ai-diagnosis	en-US	1	{"title": "AI Diagnosis", "kicker": "Service Hub", "description": "Describe issues and get guided, AI-powered diagnosis recommendations.", "emptyStateBody": "Symptom input, media upload, and guided checks will appear here.", "emptyStateTitle": "AI Diagnosis Coming Soon"}	2026-07-26 23:51:39.52226+05:30
8	default	user	quotes-bookings	en-US	1	{"title": "Quotes & Bookings", "kicker": "Service Hub", "description": "Compare garage quotations and manage your appointments in one place.", "emptyStateBody": "Quote comparison and booking timeline modules will be added here.", "emptyStateTitle": "Quotes & Bookings Coming Soon"}	2026-07-26 23:51:39.52226+05:30
9	default	user	spare-parts	en-US	1	{"title": "Spare Parts", "kicker": "Service Hub", "description": "Browse recommended parts and track part requests from your service flow.", "emptyStateBody": "Parts catalog, filters, and order status components will be added here.", "emptyStateTitle": "Spare Parts Marketplace Coming Soon"}	2026-07-26 23:51:39.52226+05:30
10	default	user	payments	en-US	1	{"title": "Payments", "kicker": "Service Hub", "description": "View invoices, receipts, and payment status for all your service orders.", "emptyStateBody": "Invoice history, payment methods, and transaction details will be shown here.", "emptyStateTitle": "Payments Center Coming Soon"}	2026-07-26 23:51:39.52226+05:30
11	default	user	settings	en-US	1	{"title": "Settings", "kicker": "Service Hub", "description": "Manage profile preferences, notifications, and app-level configurations.", "emptyStateBody": "Account and preference controls will be available in this section.", "emptyStateTitle": "Settings Panel Coming Soon"}	2026-07-26 23:51:39.52226+05:30
12	default	user	support	en-US	1	{"title": "Support", "kicker": "Service Hub", "description": "Get help, raise issues, and connect with service support quickly.", "emptyStateBody": "Help topics, ticket tracking, and support contact options will be available here.", "emptyStateTitle": "Support Center Coming Soon"}	2026-07-26 23:51:39.52226+05:30
1	default	auth	login	en-US	1	{"form": {"title": "Welcome Back", "subtitle": "Login with your 10-digit phone number.", "phoneLabel": "Phone Number *", "sendOtpLabel": "Send OTP", "sendingOtpLabel": "Sending OTP...", "phonePlaceholder": "9876543210", "socialDividerLabel": "or continue with", "continueWithAppleLabel": "Continue with Apple", "continueWithGoogleLabel": "Continue with Google"}, "hero": {"body": "Join the elite ecosystem of automotive specialists and car enthusiasts driving the future of service management.", "title": "Experience Surgical Precision in Car Care.", "kicker": "AUTOMOTIVE INTELLIGENCE"}, "links": {"needAccountCta": "Register", "needAccountPrefix": "Need an account?"}, "errors": {"unexpected": "Unexpected error", "phoneInvalid": "Phone number must be 10 digits", "sendOtpFailed": "Unable to send OTP"}, "appName": "WrectifAI", "authModeLabel": "Phone + OTP authentication"}	2026-07-26 23:51:39.52226+05:30
2	default	auth	register	en-US	1	{"form": {"title": "Create Account", "subtitle": "Start your journey with WrectifAI precision today.", "phoneLabel": "Phone Number *", "termsLabel": "I agree to the Terms and Privacy Policy *", "fullNameLabel": "Full Name *", "sendingOtpLabel": "Sending OTP...", "phonePlaceholder": "9876543210", "createAccountLabel": "Create Account", "socialDividerLabel": "or continue with", "fullNamePlaceholder": "John Doe", "continueWithAppleLabel": "Continue with Apple", "continueWithGoogleLabel": "Continue with Google"}, "hero": {"body": "Join the elite ecosystem of automotive specialists and car enthusiasts driving the future of service management.", "title": "Experience Surgical Precision in Car Care.", "kicker": "AUTOMOTIVE INTELLIGENCE"}, "links": {"haveAccountCta": "Login", "haveAccountPrefix": "Already have an account?"}, "errors": {"unexpected": "Unexpected error", "phoneInvalid": "Phone number must be 10 digits", "sendOtpFailed": "Unable to send OTP", "termsRequired": "Please accept terms to continue", "fullNameRequired": "Full name is required"}, "appName": "WrectifAI", "authModeLabel": "Phone + OTP authentication"}	2026-07-26 23:51:39.52226+05:30
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, user_id, role_id, created_at, updated_at) FROM stdin;
ce96ab83-0cdb-48be-9755-e8f5367f8a06	00000000-0000-0000-0000-000000000001	d0fd510c-8cff-4bce-a671-bfe673be4ff9	2026-07-22 13:38:54.333953+05:30	2026-07-22 13:38:54.333953+05:30
89c253b7-f007-4b6b-818d-9146b7223167	00000000-0000-0000-0000-000000000003	039f268d-1057-42a5-96eb-8544736f09d7	2026-07-22 13:38:54.357753+05:30	2026-07-22 13:38:54.357753+05:30
bb8c5f08-4f83-4af9-9aae-c662a22e0798	887ae938-b723-4f0f-ab8c-b19169e4dc20	d0fd510c-8cff-4bce-a671-bfe673be4ff9	2026-07-22 14:12:57.169248+05:30	2026-07-22 14:12:57.169248+05:30
f6175890-cd99-4681-9f66-a6f24c997515	7d06ddc5-7fb8-4402-8624-a7b22f53633e	d0fd510c-8cff-4bce-a671-bfe673be4ff9	2026-07-26 16:37:02.976203+05:30	2026-07-26 16:37:02.976203+05:30
b868bb54-2573-4283-b875-d974e4b7ea80	4ffbfd29-a2bb-40cb-903e-66ad95b76c9f	260a1b47-d44a-41b8-bd57-477da1375a1b	2026-07-29 18:18:04.595023+05:30	2026-07-29 18:18:04.595023+05:30
\.


--
-- Data for Name: user_social_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_social_accounts (id, user_id, provider, social_subject, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, mobile_number, password_hash, name, status, created_at, updated_at) FROM stdin;
00000000-0000-0000-0000-000000000001	\N	1234567890	\N	Test User	active	2026-07-22 13:38:54.333953+05:30	2026-07-22 13:38:54.333953+05:30
00000000-0000-0000-0000-000000000003	\N	9999999999	\N	Garage Owner	active	2026-07-22 13:38:54.357753+05:30	2026-07-22 13:38:54.357753+05:30
887ae938-b723-4f0f-ab8c-b19169e4dc20	surabin16@gmail.com	\N	\N	Surabi N	active	2026-07-22 14:12:57.108782+05:30	2026-07-22 14:12:57.108782+05:30
7d06ddc5-7fb8-4402-8624-a7b22f53633e	\N	9876543210	\N	Test User	active	2026-07-26 16:37:02.816614+05:30	2026-07-27 11:58:51.371964+05:30
4ffbfd29-a2bb-40cb-903e-66ad95b76c9f	admin@wrectifai.com	0000000000	$2b$10$3BQmtyp4vrZrX8kPHGkWTeY0ghb4bPyaLoi8f.X1WvRwPn.N.MkxO	System Admin	active	2026-07-29 18:18:04.555155+05:30	2026-07-29 18:33:32.555526+05:30
f1493215-ef42-40ec-9079-064e3665b4c7	surabin260@gmail.com	\N	\N	SURABI N	active	2026-07-30 10:42:30.721923+05:30	2026-07-30 10:42:30.721923+05:30
\.


--
-- Data for Name: vehicle_images_cache; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_images_cache (key, image_url, created_at) FROM stdin;
chevrolet-cruze-2018	/uploads/vehicles/chevrolet-cruze-2018-1785127799284.jpg	2026-07-27 10:19:59.289721
ford-f-150-2020	/uploads/vehicles/ford-f-150-2020-1785300844332.jpg	2026-07-29 10:24:04.353083
\.


--
-- Data for Name: vehicle_repair_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_repair_history (id, vehicle_id, issue_summary, service_done, shop_name, status, price_amount, currency, service_date, created_at) FROM stdin;
\.


--
-- Data for Name: vehicle_service_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_service_history (id, vehicle_id, service_date, description, garage_id, cost, created_at) FROM stdin;
76fb1a36-6e33-49a4-b080-6b3821cb3c4f	00000000-0000-0000-0000-000000000002	2026-04-22 13:38:54.333953+05:30	Routine Engine Oil & Filter Change	\N	85.00	2026-07-22 13:38:54.333953+05:30
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicles (id, customer_id, make, model, year, vin, mileage, warranty, created_at, updated_at, is_active, fuel_type, "trim", engine_type, plate_number, is_default) FROM stdin;
c105d3cf-01f4-44f6-8fe5-7cc69299de50	887ae938-b723-4f0f-ab8c-b19169e4dc20	Hyundai	Creta	2022	KMHJU81VPNU123456	28000	\N	2026-07-25 15:57:20.057541+05:30	2026-07-25 15:57:32.464692+05:30	t	Unknown	\N	\N	\N	f
00000000-0000-0000-0000-000000000002	00000000-0000-0000-0000-000000000001	Honda	City	2018	1HGCR2F8XJA000001	45000	\N	2026-07-22 13:38:54.333953+05:30	2026-07-25 16:27:22.648679+05:30	f	Unknown	\N	\N	\N	f
153b6fef-b6ce-4d3c-b473-776699685f0b	887ae938-b723-4f0f-ab8c-b19169e4dc20	Maruti Suzuki	Swift	2020	MA3EWB22S00123456	38000	\N	2026-07-25 16:28:20.562916+05:30	2026-07-25 16:28:20.562916+05:30	t	Unknown	\N	\N	\N	f
6c82464f-b9ce-48f4-9639-d8be36594587	887ae938-b723-4f0f-ab8c-b19169e4dc20	Kia	Seltos	2023	KNAPU81VPPA123456	15000	\N	2026-07-25 19:31:16.900093+05:30	2026-07-25 19:31:16.900093+05:30	t	Unknown	\N	\N	\N	f
06cd2ee9-fe36-481d-a1ec-3903925cb216	887ae938-b723-4f0f-ab8c-b19169e4dc20	Mercedes-Benz	C-Class	2022	WDDWF4KB5NR123456	18000	\N	2026-07-26 12:31:54.760392+05:30	2026-07-26 12:31:54.760392+05:30	t	Unknown	\N	\N	\N	f
41f77633-893a-4a41-b95e-316358760e4d	887ae938-b723-4f0f-ab8c-b19169e4dc20	Chevrolet	Cruze	2018	KL1JF69Z9JK123456	65000	\N	2026-07-26 13:34:26.805011+05:30	2026-07-26 13:34:26.805011+05:30	t	Unknown	\N	\N	\N	f
ab793c5c-90bf-4128-bdc0-46e31bd1cd58	887ae938-b723-4f0f-ab8c-b19169e4dc20	Rivian	R1T	2026	\N	2021	\N	2026-07-26 15:02:33.161151+05:30	2026-07-26 18:03:34.364937+05:30	f	Unknown	\N	\N	\N	f
45d26afa-2db1-4540-ba4f-aad57374c64f	887ae938-b723-4f0f-ab8c-b19169e4dc20	Ford	F-150	2020	1FTFW1E50LFA12345	54230	\N	2026-07-29 10:22:16.064714+05:30	2026-07-29 10:22:16.064714+05:30	t	Unknown	\N	\N	\N	f
\.


--
-- Name: _migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public._migrations_id_seq', 15, true);


--
-- Name: ui_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ui_content_id_seq', 64, true);


--
-- Name: _migrations _migrations_filename_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._migrations
    ADD CONSTRAINT _migrations_filename_key UNIQUE (filename);


--
-- Name: _migrations _migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._migrations
    ADD CONSTRAINT _migrations_pkey PRIMARY KEY (id);


--
-- Name: auth_sessions auth_sessions_access_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT auth_sessions_access_token_hash_key UNIQUE (access_token_hash);


--
-- Name: auth_sessions auth_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT auth_sessions_pkey PRIMARY KEY (id);


--
-- Name: auth_sessions auth_sessions_refresh_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT auth_sessions_refresh_token_hash_key UNIQUE (refresh_token_hash);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: diagnose_issue_categories diagnose_issue_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnose_issue_categories
    ADD CONSTRAINT diagnose_issue_categories_pkey PRIMARY KEY (id);


--
-- Name: diagnose_next_steps diagnose_next_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnose_next_steps
    ADD CONSTRAINT diagnose_next_steps_pkey PRIMARY KEY (id);


--
-- Name: diagnose_possible_issues diagnose_possible_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnose_possible_issues
    ADD CONSTRAINT diagnose_possible_issues_pkey PRIMARY KEY (id);


--
-- Name: diagnose_questions diagnose_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnose_questions
    ADD CONSTRAINT diagnose_questions_pkey PRIMARY KEY (id);


--
-- Name: diagnose_result_summaries diagnose_result_summaries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnose_result_summaries
    ADD CONSTRAINT diagnose_result_summaries_pkey PRIMARY KEY (id);


--
-- Name: diagnose_trust_items diagnose_trust_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnose_trust_items
    ADD CONSTRAINT diagnose_trust_items_pkey PRIMARY KEY (id);


--
-- Name: diagnosis_media diagnosis_media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosis_media
    ADD CONSTRAINT diagnosis_media_pkey PRIMARY KEY (id);


--
-- Name: diagnosis_requests diagnosis_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosis_requests
    ADD CONSTRAINT diagnosis_requests_pkey PRIMARY KEY (id);


--
-- Name: diagnosis_results diagnosis_results_diagnosis_request_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosis_results
    ADD CONSTRAINT diagnosis_results_diagnosis_request_id_key UNIQUE (diagnosis_request_id);


--
-- Name: diagnosis_results diagnosis_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosis_results
    ADD CONSTRAINT diagnosis_results_pkey PRIMARY KEY (id);


--
-- Name: diagnosis_sessions diagnosis_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosis_sessions
    ADD CONSTRAINT diagnosis_sessions_pkey PRIMARY KEY (id);


--
-- Name: garage_badges garage_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.garage_badges
    ADD CONSTRAINT garage_badges_pkey PRIMARY KEY (id);


--
-- Name: garage_documents garage_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.garage_documents
    ADD CONSTRAINT garage_documents_pkey PRIMARY KEY (id);


--
-- Name: garage_services garage_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.garage_services
    ADD CONSTRAINT garage_services_pkey PRIMARY KEY (id);


--
-- Name: garage_slots garage_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.garage_slots
    ADD CONSTRAINT garage_slots_pkey PRIMARY KEY (id);


--
-- Name: garages garages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.garages
    ADD CONSTRAINT garages_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_key UNIQUE (product_id);


--
-- Name: issue_requests issue_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_requests
    ADD CONSTRAINT issue_requests_pkey PRIMARY KEY (id);


--
-- Name: known_issues known_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.known_issues
    ADD CONSTRAINT known_issues_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: otp_challenges otp_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_challenges
    ADD CONSTRAINT otp_challenges_pkey PRIMARY KEY (id);


--
-- Name: part_orders part_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.part_orders
    ADD CONSTRAINT part_orders_pkey PRIMARY KEY (id);


--
-- Name: parts_catalog parts_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts_catalog
    ADD CONSTRAINT parts_catalog_pkey PRIMARY KEY (id);


--
-- Name: payment_intents payment_intents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_intents
    ADD CONSTRAINT payment_intents_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payments payments_provider_intent_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_provider_intent_id_key UNIQUE (transaction_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: promos promos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promos
    ADD CONSTRAINT promos_pkey PRIMARY KEY (id);


--
-- Name: quote_requests quote_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_requests
    ADD CONSTRAINT quote_requests_pkey PRIMARY KEY (id);


--
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_hash_key UNIQUE (token_hash);


--
-- Name: reviews reviews_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_key UNIQUE (booking_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: roles roles_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_code_key UNIQUE (code);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: runtime_app_config runtime_app_config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.runtime_app_config
    ADD CONSTRAINT runtime_app_config_pkey PRIMARY KEY (key);


--
-- Name: sellers sellers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT sellers_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: sms_events sms_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sms_events
    ADD CONSTRAINT sms_events_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: ui_content ui_content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ui_content
    ADD CONSTRAINT ui_content_pkey PRIMARY KEY (id);


--
-- Name: ui_content ui_content_tenant_id_module_page_locale_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ui_content
    ADD CONSTRAINT ui_content_tenant_id_module_page_locale_key UNIQUE (tenant_id, module, page, locale);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- Name: user_social_accounts user_social_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_social_accounts
    ADD CONSTRAINT user_social_accounts_pkey PRIMARY KEY (id);


--
-- Name: user_social_accounts user_social_accounts_provider_social_subject_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_social_accounts
    ADD CONSTRAINT user_social_accounts_provider_social_subject_key UNIQUE (provider, social_subject);


--
-- Name: user_social_accounts user_social_accounts_user_id_provider_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_social_accounts
    ADD CONSTRAINT user_social_accounts_user_id_provider_key UNIQUE (user_id, provider);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_mobile_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_mobile_number_key UNIQUE (mobile_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicle_images_cache vehicle_images_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_images_cache
    ADD CONSTRAINT vehicle_images_cache_pkey PRIMARY KEY (key);


--
-- Name: vehicle_repair_history vehicle_repair_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_repair_history
    ADD CONSTRAINT vehicle_repair_history_pkey PRIMARY KEY (id);


--
-- Name: vehicle_service_history vehicle_service_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_service_history
    ADD CONSTRAINT vehicle_service_history_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_vin_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key UNIQUE (vin);


--
-- Name: idx_bookings_booking_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_booking_type ON public.bookings USING btree (booking_type);


--
-- Name: idx_bookings_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_customer_id ON public.bookings USING btree (customer_id);


--
-- Name: idx_bookings_garage_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_garage_id ON public.bookings USING btree (garage_id);


--
-- Name: idx_bookings_scheduled_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_scheduled_at ON public.bookings USING btree (scheduled_at);


--
-- Name: idx_bookings_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_status ON public.bookings USING btree (status);


--
-- Name: idx_bookings_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_user_created ON public.bookings USING btree (customer_id, created_at DESC);


--
-- Name: idx_bookings_vehicle_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_vehicle_id ON public.bookings USING btree (vehicle_id);


--
-- Name: idx_carts_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_carts_customer_id ON public.carts USING btree (customer_id);


--
-- Name: idx_diagnose_possible_issues_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_diagnose_possible_issues_category_id ON public.diagnose_possible_issues USING btree (category_id);


--
-- Name: idx_diagnose_questions_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_diagnose_questions_category_id ON public.diagnose_questions USING btree (category_id);


--
-- Name: idx_diagnosis_media_diagnosis_request_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_diagnosis_media_diagnosis_request_id ON public.diagnosis_media USING btree (diagnosis_request_id);


--
-- Name: idx_diagnosis_requests_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_diagnosis_requests_customer_id ON public.diagnosis_requests USING btree (customer_id);


--
-- Name: idx_diagnosis_requests_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_diagnosis_requests_status ON public.diagnosis_requests USING btree (status);


--
-- Name: idx_diagnosis_requests_vehicle_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_diagnosis_requests_vehicle_id ON public.diagnosis_requests USING btree (vehicle_id);


--
-- Name: idx_diagnosis_results_risk_level; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_diagnosis_results_risk_level ON public.diagnosis_results USING btree (risk_level);


--
-- Name: idx_diagnosis_sessions_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_diagnosis_sessions_user_created ON public.diagnosis_sessions USING btree (customer_user_id, created_at DESC);


--
-- Name: idx_garage_badges_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_garage_badges_active ON public.garage_badges USING btree (active);


--
-- Name: idx_garage_badges_badge_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_garage_badges_badge_key ON public.garage_badges USING btree (badge_key);


--
-- Name: idx_garage_badges_garage_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_garage_badges_garage_id ON public.garage_badges USING btree (garage_id);


--
-- Name: idx_garage_documents_garage_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_garage_documents_garage_id ON public.garage_documents USING btree (garage_id);


--
-- Name: idx_garage_documents_verification_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_garage_documents_verification_status ON public.garage_documents USING btree (verification_status);


--
-- Name: idx_garage_services_garage; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_garage_services_garage ON public.garage_services USING btree (garage_user_id, created_at DESC);


--
-- Name: idx_garage_slots_garage_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_garage_slots_garage_id ON public.garage_slots USING btree (garage_id);


--
-- Name: idx_garage_slots_is_available; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_garage_slots_is_available ON public.garage_slots USING btree (is_available);


--
-- Name: idx_garage_slots_start_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_garage_slots_start_at ON public.garage_slots USING btree (start_at);


--
-- Name: idx_garages_approval_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_garages_approval_status ON public.garages USING btree (approval_status);


--
-- Name: idx_garages_owner_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_garages_owner_user_id ON public.garages USING btree (owner_user_id);


--
-- Name: idx_garages_specializations; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_garages_specializations ON public.garages USING gin (specializations);


--
-- Name: idx_inventory_qty_available; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_qty_available ON public.inventory USING btree (qty_available);


--
-- Name: idx_issue_requests_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_issue_requests_user_created ON public.issue_requests USING btree (customer_user_id, created_at DESC);


--
-- Name: idx_known_issues_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_known_issues_category ON public.known_issues USING btree (category);


--
-- Name: idx_known_issues_makes; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_known_issues_makes ON public.known_issues USING gin (makes);


--
-- Name: idx_known_issues_symptom_keywords; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_known_issues_symptom_keywords ON public.known_issues USING gin (symptom_keywords);


--
-- Name: idx_notifications_channel; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_channel ON public.notifications USING btree (channel);


--
-- Name: idx_notifications_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at);


--
-- Name: idx_notifications_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_status ON public.notifications USING btree (status);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_orders_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_created_at ON public.orders USING btree (created_at);


--
-- Name: idx_orders_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_customer_id ON public.orders USING btree (customer_id);


--
-- Name: idx_orders_fulfillment_mode; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_fulfillment_mode ON public.orders USING btree (fulfillment_mode);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_part_orders_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_part_orders_user_created ON public.part_orders USING btree (customer_user_id, created_at DESC);


--
-- Name: idx_payment_intents_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_intents_user_created ON public.payment_intents USING btree (customer_user_id, created_at DESC);


--
-- Name: idx_payments_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_booking_id ON public.payments USING btree (booking_id);


--
-- Name: idx_payments_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_created_at ON public.payments USING btree (created_at);


--
-- Name: idx_payments_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_order_id ON public.payments USING btree (order_id);


--
-- Name: idx_payments_payer_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_payer_user_id ON public.payments USING btree (customer_user_id);


--
-- Name: idx_payments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_status ON public.payments USING btree (status);


--
-- Name: idx_payments_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_user_created ON public.payments USING btree (customer_user_id, created_at DESC);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_category ON public.products USING btree (category);


--
-- Name: idx_products_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_is_active ON public.products USING btree (is_active);


--
-- Name: idx_products_is_diy_kit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_is_diy_kit ON public.products USING btree (is_diy_kit);


--
-- Name: idx_products_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_name ON public.products USING btree (name);


--
-- Name: idx_products_seller_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_seller_id ON public.products USING btree (seller_id);


--
-- Name: idx_quote_requests_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quote_requests_customer_id ON public.quote_requests USING btree (customer_id);


--
-- Name: idx_quote_requests_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quote_requests_status ON public.quote_requests USING btree (status);


--
-- Name: idx_quote_requests_vehicle_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quote_requests_vehicle_id ON public.quote_requests USING btree (vehicle_id);


--
-- Name: idx_quotes_garage_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quotes_garage_id ON public.quotes USING btree (garage_id);


--
-- Name: idx_quotes_issue_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quotes_issue_created ON public.quotes USING btree (quote_request_id, created_at DESC);


--
-- Name: idx_quotes_quote_request_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quotes_quote_request_id ON public.quotes USING btree (quote_request_id);


--
-- Name: idx_quotes_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quotes_status ON public.quotes USING btree (status);


--
-- Name: idx_refresh_tokens_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_tokens_user_id ON public.refresh_tokens USING btree (user_id);


--
-- Name: idx_reviews_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_customer_id ON public.reviews USING btree (customer_id);


--
-- Name: idx_reviews_garage_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_garage_id ON public.reviews USING btree (garage_id);


--
-- Name: idx_reviews_is_verified; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_is_verified ON public.reviews USING btree (is_verified);


--
-- Name: idx_sellers_approval_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sellers_approval_status ON public.sellers USING btree (approval_status);


--
-- Name: idx_sellers_garage_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sellers_garage_id ON public.sellers USING btree (garage_id);


--
-- Name: idx_sellers_seller_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sellers_seller_type ON public.sellers USING btree (seller_type);


--
-- Name: idx_sellers_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sellers_user_id ON public.sellers USING btree (user_id);


--
-- Name: idx_services_garage_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_services_garage_id ON public.services USING btree (garage_id);


--
-- Name: idx_support_tickets_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_support_tickets_user_created ON public.support_tickets USING btree (customer_user_id, created_at DESC);


--
-- Name: idx_ui_content_lookup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ui_content_lookup ON public.ui_content USING btree (tenant_id, module, page, locale);


--
-- Name: idx_user_roles_role_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_roles_role_id ON public.user_roles USING btree (role_id);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: idx_users_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_created_at ON public.users USING btree (created_at);


--
-- Name: idx_users_email_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_users_email_unique ON public.users USING btree (email) WHERE (email IS NOT NULL);


--
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_status ON public.users USING btree (status);


--
-- Name: idx_vehicle_repair_history_vehicle_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_repair_history_vehicle_date ON public.vehicle_repair_history USING btree (vehicle_id, service_date DESC);


--
-- Name: idx_vehicle_service_history_vehicle_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_service_history_vehicle_id ON public.vehicle_service_history USING btree (vehicle_id);


--
-- Name: idx_vehicles_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_created_at ON public.vehicles USING btree (created_at);


--
-- Name: idx_vehicles_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_customer_id ON public.vehicles USING btree (customer_id);


--
-- Name: idx_vehicles_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_is_active ON public.vehicles USING btree (is_active);


--
-- Name: idx_vehicles_one_default_per_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_vehicles_one_default_per_user ON public.vehicles USING btree (customer_id) WHERE (is_default = true);


--
-- Name: idx_vehicles_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_user_created ON public.vehicles USING btree (customer_id, created_at DESC);


--
-- Name: bookings update_bookings_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: carts update_carts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: garages update_garages_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_garages_updated_at BEFORE UPDATE ON public.garages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: inventory update_inventory_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: orders update_orders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: payments update_payments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: products update_products_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: roles update_roles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: services update_services_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_roles update_user_roles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: vehicles update_vehicles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: auth_sessions auth_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT auth_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_garage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_quote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES public.quotes(id);


--
-- Name: bookings bookings_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: carts carts_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: diagnose_possible_issues diagnose_possible_issues_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnose_possible_issues
    ADD CONSTRAINT diagnose_possible_issues_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.diagnose_issue_categories(id) ON DELETE CASCADE;


--
-- Name: diagnose_questions diagnose_questions_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnose_questions
    ADD CONSTRAINT diagnose_questions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.diagnose_issue_categories(id) ON DELETE CASCADE;


--
-- Name: diagnosis_media diagnosis_media_diagnosis_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosis_media
    ADD CONSTRAINT diagnosis_media_diagnosis_request_id_fkey FOREIGN KEY (diagnosis_request_id) REFERENCES public.diagnosis_requests(id) ON DELETE CASCADE;


--
-- Name: diagnosis_requests diagnosis_requests_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosis_requests
    ADD CONSTRAINT diagnosis_requests_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: diagnosis_requests diagnosis_requests_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosis_requests
    ADD CONSTRAINT diagnosis_requests_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: diagnosis_results diagnosis_results_diagnosis_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosis_results
    ADD CONSTRAINT diagnosis_results_diagnosis_request_id_fkey FOREIGN KEY (diagnosis_request_id) REFERENCES public.diagnosis_requests(id) ON DELETE CASCADE;


--
-- Name: diagnosis_sessions diagnosis_sessions_customer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosis_sessions
    ADD CONSTRAINT diagnosis_sessions_customer_user_id_fkey FOREIGN KEY (customer_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: diagnosis_sessions diagnosis_sessions_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnosis_sessions
    ADD CONSTRAINT diagnosis_sessions_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: garage_badges garage_badges_garage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.garage_badges
    ADD CONSTRAINT garage_badges_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id) ON DELETE CASCADE;


--
-- Name: garage_documents garage_documents_garage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.garage_documents
    ADD CONSTRAINT garage_documents_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id) ON DELETE CASCADE;


--
-- Name: garage_documents garage_documents_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.garage_documents
    ADD CONSTRAINT garage_documents_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- Name: garage_services garage_services_garage_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.garage_services
    ADD CONSTRAINT garage_services_garage_user_id_fkey FOREIGN KEY (garage_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: garage_slots garage_slots_garage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.garage_slots
    ADD CONSTRAINT garage_slots_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id) ON DELETE CASCADE;


--
-- Name: garages garages_owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.garages
    ADD CONSTRAINT garages_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: inventory inventory_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: issue_requests issue_requests_customer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_requests
    ADD CONSTRAINT issue_requests_customer_user_id_fkey FOREIGN KEY (customer_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: issue_requests issue_requests_diagnosis_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_requests
    ADD CONSTRAINT issue_requests_diagnosis_session_id_fkey FOREIGN KEY (diagnosis_session_id) REFERENCES public.diagnosis_sessions(id) ON DELETE SET NULL;


--
-- Name: issue_requests issue_requests_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_requests
    ADD CONSTRAINT issue_requests_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: part_orders part_orders_customer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.part_orders
    ADD CONSTRAINT part_orders_customer_user_id_fkey FOREIGN KEY (customer_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: part_orders part_orders_part_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.part_orders
    ADD CONSTRAINT part_orders_part_id_fkey FOREIGN KEY (part_id) REFERENCES public.parts_catalog(id) ON DELETE RESTRICT;


--
-- Name: payment_intents payment_intents_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_intents
    ADD CONSTRAINT payment_intents_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: payment_intents payment_intents_customer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_intents
    ADD CONSTRAINT payment_intents_customer_user_id_fkey FOREIGN KEY (customer_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE SET NULL;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: payments payments_payer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_payer_user_id_fkey FOREIGN KEY (customer_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: products products_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sellers(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: quote_requests quote_requests_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_requests
    ADD CONSTRAINT quote_requests_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: quote_requests quote_requests_diagnosis_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_requests
    ADD CONSTRAINT quote_requests_diagnosis_request_id_fkey FOREIGN KEY (diagnosis_request_id) REFERENCES public.diagnosis_requests(id);


--
-- Name: quote_requests quote_requests_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_requests
    ADD CONSTRAINT quote_requests_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: quotes quotes_garage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id) ON DELETE CASCADE;


--
-- Name: quotes quotes_quote_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_quote_request_id_fkey FOREIGN KEY (quote_request_id) REFERENCES public.quote_requests(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_garage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id) ON DELETE CASCADE;


--
-- Name: sellers sellers_garage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT sellers_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id) ON DELETE SET NULL;


--
-- Name: sellers sellers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT sellers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: services services_garage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id) ON DELETE CASCADE;


--
-- Name: sms_events sms_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sms_events
    ADD CONSTRAINT sms_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: support_tickets support_tickets_customer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_customer_user_id_fkey FOREIGN KEY (customer_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_social_accounts user_social_accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_social_accounts
    ADD CONSTRAINT user_social_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: vehicle_repair_history vehicle_repair_history_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_repair_history
    ADD CONSTRAINT vehicle_repair_history_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: vehicle_service_history vehicle_service_history_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_service_history
    ADD CONSTRAINT vehicle_service_history_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: vehicles vehicles_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict OcyvE74e2soYDaePUhKEsYKZ1hmkFx5QdiJna7GBl2hZqBqLi4GskbtGxBZD9BF

