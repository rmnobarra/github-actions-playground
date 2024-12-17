# GitHub Actions Playground

This repository serves as a comprehensive demonstration of various GitHub Actions workflows and features. It includes examples of different CI/CD patterns, Terraform automation, Docker integration, and reusable workflows.

## 🚀 Workflows Overview

### 1. Python Setup (00-python-setup.yaml)
- Basic Python environment setup
- Installs dependencies from requirements.txt
- Runs linting with flake8
- Executes pytest for testing

### 2. Reusable Workflows (02-using-reusable-workflow.yaml)
- Demonstrates how to create and use reusable workflows
- Accepts customizable inputs (message and runner type)
- Shows proper workflow inheritance and reuse patterns

### 3. Docker Volume Mounting (03-mount-volume.yaml)
- Shows how to mount GitHub workspace in Docker containers
- Demonstrates file generation and access within containers
- Basic Docker integration in GitHub Actions

### 4. Custom Docker Action (04-mount-using-action.yaml)
- Custom action for Docker volume mounting
- Packaged as a reusable component
- Includes proper action metadata and branding

### 5. Terraform Integration (05-terraform.yaml)
- Demonstrates Terraform automation in GitHub Actions
- Initializes and applies Terraform configurations
- Uses GitHub context variables in Terraform
- Generates dynamic files based on repository information

## 🛠️ Additional Components

### YAML to JSON Converter
- Node.js-based utility for converting YAML to JSON
- Includes watch mode for development
- Dependencies managed via npm

### Terraform Configuration
- Creates local files with repository information
- Uses variables from GitHub context
- Demonstrates basic Terraform resource creation

## 📝 Repository Structure

├── .github/workflows/ # GitHub Actions workflow definitions
├── actions/ # Custom GitHub Actions
├── files/
│ ├── terraform/ # Terraform configurations
│ └── convert.js # YAML to JSON converter
└── README.md # This file

## 🚦 Getting Started

1. Clone this repository
2. Explore the different workflow files in `.github/workflows/`
3. Trigger workflows manually using workflow_dispatch or through pushes
4. Check the Actions tab to see the workflows in action

## 💡 Learning Resources

Each workflow file is documented with comments explaining its purpose and functionality. This repository serves as a practical reference for:
- GitHub Actions basics
- Workflow reusability
- Docker integration
- Terraform automation
- Custom action creation


