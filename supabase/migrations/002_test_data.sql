-- Test data for profiles
INSERT INTO profiles (id, name, bio, location, website, occupation, avatar_url, is_admin)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'John Doe', 'Serial Entrepreneur', 'San Francisco', 'https://johndoe.com', 'CEO', 'https://avatar.com/john', true),
  ('22222222-2222-2222-2222-222222222222', 'Jane Smith', 'Venture Capitalist', 'New York', 'https://janesmith.com', 'Partner', 'https://avatar.com/jane', false),
  ('33333333-3333-3333-3333-333333333333', 'Mike Johnson', 'Tech Founder', 'London', 'https://mikejohnson.com', 'CTO', 'https://avatar.com/mike', false);

-- Test data for startups
INSERT INTO startups (
  user_id, name, description, industry, stage, founded_date, website, 
  logo_url, pitch_deck_url, traction, metrics, funding_goal, raised_amount, 
  valuation, team_size, revenue, growth_rate, market_size, competitors,
  social_links, milestones, team_members, tech_stack, awards, is_featured, is_verified
)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'TechStart',
  'AI-powered business solutions',
  'Artificial Intelligence',
  'Series A',
  '2022-01-01',
  'https://techstart.com',
  'https://logo.com/techstart',
  'https://pitchdeck.com/techstart',
  '{"users": 10000, "revenue_growth": "200%"}',
  '{"mrr": 50000, "cac": 100, "ltv": 1000}',
  5000000,
  2000000,
  20000000,
  15,
  100000,
  2.5,
  1000000000,
  ARRAY['Competitor1', 'Competitor2'],
  '{"linkedin": "https://linkedin.com/techstart", "twitter": "https://twitter.com/techstart"}',
  '[{"date": "2022-06-01", "title": "Product Launch", "description": "Launched MVP"}]',
  '[{"name": "John Doe", "role": "CEO", "linkedin": "https://linkedin.com/johndoe"}]',
  ARRAY['React', 'Node.js', 'PostgreSQL'],
  ARRAY['Best AI Startup 2023'],
  true,
  true
);

-- Test data for investors
INSERT INTO investors (
  user_id, name, type, investment_focus, min_investment, max_investment,
  preferred_stages, preferred_industries, portfolio_size, total_invested,
  company_name, company_website, company_logo_url, investment_history,
  social_links, is_verified, is_active, preferred_geographies,
  investment_criteria, portfolio_companies
)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Jane Smith',
  'VC',
  ARRAY['AI', 'SaaS'],
  100000,
  5000000,
  ARRAY['Seed', 'Series A'],
  ARRAY['Technology', 'Healthcare'],
  25,
  50000000,
  'Venture Capital Partners',
  'https://vcp.com',
  'https://logo.com/vcp',
  '[{"amount": 2000000, "date": "2023-01-01", "startup_id": "11111111-1111-1111-1111-111111111111"}]',
  '{"linkedin": "https://linkedin.com/janesmith", "twitter": "https://twitter.com/janesmith"}',
  true,
  true,
  ARRAY['North America', 'Europe'],
  '{"min_team_size": 3, "min_revenue": 10000}',
  '[{"startup_id": "11111111-1111-1111-1111-111111111111", "investment_date": "2023-01-01", "amount": 2000000}]'
);

-- Test data for funding rounds
INSERT INTO funding_rounds (
  startup_id, round_type, target_amount, raised_amount, valuation,
  deadline, status, minimum_investment, terms_summary, documents,
  milestones, use_of_funds, is_oversubscribed, lead_investor_id,
  round_highlights
)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Series A',
  5000000,
  2000000,
  20000000,
  '2023-12-31',
  'open',
  100000,
  'Standard Series A terms with 1x liquidation preference',
  '[{"type": "term_sheet", "url": "https://docs.com/terms", "name": "Term Sheet"}]',
  '[{"date": "2023-06-01", "description": "Product Development", "status": "in_progress"}]',
  ARRAY['Product Development', 'Marketing', 'Team Expansion'],
  false,
  '22222222-2222-2222-2222-222222222222',
  ARRAY['Strong traction', 'Experienced team', 'Large market opportunity']
);

-- Test data for events
INSERT INTO events (
  organizer_id, title, description, event_type, start_time, end_time,
  location, virtual_link, capacity, status, cover_image_url,
  registration_deadline, price, currency, tags, speakers, agenda,
  requirements, is_featured, registration_link
)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'AI Startup Pitch Day',
  'Annual pitch event for AI startups',
  'Pitch Day',
  '2023-12-01 10:00:00+00',
  '2023-12-01 18:00:00+00',
  'San Francisco',
  'https://zoom.com/event',
  100,
  'upcoming',
  'https://cover.com/event',
  '2023-11-25 23:59:59+00',
  100,
  'USD',
  ARRAY['AI', 'Startups', 'Pitch'],
  '[{"name": "Jane Smith", "title": "Partner", "company": "VCP", "bio": "Expert in AI investments"}]',
  '[{"time": "10:00", "title": "Opening Remarks", "description": "Welcome to Pitch Day", "speaker": "Jane Smith"}]',
  ARRAY['AI startup', 'Minimum 6 months old', 'Traction'],
  true,
  'https://register.com/event'
);

-- Test data for leaderboard
INSERT INTO leaderboard (
  user_id, user_type, points, rank, achievements, category,
  badges, activity_score, engagement_score, growth_score,
  last_updated, previous_rank, rank_change, achievements_unlocked
)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'startup',
  1000,
  1,
  '{"total_posts": 50, "total_comments": 200}',
  'overall',
  ARRAY['top_performer', 'rising_star'],
  85,
  90,
  95,
  NOW(),
  2,
  1,
  ARRAY['first_post', 'first_follower', 'first_investment']
);

-- Test data for messages
INSERT INTO messages (
  sender_id, receiver_id, content, subject, message_type,
  attachments, read, is_archived, parent_message_id, metadata
)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Interested in your startup. Let''s discuss investment opportunities.',
  'Investment Interest',
  'investment',
  '[{"type": "pdf", "url": "https://docs.com/investment", "name": "Investment Proposal"}]',
  false,
  false,
  NULL,
  '{"startup_id": "11111111-1111-1111-1111-111111111111", "funding_round_id": "11111111-1111-1111-1111-111111111111"}'
); 