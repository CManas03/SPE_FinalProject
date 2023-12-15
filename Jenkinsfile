pipeline {
    agent any
    environment {
        portfolio = ""
        Helper = ""
        backend = ""
        PORTFOLIO = "cmanas03/portfolioapp"
        HELPER = "cmanas03/helper"
        BACKEND = "cmanas03/backend"
        REGISTRY_CREDENTIAL = 'DockerHubCred'
    }
    stages {
        stage('Stage 0: Pull Mongo Docker Image') {
            steps {
                echo 'Pulling Mongo Docker image from DockerHub'
                script {
                    docker.withRegistry('', 'DockerHubCred') {
                        docker.image("mongo:latest").pull()
                    }
                }
            }
        }
        stage('Stage 1: Git Clone') {
            steps {
                echo 'Cloning the Git repository'
                git branch: 'main', url: 'https://github.com/CManas03/SPE_FinalProject.git'
            }
        }
        stage('Build and push Backend') {
            steps {
                script {
                    backend = docker.build(env.BACKEND, './Backend')
                    docker.withRegistry('', REGISTRY_CREDENTIAL) {
                        backend.push('latest')
                    }
                }
            }
        }
        stage('Build and push PortFolio'){
            steps {
                script {
                    portfolio = docker.build(env.PORTFOLIO, './PortfolioApp')
                    docker.withRegistry('', REGISTRY_CREDENTIAL) {
                        portfolio.push('latest')
                    }
                }
            }
        }
        stage('Build and push Helper') {
            steps {
                script {
                    Helper = docker.build(env.HELPER, './helper')
                    docker.withRegistry('', REGISTRY_CREDENTIAL) {
                        Helper.push('latest')
                    }
                }
            }
        }
        stage('Pruning and stopping Containers') {
            steps {
                script {
                    def containers = sh(script: 'docker ps -a -q', returnStdout: true).trim()
                    echo "Containers found: ${containers}"
        
                    if (containers) {
                        sh "docker stop ${containers}"
                    } else {
                        echo "No containers found to stop."
                    }
        
                    sh 'docker container prune -f'
                    sh 'docker image prune -f'
                }
            }
        }
        stage('Ansible Deployment') {
            steps {
                ansiblePlaybook colorized: true,
                installation: 'Ansible',
                inventory: './Deployment/inventory',
                playbook: './Deployment/playbook.yml'
            }
        }
    }
}
