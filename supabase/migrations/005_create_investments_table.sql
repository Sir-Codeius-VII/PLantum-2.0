-- Create investments table
CREATE TABLE investments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  funding_round_id UUID REFERENCES funding_rounds(id) ON DELETE CASCADE,
  amount DECIMAL(19,4) NOT NULL,
  equity_percentage DECIMAL(5,4),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'failed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
  payment_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  investment_type TEXT DEFAULT 'equity' CHECK (investment_type IN ('equity', 'convertible_note', 'safe', 'debt')),
  investment_terms JSONB,
  due_diligence_status TEXT DEFAULT 'pending' CHECK (due_diligence_status IN ('pending', 'in_progress', 'completed', 'failed')),
  legal_documents JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  CONSTRAINT amount_positive CHECK (amount > 0),
  CONSTRAINT equity_percentage_valid CHECK (equity_percentage >= 0 AND equity_percentage <= 1)
);

-- Create indexes for better performance
CREATE INDEX investments_investor_id_idx ON investments(investor_id);
CREATE INDEX investments_startup_id_idx ON investments(startup_id);
CREATE INDEX investments_funding_round_id_idx ON investments(funding_round_id);
CREATE INDEX investments_status_idx ON investments(status);
CREATE INDEX investments_payment_status_idx ON investments(payment_status);
CREATE INDEX investments_created_at_idx ON investments(created_at);

-- Enable Row Level Security
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Investors can view their own investments"
  ON investments FOR SELECT
  USING (auth.uid() = investor_id);

CREATE POLICY "Investors can create their own investments"
  ON investments FOR INSERT
  WITH CHECK (auth.uid() = investor_id);

CREATE POLICY "Investors can update their own investments"
  ON investments FOR UPDATE
  USING (auth.uid() = investor_id);

CREATE POLICY "Startup owners can view investments in their startups"
  ON investments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM startups
    WHERE startups.id = investments.startup_id
    AND startups.user_id = auth.uid()
  ));

CREATE POLICY "Startup owners can update investments in their startups"
  ON investments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM startups
    WHERE startups.id = investments.startup_id
    AND startups.user_id = auth.uid()
  ));

-- Create function to update startup raised_amount when investment is completed
CREATE OR REPLACE FUNCTION update_startup_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE startups 
    SET raised_amount = raised_amount + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.startup_id;
  END IF;
  
  IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    UPDATE startups 
    SET raised_amount = raised_amount - OLD.amount,
        updated_at = NOW()
    WHERE id = NEW.startup_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update startup raised_amount
CREATE TRIGGER update_startup_raised_amount_trigger
  AFTER UPDATE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION update_startup_raised_amount();

-- Create function to update funding round raised_amount when investment is completed
CREATE OR REPLACE FUNCTION update_funding_round_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE funding_rounds 
    SET raised_amount = raised_amount + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.funding_round_id;
  END IF;
  
  IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    UPDATE funding_rounds 
    SET raised_amount = raised_amount - OLD.amount,
        updated_at = NOW()
    WHERE id = NEW.funding_round_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update funding round raised_amount
CREATE TRIGGER update_funding_round_raised_amount_trigger
  AFTER UPDATE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION update_funding_round_raised_amount(); 