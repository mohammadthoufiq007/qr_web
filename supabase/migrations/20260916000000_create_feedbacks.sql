create table
  public.feedbacks (
    id uuid not null default gen_random_uuid (),
    type text not null,
    message text not null,
    raw_rating text not null,
    created_at timestamp with time zone not null default now(),
    constraint feedbacks_pkey primary key (id)
  ) tablespace pg_default;
