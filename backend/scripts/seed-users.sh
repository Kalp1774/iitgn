#!/bin/bash
# Bash script to seed test users with bcrypt-hashed passwords
# Run from backend directory: bash scripts/seed-users.sh

echo "🔐 Generating bcrypt hashes and creating test users..."

# Check if Docker containers are running
POSTGRES_CONTAINER=$(docker ps --filter "name=postgres" -q)
if [ -z "$POSTGRES_CONTAINER" ]; then
    echo "❌ PostgreSQL container is not running. Please start it with: docker-compose up -d postgres"
    exit 1
fi

# Function to create user
create_user() {
    local name=$1
    local email=$2
    local password=$3
    local role=$4

    echo "Creating user: $name ($email) with role: $role"

    # Generate bcrypt hash
    local hash=$(docker compose run --rm backend node -e "console.log(require('bcryptjs').hashSync('$password', 10))" 2>&1 | tail -1 | tr -d '\r\n')

    if [ -z "$hash" ] || [[ $hash == *"error"* ]] || [[ $hash == *"Cannot"* ]]; then
        echo "❌ Failed to generate hash for $name"
        return 1
    fi

    echo "Generated hash: ${hash:0:20}..."

    # Insert into database (with ON CONFLICT to handle existing users)
    docker exec -i "$POSTGRES_CONTAINER" psql -U hrms_user -d hrms_db -c "INSERT INTO \"User\" (name, email, password, role, created_at) VALUES ('$name', '$email', '$hash', '$role', NOW()) ON CONFLICT (email) DO UPDATE SET name = '$name', password = '$hash', role = '$role';" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "✅ Successfully created/updated user: $name"
        return 0
    else
        echo "❌ Failed to create user: $name"
        return 1
    fi
}

# Create test users
create_user "Admin User" "admin@example.com" "admin123" "ADMIN"
create_user "HR Manager" "hr@example.com" "hr123" "HR"
create_user "Employee User" "employee@example.com" "emp123" "EMPLOYEE"

# Verify users
echo ""
echo "🔍 Verifying users in database..."
docker exec -it "$POSTGRES_CONTAINER" psql -U hrms_user -d hrms_db -c "SELECT id, name, email, role, created_at FROM \"User\" ORDER BY id;"

echo ""
echo "✅ Test users setup complete!"
echo ""
echo "📝 Login credentials:"
echo "  Admin:    admin@example.com / admin123"
echo "  HR:       hr@example.com / hr123"
echo "  Employee: employee@example.com / emp123"

