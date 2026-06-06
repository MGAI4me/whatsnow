-- Add e-commerce fields to contacts table
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS orders INTEGER DEFAULT 0;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS revenue NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_purchase TIMESTAMPTZ;

-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected')),
  icon TEXT,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (account_id, name)
);

CREATE INDEX IF NOT EXISTS idx_integrations_account ON integrations(account_id);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS integrations_select ON integrations;
DROP POLICY IF EXISTS integrations_insert ON integrations;
DROP POLICY IF EXISTS integrations_update ON integrations;
DROP POLICY IF EXISTS integrations_delete ON integrations;

CREATE POLICY integrations_select ON integrations FOR SELECT USING (is_account_member(account_id));
CREATE POLICY integrations_insert ON integrations FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));
CREATE POLICY integrations_update ON integrations FOR UPDATE USING (is_account_member(account_id, 'admin'));
CREATE POLICY integrations_delete ON integrations FOR DELETE USING (is_account_member(account_id, 'admin'));

DROP TRIGGER IF EXISTS set_updated_at ON integrations;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create chatbots table
CREATE TABLE IF NOT EXISTS chatbots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('welcome', 'faq', 'office')),
  reply_text TEXT NOT NULL,
  keywords JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (account_id, trigger_type)
);

CREATE INDEX IF NOT EXISTS idx_chatbots_account ON chatbots(account_id);

ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS chatbots_select ON chatbots;
DROP POLICY IF EXISTS chatbots_insert ON chatbots;
DROP POLICY IF EXISTS chatbots_update ON chatbots;
DROP POLICY IF EXISTS chatbots_delete ON chatbots;

CREATE POLICY chatbots_select ON chatbots FOR SELECT USING (is_account_member(account_id));
CREATE POLICY chatbots_insert ON chatbots FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));
CREATE POLICY chatbots_update ON chatbots FOR UPDATE USING (is_account_member(account_id, 'admin'));
CREATE POLICY chatbots_delete ON chatbots FOR DELETE USING (is_account_member(account_id, 'admin'));

DROP TRIGGER IF EXISTS set_updated_at ON chatbots;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON chatbots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to seed an account's wapigrow features
CREATE OR REPLACE FUNCTION seed_account_wapigrow_features(p_account_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Seed Integrations
  INSERT INTO integrations (account_id, name, icon, description, position, status)
  VALUES 
    (p_account_id, 'Salla', 'ti-shopping-cart', 'Connect your Salla store', 1, 'disconnected'),
    (p_account_id, 'Zid', 'ti-building-store', 'Connect your Zid store', 2, 'disconnected'),
    (p_account_id, 'Shopify', 'ti-shopping-bag', 'Connect your Shopify store', 3, 'disconnected'),
    (p_account_id, 'Makane', 'ti-package', 'Connect your Makane store', 4, 'disconnected')
  ON CONFLICT (account_id, name) DO NOTHING;

  -- Seed Chatbots
  INSERT INTO chatbots (account_id, name, trigger_type, reply_text, keywords, is_active)
  VALUES 
    (p_account_id, 'Welcome Bot', 'welcome', 'مرحباً بك في WapiGrow! كيف يمكننا مساعدتك اليوم؟ 🚀', '[]'::jsonb, false),
    (p_account_id, 'FAQ Bot', 'faq', 'أهلاً بك! باقات WapiGrow تبدأ من 99 دولار شهرياً. للمزيد من التفاصيل يرجى زيارة موقعنا: https://wapigrow.com 🌐', '["سعر", "باقة", "تفاصيل", "اشتراك", "عروض"]'::jsonb, false),
    (p_account_id, 'Out of Office', 'office', 'مرحباً! نحن خارج أوقات العمل الرسمية حالياً. سنقوم بالرد عليك في أقرب وقت ممكن عند عودتنا. شكراً لتفهمك! 🕒', '[]'::jsonb, false)
  ON CONFLICT (account_id, trigger_type) DO NOTHING;
END;
$$;

-- Trigger to seed new accounts automatically
CREATE OR REPLACE FUNCTION public.handle_new_account_seeding()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM seed_account_wapigrow_features(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_account_created ON accounts;
CREATE TRIGGER on_account_created
  AFTER INSERT ON accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_account_seeding();

-- Backfill existing accounts
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM accounts LOOP
    PERFORM seed_account_wapigrow_features(r.id);
  END LOOP;
END $$;
