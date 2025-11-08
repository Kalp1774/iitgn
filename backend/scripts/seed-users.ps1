# PowerShell script to seed test users with bcrypt-hashed passwords
# Run from backend directory: .\scripts\seed-users.ps1

Write-Host "🔐 Generating bcrypt hashes and creating test users..." -ForegroundColor Cyan

# Check if Docker containers are running
$postgresContainer = docker ps --filter "name=postgres" -q
if (-not $postgresContainer) {
    Write-Host "❌ PostgreSQL container is not running. Please start it with: docker-compose up -d postgres" -ForegroundColor Red
    exit 1
}

$backendContainer = docker ps --filter "name=backend" -q
if (-not $backendContainer) {
    Write-Host "⚠️  Backend container is not running. Starting it temporarily..." -ForegroundColor Yellow
}

# Function to generate hash and insert user
function Create-User {
    param(
        [string]$Name,
        [string]$Email,
        [string]$Password,
        [string]$Role
    )

    Write-Host "Creating user: $Name ($Email) with role: $Role" -ForegroundColor Green

    # Generate bcrypt hash
    $hashOutput = docker compose run --rm backend node -e "console.log(require('bcryptjs').hashSync('$Password', 10))" 2>&1
    $hash = ($hashOutput | Select-Object -Last 1).Trim()

    if (-not $hash -or $hash -match "error" -or $hash -match "Cannot") {
        Write-Host "❌ Failed to generate hash for $Name" -ForegroundColor Red
        Write-Host "Output: $hashOutput" -ForegroundColor Yellow
        return $false
    }

    Write-Host "Generated hash: $($hash.Substring(0, 20))..." -ForegroundColor Gray

    # Insert into database
    $insertCommand = "INSERT INTO \"User\" (name, email, password, role, created_at) VALUES ('$Name', '$Email', '$hash', '$Role', NOW()) ON CONFLICT (email) DO UPDATE SET name = '$Name', password = '$hash', role = '$Role';"
    
    $result = docker exec -i $postgresContainer psql -U hrms_user -d hrms_db -c $insertCommand 2>&1

    if ($LASTEXITCODE -eq 0 -and $result -notmatch "ERROR") {
        Write-Host "✅ Successfully created/updated user: $Name" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Failed to create user: $Name" -ForegroundColor Red
        Write-Host "Error: $result" -ForegroundColor Yellow
        return $false
    }
}

# Create test users
$users = @(
    @{ Name = "Admin User"; Email = "admin@example.com"; Password = "admin123"; Role = "ADMIN" },
    @{ Name = "HR Manager"; Email = "hr@example.com"; Password = "hr123"; Role = "HR" },
    @{ Name = "Employee User"; Email = "employee@example.com"; Password = "emp123"; Role = "EMPLOYEE" }
)

$successCount = 0
foreach ($user in $users) {
    if (Create-User -Name $user.Name -Email $user.Email -Password $user.Password -Role $user.Role) {
        $successCount++
    }
    Start-Sleep -Seconds 1
}

Write-Host "`n📊 Summary: $successCount/$($users.Count) users created/updated" -ForegroundColor Cyan

# Verify users
Write-Host "`n🔍 Verifying users in database..." -ForegroundColor Cyan
docker exec -it $postgresContainer psql -U hrms_user -d hrms_db -c "SELECT id, name, email, role, created_at FROM \"User\" ORDER BY id;"

Write-Host "`n✅ Test users setup complete!" -ForegroundColor Green
Write-Host "`n📝 Login credentials:" -ForegroundColor Cyan
Write-Host "  Admin:    admin@example.com / admin123" -ForegroundColor White
Write-Host "  HR:       hr@example.com / hr123" -ForegroundColor White
Write-Host "  Employee: employee@example.com / emp123" -ForegroundColor White

