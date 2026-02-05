#!/bin/bash
# VPS Initial Setup Script for Cổ Nhơn Production
# Run this once on a fresh Ubuntu VPS

set -e

echo "🚀 Starting VPS setup for Cổ Nhơn Production..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install -y git

# Create deployment directory
sudo mkdir -p /opt/conhon
sudo chown $USER:$USER /opt/conhon

# Clone repository
cd /opt/conhon
git clone https://github.com/initforge/vhdg-conhon.git .

# Create .env file
cat > .env << EOF
DB_PASSWORD=your_secure_db_password
JWT_SECRET=your_secure_jwt_secret
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key
EOF

echo "⚠️  IMPORTANT: Edit /opt/conhon/.env with your actual credentials!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with real credentials"
echo "2. Add GitHub secrets in your repo settings:"
echo "   - VPS_HOST: Your VPS IP address"
echo "   - VPS_USER: SSH username (e.g., root or ubuntu)"
echo "   - VPS_SSH_KEY: Private SSH key for authentication"
echo "3. Generate SSH key for GitHub Actions:"
echo "   ssh-keygen -t ed25519 -C 'github-actions'"
echo "   Add public key to ~/.ssh/authorized_keys"
echo "   Add private key to GitHub Secrets as VPS_SSH_KEY"
echo ""
echo "4. Start the application:"
echo "   cd /opt/conhon && docker-compose up -d"
echo ""
echo "✅ VPS setup complete!"
