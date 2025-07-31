-- Verify profiles
SELECT 
  COUNT(*) as profile_count,
  COUNT(CASE WHEN is_admin = true THEN 1 END) as admin_count
FROM profiles;

-- Verify startups
SELECT 
  s.name as startup_name,
  p.name as founder_name,
  s.valuation,
  s.team_size,
  s.revenue,
  s.is_verified
FROM startups s
JOIN profiles p ON s.user_id = p.id;

-- Verify investors
SELECT 
  i.name as investor_name,
  i.type,
  i.portfolio_size,
  i.total_invested,
  i.is_verified,
  jsonb_array_length(i.portfolio_companies) as portfolio_count
FROM investors i;

-- Verify funding rounds
SELECT 
  s.name as startup_name,
  fr.round_type,
  fr.target_amount,
  fr.raised_amount,
  fr.status,
  i.name as lead_investor
FROM funding_rounds fr
JOIN startups s ON fr.startup_id = s.id
JOIN investors i ON fr.lead_investor_id = i.id;

-- Verify events
SELECT 
  e.title,
  e.event_type,
  e.start_time,
  e.end_time,
  e.capacity,
  e.status,
  p.name as organizer
FROM events e
JOIN profiles p ON e.organizer_id = p.id;

-- Verify leaderboard
SELECT 
  p.name,
  l.user_type,
  l.points,
  l.rank,
  l.rank_change,
  array_length(l.badges, 1) as badge_count
FROM leaderboard l
JOIN profiles p ON l.user_id = p.id;

-- Verify messages
SELECT 
  sender.name as sender,
  receiver.name as receiver,
  m.subject,
  m.message_type,
  m.read,
  jsonb_array_length(m.attachments) as attachment_count
FROM messages m
JOIN profiles sender ON m.sender_id = sender.id
JOIN profiles receiver ON m.receiver_id = receiver.id;

-- Test JSON fields
SELECT 
  s.name as startup_name,
  s.traction->>'users' as user_count,
  s.metrics->>'mrr' as mrr,
  s.social_links->>'linkedin' as linkedin_url
FROM startups s;

-- Test array fields
SELECT 
  s.name as startup_name,
  array_length(s.competitors, 1) as competitor_count,
  array_length(s.tech_stack, 1) as tech_stack_count
FROM startups s;

-- Test relationships
SELECT 
  s.name as startup_name,
  i.name as investor_name,
  fr.round_type,
  fr.raised_amount
FROM startups s
JOIN funding_rounds fr ON s.id = fr.startup_id
JOIN investors i ON fr.lead_investor_id = i.id; 