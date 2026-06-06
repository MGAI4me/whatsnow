#!/bin/bash

# ==============================================================================
# WhatsNow Deployment Script for Ubuntu 26.04 (AWS EC2)
# ==============================================================================
# This script installs Node.js, PM2, Nginx, pulls the repository, builds the 
# application, starts it via PM2, and configures Nginx as a reverse proxy.
# ==============================================================================

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration variables
REPO_URL="https://github.com/MGAI4me/whatsnow.git"
APP_DIR="/var/www/whatsnow"
DOMAIN_OR_IP="your-domain-or-public-ip" # Update this to your domain or server public IP

echo "=========================================="
echo "Starting WhatsNow Server Setup..."
echo "=========================================="

# 1. Update system packages
echo "[1/7] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install Git, Curl, and Nginx
echo "[2/7] Installing Git, Curl, and Nginx..."
sudo apt install git curl nginx -y

# 3. Install Node.js (v20 LTS)
echo "[3/7] Installing Node.js v20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Verify Node and NPM installations
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 4. Install PM2 globally
echo "[4/7] Installing PM2 process manager..."
sudo npm install -g pm2

# 5. Clone repository
echo "[5/7] Cloning WhatsNow repository..."
if [ -d "$APP_DIR" ]; then
    echo "Directory $APP_DIR already exists. Pulling latest changes..."
    cd "$APP_DIR"
    sudo git pull origin main
else
    echo "Cloning repository..."
    sudo mkdir -p /var/www
    sudo git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# Ensure correct permissions for the directory
sudo chown -R $USER:$USER "$APP_DIR"

# 6. Prompt user for .env configuration
if [ ! -f "$APP_DIR/.env" ]; then
    echo "=========================================="
    echo "Creating .env configuration file..."
    echo "=========================================="
    
    # Create empty .env file
    touch "$APP_DIR/.env"
    
    echo "Please populate the .env file with your production environment keys."
    echo "Run: nano $APP_DIR/.env"
    echo "Make sure to include NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY."
    echo "=========================================="
fi

# 7. Install dependencies and build nextjs app
echo "[6/7] Installing dependencies & building..."
npm install
npm run build

# 8. Start application with PM2
echo "[7/7] Starting WhatsNow application with PM2..."
pm2 delete whatsnow || true
pm2 start npm --name "whatsnow" -- start

# Configure PM2 to restart application on system boot
pm2 startup
pm2 save

# 9. Configure Nginx Reverse Proxy
echo "=========================================="
echo "Configuring Nginx Reverse Proxy..."
echo "=========================================="

NGINX_CONF="/etc/nginx/sites-available/whatsnow"

sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        
        # Security headers
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable Nginx config and restart service
sudo ln -sf "$NGINX_CONF" "/etc/nginx/sites-enabled/default"
sudo nginx -t
sudo system systemctl restart nginx || sudo service nginx restart

echo "=========================================="
echo "WhatsNow Setup Complete!"
echo "Next Steps:"
echo "1. Run 'nano $APP_DIR/.env' to insert your environment variables."
echo "2. Run 'pm2 restart whatsnow' after updating your .env."
echo "3. (Optional) Setup SSL for HTTPS by running:"
echo "   sudo apt install certbot python3-certbot-nginx -y"
echo "   sudo certbot --nginx -d $DOMAIN_OR_IP"
echo "=========================================="
