-- Create wallet tables for HueFork

CREATE TABLE public.wallet (
    username text PRIMARY KEY REFERENCES public.users(username) ON DELETE CASCADE,
    pin text NOT NULL,
    trust_rating integer DEFAULT 500,
    royalty_balance integer DEFAULT 0,
    last_royalty_claim timestamp with time zone
);

CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    username text REFERENCES public.users(username) ON DELETE CASCADE,
    type text NOT NULL,
    amount integer NOT NULL,
    balance_after integer NOT NULL,
    target_username text,
    comment text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.credits (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    username text REFERENCES public.users(username) ON DELETE CASCADE,
    principal integer NOT NULL,
    amount_due integer NOT NULL,
    amount_paid integer DEFAULT 0,
    status text NOT NULL DEFAULT 'active',
    due_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Note: Ensure Row Level Security (RLS) is disabled or appropriately configured for these tables so the API can access them.
-- If RLS is enabled, you might need policies, but if 'users' table works without it, these will too.
