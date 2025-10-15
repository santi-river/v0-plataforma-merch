-- Crear tabla de órdenes
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  moneda text not null,
  monto numeric(10, 2) not null,
  telefono text not null,
  descripcion text,
  codigo text,
  estado text not null default 'pendiente', -- pendiente, verificado, completado, fallido
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Habilitar Row Level Security
alter table public.orders enable row level security;

-- Políticas de seguridad
create policy "Los usuarios pueden ver sus propias órdenes"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Los usuarios pueden crear sus propias órdenes"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios pueden actualizar sus propias órdenes"
  on public.orders for update
  using (auth.uid() = user_id);

create policy "Los usuarios pueden eliminar sus propias órdenes"
  on public.orders for delete
  using (auth.uid() = user_id);
