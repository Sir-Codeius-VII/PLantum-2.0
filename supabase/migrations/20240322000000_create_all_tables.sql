-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    payment_id TEXT UNIQUE,
    payment_data JSONB NOT NULL,
    payment_status_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    category TEXT,
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create project milestones table
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create project deliverables table
CREATE TABLE project_deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    due_date TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create escrow table
CREATE TABLE escrow (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    release_conditions JSONB NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    released_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- Create posts table
CREATE TABLE posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    media_url TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create post_likes table
CREATE TABLE post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(post_id, user_id)
);

-- Create post_comments table
CREATE TABLE post_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create escrow_wallets table
CREATE TABLE escrow_wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    startup_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(19,4) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'released', 'reversed', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    released_at TIMESTAMP WITH TIME ZONE,
    reversed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT amount_positive CHECK (amount > 0)
);

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    occupation TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create startups table
CREATE TABLE startups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    industry TEXT,
    stage TEXT,
    founded_date DATE,
    website TEXT,
    logo_url TEXT,
    pitch_deck_url TEXT,
    traction JSONB,
    metrics JSONB,
    funding_goal DECIMAL(19,4),
    raised_amount DECIMAL(19,4),
    valuation DECIMAL(19,4),
    team_size INTEGER,
    revenue DECIMAL(19,4),
    growth_rate DECIMAL(5,2),
    market_size DECIMAL(19,4),
    competitors TEXT[],
    social_links JSONB,
    milestones JSONB,
    team_members JSONB,
    tech_stack TEXT[],
    awards TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create investors table
CREATE TABLE investors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    investment_focus TEXT[],
    min_investment DECIMAL(19,4),
    max_investment DECIMAL(19,4),
    preferred_stages TEXT[],
    preferred_industries TEXT[],
    portfolio_size INTEGER,
    total_invested DECIMAL(19,4),
    company_name TEXT,
    company_website TEXT,
    company_logo_url TEXT,
    investment_history JSONB,
    social_links JSONB,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    preferred_geographies TEXT[],
    investment_criteria JSONB,
    portfolio_companies JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create funding_rounds table
CREATE TABLE funding_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    round_type TEXT NOT NULL,
    target_amount DECIMAL(19,4) NOT NULL,
    raised_amount DECIMAL(19,4),
    valuation DECIMAL(19,4),
    deadline TIMESTAMPTZ,
    status TEXT NOT NULL,
    minimum_investment DECIMAL(19,4),
    terms_summary TEXT,
    documents JSONB,
    milestones JSONB,
    use_of_funds TEXT[],
    is_oversubscribed BOOLEAN DEFAULT false,
    lead_investor_id UUID REFERENCES investors(id),
    round_highlights TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT,
    virtual_link TEXT,
    capacity INTEGER,
    status TEXT NOT NULL,
    cover_image_url TEXT,
    registration_deadline TIMESTAMPTZ,
    price DECIMAL(10,2),
    currency TEXT,
    tags TEXT[],
    speakers JSONB,
    agenda JSONB,
    requirements TEXT[],
    is_featured BOOLEAN DEFAULT false,
    registration_link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create leaderboard table
CREATE TABLE leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_type TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    rank INTEGER,
    achievements JSONB,
    category TEXT,
    badges TEXT[],
    activity_score INTEGER,
    engagement_score INTEGER,
    growth_score INTEGER,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    previous_rank INTEGER,
    rank_change INTEGER,
    achievements_unlocked TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    subject TEXT,
    message_type TEXT,
    attachments JSONB,
    read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    theme TEXT DEFAULT 'light',
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    notification_preferences JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create user_connections table
CREATE TABLE user_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    connected_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    connection_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, connected_user_id)
);

-- Create security_logs table
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create email_preferences table
CREATE TABLE IF NOT EXISTS email_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_notifications BOOLEAN DEFAULT true,
  security_alerts BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  system_updates BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX payments_user_id_idx ON payments(user_id);
CREATE INDEX payments_status_idx ON payments(status);
CREATE INDEX payments_payment_id_idx ON payments(payment_id);

CREATE INDEX projects_owner_id_idx ON projects(owner_id);
CREATE INDEX projects_status_idx ON projects(status);
CREATE INDEX projects_category_idx ON projects(category);

CREATE INDEX project_milestones_project_id_idx ON project_milestones(project_id);
CREATE INDEX project_milestones_status_idx ON project_milestones(status);
CREATE INDEX project_deliverables_project_id_idx ON project_deliverables(project_id);
CREATE INDEX project_deliverables_status_idx ON project_deliverables(status);

CREATE INDEX escrow_payment_id_idx ON escrow(payment_id);
CREATE INDEX escrow_seller_id_idx ON escrow(seller_id);
CREATE INDEX escrow_buyer_id_idx ON escrow(buyer_id);
CREATE INDEX escrow_project_id_idx ON escrow(project_id);
CREATE INDEX escrow_status_idx ON escrow(status);

