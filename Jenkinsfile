pipeline {
  agent any
  parameters {
    string(name: 'REMOTE_HOST', defaultValue: 'your.remote.host', description: 'Remote host (Amazon Linux)')
    string(name: 'REMOTE_USER', defaultValue: 'ec2-user', description: 'SSH user on remote host')
    string(name: 'REMOTE_DIR', defaultValue: '/var/www/html', description: 'Remote document root')
    string(name: 'SSH_CREDENTIALS_ID', defaultValue: 'deploy-key', description: 'Jenkins SSH private key credential id')
    string(name: 'SSH_PORT', defaultValue: '22', description: 'SSH port')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Deploy to remote') {
      steps {
        script {
          // Use ssh agent plugin with credentials stored in Jenkins
          sshagent (credentials: [params.SSH_CREDENTIALS_ID]) {
            sh '''#!/bin/bash -e
            echo "Deploying to ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}"
            rsync -avz --delete --exclude=.git --exclude=README.md -e "ssh -p ${SSH_PORT} -o StrictHostKeyChecking=no" ./ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}
            ssh -p ${SSH_PORT} -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} 'sudo systemctl restart httpd || sudo systemctl restart apache2 || true'
            '''
          }
        }
      }
    }
  }

  post {
    success {
      echo 'Deployment finished successfully.'
    }
    failure {
      echo 'Deployment failed — check console output.'
    }
  }
}
