CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT '',
  price_usd NUMERIC(10,2) NOT NULL,
  duration_days NUMERIC(6,1) NOT NULL,
  start_month DATE NOT NULL,
  notes TEXT DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  dollar_rate NUMERIC(10,4) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO settings (id, dollar_rate) VALUES (1, 1) ON CONFLICT (id) DO NOTHING;
