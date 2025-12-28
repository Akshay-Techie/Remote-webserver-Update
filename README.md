# NiceSite — Starter landing page

This repository contains a minimal, attractive single-page website you can customize quickly.

Files added:

- `index.html` — the page markup
- `styles.css` — modern responsive styles
- `script.js` — small client-side interactions

Preview locally

1. From the repository root, start a simple HTTP server:

```bash
python3 -m http.server 8000
# NiceSite — Starter landing page

This repository contains a minimal, attractive single-page website you can customize quickly.

Files added:

- `index.html` — the page markup
- `styles.css` — modern responsive styles
- `script.js` — small client-side interactions

Preview locally

1. From the repository root, start a simple HTTP server:

```bash
python3 -m http.server 8000
```

2. Open `http://localhost:8000` in your browser.

Notes

- This is a static template. The contact form is client-side only (no backend).
- Customize copy, colors in `styles.css`, and add assets as needed.

Deployment (GitHub → Jenkins → Amazon Linux httpd)
-------------------------------------------------

This section explains one straightforward flow to deploy this static site to an Amazon Linux HTTPD server using Jenkins.

High-level steps

- Push this repository to a new GitHub repo.
- Configure Jenkins to pull the repository (multibranch or pipeline job). A `Jenkinsfile` is included for an automated pipeline.
- Configure SSH key-based access from your Jenkins executor to the Amazon Linux server and give the deploy user write access to the target document root.

Prepare the Amazon Linux server (example commands)

1. Install httpd and enable service:

```bash
sudo yum install -y httpd
sudo systemctl enable --now httpd
```

2. Optionally create a deploy user and allow it to write to the site directory (recommended instead of using `root`):

```bash
# create user 'deploy'
sudo adduser deploy
sudo mkdir -p /var/www/html
sudo chown -R deploy:deploy /var/www/html
# add your public key to /home/deploy/.ssh/authorized_keys
```

If you prefer to use `ec2-user` (default on many AMIs), adjust the Jenkins credentials and ownership accordingly:

```bash
sudo chown -R ec2-user:apache /var/www/html
```

Notes about Ubuntu servers

- On Ubuntu/Debian the package and service name is `apache2` and the web user is typically `www-data`. Use `sudo apt install apache2` and `sudo systemctl restart apache2`.

Jenkins setup

1. Add SSH credentials in Jenkins (Credentials → System → Global) as an "SSH Username with private key". Note the credential ID (the `Jenkinsfile` uses `deploy-key` by default).
2. Create a Pipeline (or Multibranch Pipeline) job pointing at your GitHub repo. If using a Pipeline job, you can either use the `Jenkinsfile` in repo or paste a pipeline script that calls `deploy.sh`.
3. The included `Jenkinsfile` does the following:
	- Checks out the repository
	- Uses the Jenkins SSH Agent plugin (`sshagent`) with the SSH credential to run an `rsync` from the workspace to the remote server
	- Attempts to restart `httpd` (or `apache2`) on the remote host

Example Jenkinsfile usage notes

- The pipeline expects these parameters (defaults are placeholders): `REMOTE_HOST`, `REMOTE_USER`, `REMOTE_DIR`, `SSH_CREDENTIALS_ID`, `SSH_PORT`.
- The remote user must have SSH public key access and permission to write into `REMOTE_DIR`. Restarting the service with `sudo systemctl restart httpd` requires passwordless sudo for that user or a sudoers rule; alternatively restart manually or add a privileged script on the server.

Manual deployment (local)

You can also deploy manually from your workstation using the included `deploy.sh` helper:

```bash
./deploy.sh ec2-user your.remote.host /var/www/html 22
```

Security & production notes

- Use key-based SSH authentication and limit the key's scope (source IP, forced commands) where possible.
- For production, consider building release artifacts and serving them via a CDN or S3 + CloudFront (if using a static site).
- If you need HTTPS, configure a TLS certificate (Amazon Certificate Manager + load balancer or Let's Encrypt on the server).
