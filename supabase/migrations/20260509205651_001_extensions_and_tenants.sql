/*
  # Extensions and Multi-Tenancy Core

  1. Extensions
    - uuid-ossp, pgcrypto, pg_trgm for text search
    
  2. New Tables
    - `tenants` - Multi-tenant school instances with branding, plan, and compliance fields
    
  3. Security
    - RLS enabled on tenants table
*/

create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "pg_trgm" with schema public;

create table if not exists public.tenants (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  logo_url        text,
  primary_color   text not null default '#2563EB',
  secondary_color text not null default '#0EA5E9',
  font_family     text not null default 'Inter',
  custom_domain   text unique,
  plan            text not null default 'free' check (plan in ('free','pro','enterprise')),
  max_students    integer not null default 500,
  locale          text not null default 'en',
  timezone        text not null default 'UTC',
  features        jsonb not null default '{}',
  gdpr_dpa_signed boolean not null default false,
  ndpa_accepted   boolean not null default false,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_tenants_slug on public.tenants (slug);

alter table public.tenants enable row level security;
