create or replace function public.place_order_atomic(
  p_user_id uuid,
  p_items jsonb,
  p_bag_opt_in boolean,
  p_pickup_date date,
  p_pickup_time time
)
returns uuid
language plpgsql
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_subtotal integer := 0;
  v_bag_fee integer := case when p_bag_opt_in then 70 else 0 end;
  v_total integer := 0;
  it jsonb;
  v_pid uuid;
  v_qty int;
  v_price int;
  updated int;
begin
  for it in select * from jsonb_array_elements(p_items) loop
    v_pid := (it->>'product_id')::uuid;
    v_qty := (it->>'qty')::int;
    v_price := (it->>'price_pence')::int;
    if v_qty <= 0 then raise exception 'Invalid qty for product %', v_pid; end if;
    update public.products
      set stock = stock - v_qty, updated_at = now()
      where id = v_pid and visible = true and stock >= v_qty
    returning 1 into updated;
    if updated is null then
      raise exception 'Insufficient stock for product %', v_pid;
    end if;
    v_subtotal := v_subtotal + (v_price * v_qty);
  end loop;
  v_total := v_subtotal + v_bag_fee;
  insert into public.orders (id, user_id, items, subtotal_pence, bag_opt_in, bag_fee_pence, total_pence, status, pickup_date, pickup_time)
  values (v_order_id, p_user_id, p_items, v_subtotal, p_bag_opt_in, v_bag_fee, v_total, 'unpaid', p_pickup_date, p_pickup_time);
  return v_order_id;
exception
  when others then
    raise;
end;
$$;

-- Create categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Insert default categories
insert into public.categories (name, slug, description) values
  ('Baked Goods', 'baked_goods', 'Freshly baked breads, pastries, and desserts'),
  ('Groceries', 'groceries', 'General grocery items and ingredients')
on conflict (slug) do nothing;

-- Add category_id column to products table if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'products' and column_name = 'category_id') then
    alter table public.products add column category_id uuid references public.categories(id);
    
    -- Migrate existing category data
    update public.products set category_id = c.id
    from public.categories c
    where products.category = c.slug;
    
    -- Make category_id not null after migration
    alter table public.products alter column category_id set not null;
    
    -- Drop the old category column
    alter table public.products drop column category;
  end if;
end $$;

-- Enable RLS on categories
alter table public.categories enable row level security;

-- Create policy for categories (read-only for now)
create policy if not exists categories_read on public.categories for select using (true);
