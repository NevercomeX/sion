-- ==============================================================================
-- SCHEMA SQL PARA PROYECTO "ROCA DE SIÓN · CONECTANDO VIDAS"
-- Copie y ejecute este script en el SQL Editor de Supabase
-- ==============================================================================

-- 1. Crear extensión para UUIDs si no existe
create extension if not exists "uuid-ossp";

-- 2. Crear tabla principal de encuestas
create table if not exists public.surveys (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    phone text,
    address text,
    date date default current_date not null,
    collector text,
    contact_pref text default 'WhatsApp',
    topics jsonb default '[]'::jsonb,
    main_interest text,
    next_action text default 'Contactar',
    next_date date,
    notes text,
    risk integer default 0,
    risk_label text,
    answers jsonb default '{}'::jsonb,
    status text default 'pendiente',
    consent boolean default true,
    follow_history jsonb default '[]'::jsonb
);

-- 3. Índices para rendimiento de búsqueda
create index if not exists surveys_name_idx on public.surveys using btree (name);
create index if not exists surveys_phone_idx on public.surveys using btree (phone);
create index if not exists surveys_status_idx on public.surveys (status);
create index if not exists surveys_date_idx on public.surveys (date);

-- 4. Habilitar Seguridad a Nivel de Fila (RLS)
alter table public.surveys enable row level security;

-- 5. Crear políticas de acceso (Permitir lectura y escritura con clave pública/anon)
create policy "Permitir acceso público de lectura a encuestas"
    on public.surveys for select
    using (true);

create policy "Permitir inserción pública de encuestas"
    on public.surveys for insert
    with check (true);

create policy "Permitir actualización pública de encuestas"
    on public.surveys for update
    using (true);

create policy "Permitir eliminación pública de encuestas"
    on public.surveys for delete
    using (true);

-- 6. Trigger para actualización automática de updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_surveys_updated_at
    before update on public.surveys
    for each row
    execute procedure public.handle_updated_at();