CREATE INDEX posts_author_id_idx ON posts(author_id);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX post_likes_post_id_idx ON post_likes(post_id);
CREATE INDEX post_likes_user_id_idx ON post_likes(user_id);
CREATE INDEX post_comments_post_id_idx ON post_comments(post_id);
CREATE INDEX post_comments_author_id_idx ON post_comments(author_id);
CREATE INDEX escrow_wallets_startup_id_idx ON escrow_wallets(startup_id);
CREATE INDEX escrow_wallets_investor_id_idx ON escrow_wallets(investor_id);
CREATE INDEX escrow_wallets_status_idx ON escrow_wallets(status);

CREATE INDEX profiles_name_idx ON profiles(name);
CREATE INDEX profiles_is_admin_idx ON profiles(is_admin);

CREATE INDEX startups_user_id_idx ON startups(user_id);
CREATE INDEX startups_industry_idx ON startups(industry);
CREATE INDEX startups_stage_idx ON startups(stage);
CREATE INDEX startups_is_featured_idx ON startups(is_featured);
CREATE INDEX startups_is_verified_idx ON startups(is_verified);

CREATE INDEX investors_user_id_idx ON investors(user_id);
CREATE INDEX investors_type_idx ON investors(type);
CREATE INDEX investors_is_verified_idx ON investors(is_verified);
CREATE INDEX investors_is_active_idx ON investors(is_active);

CREATE INDEX funding_rounds_startup_id_idx ON funding_rounds(startup_id);
CREATE INDEX funding_rounds_round_type_idx ON funding_rounds(round_type);
CREATE INDEX funding_rounds_status_idx ON funding_rounds(status);
CREATE INDEX funding_rounds_lead_investor_id_idx ON funding_rounds(lead_investor_id);

CREATE INDEX events_organizer_id_idx ON events(organizer_id);
CREATE INDEX events_event_type_idx ON events(event_type);
CREATE INDEX events_status_idx ON events(status);
CREATE INDEX events_start_time_idx ON events(start_time);
CREATE INDEX events_is_featured_idx ON events(is_featured);

CREATE INDEX leaderboard_user_id_idx ON leaderboard(user_id);
CREATE INDEX leaderboard_user_type_idx ON leaderboard(user_type);
CREATE INDEX leaderboard_points_idx ON leaderboard(points DESC);
CREATE INDEX leaderboard_rank_idx ON leaderboard(rank);
CREATE INDEX leaderboard_category_idx ON leaderboard(category);

CREATE INDEX messages_sender_id_idx ON messages(sender_id);
CREATE INDEX messages_receiver_id_idx ON messages(receiver_id);
CREATE INDEX messages_message_type_idx ON messages(message_type);
CREATE INDEX messages_read_idx ON messages(read);
CREATE INDEX messages_is_archived_idx ON messages(is_archived);
CREATE INDEX messages_parent_message_id_idx ON messages(parent_message_id);

CREATE INDEX user_roles_user_id_idx ON user_roles(user_id);
CREATE INDEX user_roles_role_idx ON user_roles(role);

CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_type_idx ON notifications(type);
CREATE INDEX notifications_read_idx ON notifications(read);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);

CREATE INDEX user_preferences_user_id_idx ON user_preferences(user_id);

CREATE INDEX user_connections_user_id_idx ON user_connections(user_id);
CREATE INDEX user_connections_connected_user_id_idx ON user_connections(connected_user_id);
CREATE INDEX user_connections_status_idx ON user_connections(status);
CREATE INDEX user_connections_connection_type_idx ON user_connections(connection_type);

-- Add indexes
CREATE INDEX IF NOT EXISTS security_logs_user_id_idx ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS security_logs_event_type_idx ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS security_logs_created_at_idx ON security_logs(created_at);

CREATE INDEX IF NOT EXISTS email_preferences_user_id_idx ON email_preferences(user_id);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Users can view their own payments"
    ON payments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments"
    ON payments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only system can update payments"
    ON payments FOR UPDATE
    USING (false);

-- Create policies for projects
CREATE POLICY "Users can view all projects"
    ON projects FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid() = owner_id);

-- Create policies for milestones
CREATE POLICY "Users can view project milestones"
    ON project_milestones FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_milestones.project_id
            AND (
                projects.owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM escrow
                    WHERE escrow.project_id = projects.id
                    AND (escrow.buyer_id = auth.uid() OR escrow.seller_id = auth.uid())
                )
            )
        )
    );

CREATE POLICY "Project owners can manage milestones"
    ON project_milestones FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_milestones.project_id
            AND projects.owner_id = auth.uid()
        )
    );

-- Create policies for deliverables
CREATE POLICY "Users can view project deliverables"
    ON project_deliverables FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_deliverables.project_id
            AND (
                projects.owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM escrow
                    WHERE escrow.project_id = projects.id
                    AND (escrow.buyer_id = auth.uid() OR escrow.seller_id = auth.uid())
                )
            )
        )
    );

CREATE POLICY "Project owners can manage deliverables"
    ON project_deliverables FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_deliverables.project_id
            AND projects.owner_id = auth.uid()
        )
    );

