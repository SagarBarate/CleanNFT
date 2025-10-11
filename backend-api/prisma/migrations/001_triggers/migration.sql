-- CreateTriggerFunctions
-- Create trigger functions for automatic updates

-- Function to update user's last login timestamp
CREATE OR REPLACE FUNCTION set_last_login()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update last_login_at if login was successful and user_id is provided
    IF NEW.success = true AND NEW.user_id IS NOT NULL THEN
        UPDATE users 
        SET last_login_at = NEW.occurred_at 
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update last_login_at on successful login
DROP TRIGGER IF EXISTS trigger_set_last_login ON login_events;
CREATE TRIGGER trigger_set_last_login
    AFTER INSERT ON login_events
    FOR EACH ROW
    EXECUTE FUNCTION set_last_login();

-- Function to update point balances when point ledger changes
CREATE OR REPLACE FUNCTION apply_points_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update the point balance for the user
    INSERT INTO point_balances (user_id, points, updated_at)
    VALUES (NEW.user_id, NEW.delta_points, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        points = point_balances.points + NEW.delta_points,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update point balances when point ledger is updated
DROP TRIGGER IF EXISTS trigger_apply_points_balance ON point_ledger;
CREATE TRIGGER trigger_apply_points_balance
    AFTER INSERT ON point_ledger
    FOR EACH ROW
    EXECUTE FUNCTION apply_points_balance();
