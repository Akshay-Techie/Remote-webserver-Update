#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy.sh <remote-user> <remote-host> [remote-dir] [ssh-port]
# Example: ./deploy.sh ec2-user 34.56.78.90 /var/www/html 22

REMOTE_USER=${1:-ec2-user}
REMOTE_HOST=${2:-your.remote.host}
REMOTE_DIR=${3:-/var/www/html}
SSH_PORT=${4:-22}

echo "Deploying to ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR} (ssh port: ${SSH_PORT})"

# ensure rsync is present
if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required. Install it (on Ubuntu: sudo apt install rsync)"
  exit 2
fi

RSYNC_OPTS=( -az --delete --exclude=.git --exclude=README.md )

rsync -e "ssh -p ${SSH_PORT} -o StrictHostKeyChecking=no" "${RSYNC_OPTS[@]}" ./ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}

echo "Files synced. You may need to restart httpd on the remote host."
echo "To restart (example): ssh -p ${SSH_PORT} ${REMOTE_USER}@${REMOTE_HOST} 'sudo systemctl restart httpd'"