-- Create policies for escrow
CREATE POLICY "Users can view their own escrow transactions"
    ON escrow FOR SELECT
    USING (
        auth.uid() = seller_id OR
        auth.uid() = buyer_id OR
        auth.uid() IN (
            SELECT user_id FROM user_roles
            WHERE role = 'admin'
        )
    );

CREATE POLICY "Only system can create escrow transactions"
    ON escrow FOR INSERT
    WITH CHECK (false);

CREATE POLICY "Only system can update escrow transactions"
    ON escrow FOR UPDATE
    USING (false);

-- Create policies for posts
CREATE POLICY "Posts are viewable by everyone"
    ON posts FOR SELECT
    USING (true);

CREATE POLICY "Users can create posts"
    ON posts FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
    ON posts FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
    ON posts FOR DELETE
    USING (auth.uid() = author_id);

-- Post likes policies
CREATE POLICY "Post likes are viewable by everyone"
    ON post_likes FOR SELECT
    USING (true);

CREATE POLICY "Users can like posts"
    ON post_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
    ON post_likes FOR DELETE
    USING (auth.uid() = user_id);

-- Post comments policies
CREATE POLICY "Post comments are viewable by everyone"
    ON post_comments FOR SELECT
    USING (true);

CREATE POLICY "Users can create comments"
    ON post_comments FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments"
    ON post_comments FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments"
    ON post_comments FOR DELETE
    USING (auth.uid() = author_id);

-- Escrow wallets policies
CREATE POLICY "Startups can view their own escrow wallets"
    ON escrow_wallets FOR SELECT
    USING (auth.uid() = startup_id);

CREATE POLICY "Investors can view their own escrow wallets"
    ON escrow_wallets FOR SELECT
    USING (auth.uid() = investor_id);

CREATE POLICY "Investors can create escrow wallets"
    ON escrow_wallets FOR INSERT
    WITH CHECK (auth.uid() = investor_id);

CREATE POLICY "Startups can update their own escrow wallets"
    ON escrow_wallets FOR UPDATE
    USING (auth.uid() = startup_id)
    WITH CHECK (auth.uid() = startup_id);

CREATE POLICY "Investors can update their own escrow wallets"
    ON escrow_wallets FOR UPDATE
    USING (auth.uid() = investor_id)
    WITH CHECK (auth.uid() = investor_id);

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create policies for startups
CREATE POLICY "Startups are viewable by everyone"
    ON startups FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own startup"
    ON startups FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own startup"
    ON startups FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policies for investors
CREATE POLICY "Investors are viewable by everyone"
    ON investors FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own investor profile"
    ON investors FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investor profile"
    ON investors FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policies for funding rounds
CREATE POLICY "Funding rounds are viewable by everyone"
    ON funding_rounds FOR SELECT
    USING (true);

CREATE POLICY "Startup owners can manage their funding rounds"
    ON funding_rounds FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = funding_rounds.startup_id
            AND startups.user_id = auth.uid()
        )
    );

-- Create policies for events
CREATE POLICY "Events are viewable by everyone"
    ON events FOR SELECT
    USING (true);

CREATE POLICY "Users can create events"
    ON events FOR INSERT
    WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update their own events"
    ON events FOR UPDATE
    USING (auth.uid() = organizer_id);

-- Create policies for leaderboard
CREATE POLICY "Leaderboard is viewable by everyone"
    ON leaderboard FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own leaderboard entry"
    ON leaderboard FOR SELECT
    USING (auth.uid() = user_id);

-- Create policies for messages
CREATE POLICY "Users can view their own messages"
    ON messages FOR SELECT
    USING (
        auth.uid() = sender_id OR
        auth.uid() = receiver_id
    );

CREATE POLICY "Users can create messages"
    ON messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
    ON messages FOR UPDATE
    USING (auth.uid() = sender_id);

-- Create policies for user roles
CREATE POLICY "User roles are viewable by everyone"
    ON user_roles FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage user roles"
    ON user_roles FOR ALL
    USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles
            WHERE role = 'admin'
        )
    );

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policies for user preferences
CREATE POLICY "Users can view their own preferences"
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences"
    ON user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for user connections
CREATE POLICY "Users can view their own connections"
    ON user_connections FOR SELECT
    USING (
        auth.uid() = user_id OR
        auth.uid() = connected_user_id
    );

CREATE POLICY "Users can create connections"
    ON user_connections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections"
    ON user_connections FOR UPDATE
    USING (
        auth.uid() = user_id OR
        auth.uid() = connected_user_id
    );

-- Create policies for security_logs
CREATE POLICY "Users can view their own security logs"
  ON security_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all security logs"
  ON security_logs
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create policies for email_preferences
CREATE POLICY "Users can view their own email preferences"
  ON email_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own email preferences"
  ON email_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all email preferences"
  ON email_preferences
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for security_logs
CREATE TRIGGER update_security_logs_updated_at
  BEFORE UPDATE ON security_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for email_preferences
CREATE TRIGGER update_email_preferences_updated_at
  BEFORE UPDATE ON email_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 