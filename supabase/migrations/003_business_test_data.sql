-- Test data for profiles if they don't exist
INSERT INTO profiles (id, name, bio, location, website, occupation, avatar_url, is_admin)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  'John Doe',
  'Serial Entrepreneur',
  'San Francisco',
  'https://johndoe.com',
  'CEO',
  'https://avatar.com/john',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = '11111111-1111-1111-1111-111111111111'
);

INSERT INTO profiles (id, name, bio, location, website, occupation, avatar_url, is_admin)
SELECT 
  '22222222-2222-2222-2222-222222222222',
  'Jane Smith',
  'Venture Capitalist',
  'New York',
  'https://janesmith.com',
  'Partner',
  'https://avatar.com/jane',
  false
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = '22222222-2222-2222-2222-222222222222'
);

INSERT INTO profiles (id, name, bio, location, website, occupation, avatar_url, is_admin)
SELECT 
  '33333333-3333-3333-3333-333333333333',
  'Mike Johnson',
  'Tech Founder',
  'London',
  'https://mikejohnson.com',
  'CTO',
  'https://avatar.com/mike',
  false
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = '33333333-3333-3333-3333-333333333333'
);

-- Test data for startups if it doesn't exist
INSERT INTO startups (
  user_id, name, description, industry, stage, founded_date, website, 
  logo_url, pitch_deck_url, traction, metrics, funding_goal, raised_amount, 
  valuation, team_size, revenue, growth_rate, market_size, competitors,
  social_links, milestones, team_members, tech_stack, awards, is_featured, is_verified
)
SELECT 
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
WHERE NOT EXISTS (
  SELECT 1 FROM startups WHERE user_id = '11111111-1111-1111-1111-111111111111'
);

-- Test data for investors if it doesn't exist
INSERT INTO investors (
  user_id, name, type, investment_focus, min_investment, max_investment,
  preferred_stages, preferred_industries, portfolio_size, total_invested,
  company_name, company_website, company_logo_url, investment_history,
  social_links, is_verified, is_active, preferred_geographies,
  investment_criteria, portfolio_companies
)
SELECT 
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
WHERE NOT EXISTS (
  SELECT 1 FROM investors WHERE user_id = '22222222-2222-2222-2222-222222222222'
);

-- Test data for funding rounds if it doesn't exist
INSERT INTO funding_rounds (
  startup_id, round_type, target_amount, raised_amount, valuation,
  deadline, status, minimum_investment, terms_summary, documents,
  milestones, use_of_funds, is_oversubscribed, lead_investor_id,
  round_highlights
)
SELECT 
  s.id,
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
  i.id,
  ARRAY['Strong traction', 'Experienced team', 'Large market opportunity']
FROM startups s
JOIN investors i ON i.user_id = '22222222-2222-2222-2222-222222222222'
WHERE s.user_id = '11111111-1111-1111-1111-111111111111'
AND NOT EXISTS (
  SELECT 1 FROM funding_rounds fr WHERE fr.startup_id = s.id
);

-- Test data for events if it doesn't exist
INSERT INTO events (
  organizer_id, title, description, event_type, start_time, end_time,
  location, virtual_link, capacity, status, cover_image_url,
  registration_deadline, price, currency, tags, speakers, agenda,
  requirements, is_featured, registration_link
)
SELECT 
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
WHERE NOT EXISTS (
  SELECT 1 FROM events WHERE organizer_id = '22222222-2222-2222-2222-222222222222' AND title = 'AI Startup Pitch Day'
);

-- Test data for leaderboard if it doesn't exist
INSERT INTO leaderboard (
  user_id, user_type, points, rank, achievements, category,
  badges, activity_score, engagement_score, growth_score,
  last_updated, previous_rank, rank_change, achievements_unlocked
)
SELECT 
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
WHERE NOT EXISTS (
  SELECT 1 FROM leaderboard WHERE user_id = '11111111-1111-1111-1111-111111111111'
);

-- Test data for messages if it doesn't exist
INSERT INTO messages (
  sender_id, receiver_id, content, subject, message_type,
  attachments, read, is_archived, parent_message_id, metadata
)
SELECT 
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
WHERE NOT EXISTS (
  SELECT 1 FROM messages 
  WHERE sender_id = '22222222-2222-2222-2222-222222222222' 
  AND receiver_id = '11111111-1111-1111-1111-111111111111'
  AND subject = 'Investment Interest'
);

-- Test data for notifications if it doesn't exist
INSERT INTO notifications (
  user_id, type, title, message, data, read
)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  'investment',
  'New Investment Interest',
  'Jane Smith from VCP is interested in investing in your startup.',
  '{"investor_id": "22222222-2222-2222-2222-222222222222", "startup_id": "11111111-1111-1111-1111-111111111111"}',
  false
WHERE NOT EXISTS (
  SELECT 1 FROM notifications 
  WHERE user_id = '11111111-1111-1111-1111-111111111111'
  AND type = 'investment'
  AND title = 'New Investment Interest'
);

-- Test data for user preferences if it doesn't exist
INSERT INTO user_preferences (
  user_id, email_notifications, push_notifications, marketing_emails,
  theme, language, timezone, notification_preferences
)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  true,
  true,
  false,
  'dark',
  'en',
  'America/Los_Angeles',
  '{"investment_alerts": true, "message_notifications": true, "event_reminders": true}'
WHERE NOT EXISTS (
  SELECT 1 FROM user_preferences WHERE user_id = '11111111-1111-1111-1111-111111111111'
);

-- Test data for user connections if it doesn't exist
INSERT INTO user_connections (
  user_id, connected_user_id, status, connection_type, metadata
)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'accepted',
  'investor',
  '{"connection_date": "2023-01-01", "connection_source": "platform"}'
WHERE NOT EXISTS (
  SELECT 1 FROM user_connections 
  WHERE user_id = '11111111-1111-1111-1111-111111111111'
  AND connected_user_id = '22222222-2222-2222-2222-222222222222'
); 