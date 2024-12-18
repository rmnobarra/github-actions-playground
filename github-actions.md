# github actions

## introduction

Automation has become a cornerstone of modern software development, and GitHub Actions is at the forefront of this transformation. By enabling Continuous Integration/Continuous Deployment (CI/CD) and other automations directly within GitHub, Actions simplifies workflows for developers. This article explores GitHub Actions, diving deep into its components, functionalities, and advanced capabilities.

## what is github actions?

**GitHub Actions** is a feature of GitHub that facilitates automation of tasks directly within the GitHub ecosystem. From automating builds and tests to deploying applications and managing issues, it empowers developers to create seamless workflows triggered by GitHub events.

## components

### Runners
**Runners** are servers where workflows execute. GitHub provides hosted runners (e.g., ubuntu-latest, windows-latest) and supports self-hosted runners for custom environments.

### Workflow
**Workflows** are YAML-based configurations that define the automation process. They reside in the .github/workflows directory of a repository.

Example:

```yaml
name: CI Workflow

# Trigger on push or pull request to the main branch
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

# Define jobs
jobs:
  build-and-test:
    # Use the latest Ubuntu runner
    runs-on: ubuntu-latest
    
    # Define the steps to execute
    steps:
      # Step 1: Check out the repository code
      - name: Checkout code
        uses: actions/checkout@v3

      # Step 2: Set up Node.js environment
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16' # Use Node.js version 16

      # Step 3: Install dependencies
      - name: Install dependencies
        run: npm install

      # Step 4: Run tests
      - name: Run tests
        run: npm test
```

### Triggers
Triggers, defined under the on keyword in a workflow file, specify the events that initiate the workflow. Common triggers include push, pull_request, and schedule.

```yaml
name: Trigger Example Workflow

# Define triggers for the workflow
on:
  push:
    branches:
      - main           # Trigger on push to the main branch
      - feature/*      # Trigger on push to any branch starting with "feature/"
  pull_request:
    branches:
      - main           # Trigger on pull requests targeting the main branch
  schedule:
    - cron: '0 0 * * *' # Trigger at midnight every day (UTC)
  workflow_dispatch:    # Allow manual triggering via the GitHub interface

# Define jobs
jobs:
  example-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Run a script
        run: echo "This workflow was triggered by an event!"
```
Explanation of Triggers

1. **`push`**:
   - The workflow runs when code is pushed to the `main` branch or any branch matching the pattern `feature/*`.

2. **`pull_request`**:
   - The workflow is triggered for pull requests targeting the `main` branch.

3. **`schedule`**:
   - Uses cron syntax to trigger the workflow at a specific time. In this example, it triggers daily at midnight UTC.

4. **`workflow_dispatch`**:
   - Adds a manual trigger button in the GitHub Actions interface, allowing users to start the workflow manually.

### Trigger Usage
Save this workflow in `.github/workflows/trigger-example.yml`. With this configuration:
- A push to the `main` branch runs the workflow.
- A pull request targeting the `main` branch also triggers it.
- The workflow runs daily at midnight.
- Developers can manually start the workflow when needed via the GitHub Actions UI.

### Jobs
**Jobs** group tasks to execute independently. By default, jobs run in parallel, but dependencies can be set using needs.

Example:

```yaml
name: Multi-Job Workflow

on:
  push:
    branches:
      - main

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up environment
        run: echo "Environment setup complete."

  build:
    runs-on: ubuntu-latest
    needs: setup
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Build project
        run: echo "Building the project."

  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Run tests
        run: echo "Running tests."

  deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Deploy project
        run: echo "Deploying the application."
```

### Explanation of Jobs

1. **Defining Jobs**:
   - Jobs are listed under the `jobs` key in the workflow YAML file.
   - Each job has its own unique identifier (e.g., `setup`, `build`, `test`, `deploy`).

2. **Parallel Execution**:
   - By default, jobs run independently and in parallel unless dependencies are defined.

3. **Dependencies with `needs`**:
   - The `needs` keyword specifies job dependencies, controlling the execution order.
   - In this example:
     - The `build` job depends on `setup`.
     - The `test` job depends on `build`.
     - The `deploy` job depends on `test`.

4. **Steps Within Jobs**:
   - Each job contains `steps`, which are sequential tasks.
   - Common tasks like `actions/checkout` are repeated in each job if needed, as jobs are isolated.

5. **Execution Flow**:
   - When the workflow is triggered:
     1. The `setup` job runs first.
     2. Once `setup` completes, the `build` job starts.
     3. The `test` job begins after `build` finishes.
     4. Finally, the `deploy` job runs once the `test` job completes.

### Key Features Demonstrated

- **Parallel Jobs**: If `needs` were removed, all jobs (`setup`, `build`, `test`, `deploy`) would execute simultaneously.
- **Sequential Execution**: Using `needs` ensures the jobs follow a specific sequence, making it suitable for workflows like CI/CD pipelines.
- **Modular Design**: Each job has a clear purpose and is independent, making debugging and maintenance easier.

### Steps

### Steps in GitHub Actions

**Steps** are the smallest units of work within a job. They are executed sequentially in the order they appear in the YAML file. A step can perform one of two main tasks:

1. **Invoke a prebuilt action** (e.g., `actions/checkout` to clone a repository).
2. **Run shell commands** directly on the runner (e.g., `npm install`).

Example:

### Workflow Example with Steps

```yaml
name: Workflow with Steps

on:
  push:
    branches:
      - main

jobs:
  example-job:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Check out the repository code
      - name: Checkout repository
        uses: actions/checkout@v3

      # Step 2: Set up Node.js environment
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      # Step 3: Install dependencies
      - name: Install dependencies
        run: npm install

      # Step 4: Run tests
      - name: Run tests
        run: npm test

      # Step 5: Upload test results (invoking an external action)
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: ./test-results
```

### Explanation of Steps

1. **Step Execution**:
   - Each step is executed sequentially in the order they appear in the job.
   - If a step fails (unless marked as `continue-on-error`), subsequent steps in the same job will not execute.

2. **Using Prebuilt Actions**:
   - **`actions/checkout@v3`**: Checks out the repository code into the runner environment.
   - **`actions/setup-node@v3`**: Sets up a specific Node.js version.
   - **`actions/upload-artifact@v3`**: Uploads test results as an artifact for later use.

3. **Running Shell Commands**:
   - **`run: npm install`**: Installs dependencies for the project.
   - **`run: npm test`**: Executes the project's test suite.
   - Commands are executed in the runner's shell environment.

4. **Providing Input Parameters**:
   - Prebuilt actions (e.g., `actions/setup-node`) accept inputs via the `with` keyword.
   - Inputs customize the behavior of the action (e.g., setting `node-version` to `16`).

### Key Points About Steps

- **Name**: You can provide a `name` for each step to make it easy to identify in the GitHub Actions interface.
- **Isolation**: Each step runs independently, but subsequent steps can access outputs or artifacts created by previous steps.
- **Flexibility**: Steps can mix action invocations and shell commands, providing great flexibility in workflow design.
- **Error Handling**: You can handle errors for specific steps by adding `continue-on-error: true`.

### Modifying Steps for Error Handling

Here’s an example of handling errors in a step:

```yaml
      - name: Run tests
        run: npm test
        continue-on-error: true
```

In this case:
- The workflow will continue to execute subsequent steps even if `npm test` fails.

## how workflows works?

**Workflows** are event-driven. When a specified event occurs (e.g., a push), GitHub checks the .github/workflows directory for matching workflows. The workflow triggers and executes its defined jobs on runners.

## reusable workflows

**Reusable workflows** allow you to define modular workflows that can be invoked from other workflows using the `workflow_call` trigger. This promotes **DRY (Don’t Repeat Yourself)** principles by enabling shared logic across multiple repositories or within the same repository.

### Structure of Reusable Workflows

1. **Reusable Workflow**:
   - The workflow defined with `workflow_call` to allow it to be reused.

2. **Calling Workflow**:
   - The workflow that invokes the reusable workflow.

### Example of a Reusable Workflow

**Reusable Workflow File (`.github/workflows/reusable-build.yml`)**:
```yaml
name: Reusable Build Workflow

on:
  workflow_call:
    inputs:
      build-environment:
        description: 'Build environment (e.g., production, staging)'
        required: true
        type: string

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Build project
        run: |
          echo "Building for ${{ inputs.build-environment }} environment"
          npm install
          npm run build
```

### Example of a Calling Workflow

**Calling Workflow File (`.github/workflows/call-reusable.yml`)**:
```yaml
name: Invoke Reusable Workflow

on:
  push:
    branches:
      - main

jobs:
  invoke-reusable:
    uses: ./.github/workflows/reusable-build.yml
    with:
      build-environment: production
```

### Explanation

1. **Reusable Workflow**:
   - Defined in `.github/workflows/reusable-build.yml`.
   - Uses the `workflow_call` trigger, allowing it to be called by other workflows.
   - Accepts an input parameter (`build-environment`) to customize its behavior.

2. **Calling Workflow**:
   - Invokes the reusable workflow using the `uses` keyword.
   - Passes the required input (`build-environment: production`) to customize the behavior.

3. **Execution Flow**:
   - When a `push` occurs on the `main` branch, the calling workflow triggers the reusable workflow.
   - The reusable workflow performs a build using the provided `build-environment` value.

### Key Benefits of Reusable Workflows

1. **Code Reuse**:
   - Centralizes common logic, reducing duplication across workflows.

2. **Maintainability**:
   - Updates to the reusable workflow automatically apply to all workflows that use it.

3. **Flexibility**:
   - Parameters (`inputs`) enable customization of reusable workflows for various use cases.

4. **Cross-Repository Use**:
   - Reusable workflows can be defined in a repository and invoked by workflows in other repositories.

### Invoking Reusable Workflows from Another Repository

To use a reusable workflow from another repository, reference it as follows:

```yaml
jobs:
  invoke-reusable:
    uses: owner/repo-name/.github/workflows/reusable-build.yml@branch-or-tag
    with:
      build-environment: production
```

## action

## what is an action

Actions are predefined tasks that can be reused within workflows. They abstract complex operations into simple calls.

## types of actions

Types of Actions
Composite Actions: Built using multiple steps and shell commands.
Docker Actions: Encapsulate tasks in a Docker container for consistent environments.
JavaScript Actions: Use Node.js for dynamic scripting and interactions with GitHub APIs.

## github marketplace

The GitHub Marketplace hosts thousands of actions created by the community and GitHub itself. Developers can browse, use, or modify these actions for their workflows.

## how use a action

To use an action in a workflow:

```yaml
steps:
  - name: Check out code
    uses: actions/checkout@v3
```

***Here, actions/checkout is an example of a popular action.***

## workflow versus actions

Workflows define the overarching automation logic, while actions represent modular units of work executed within workflows. A workflow orchestrates multiple actions to achieve a complex goal.

## Secrets and Variables

**Secrets and variables** are essential for securely managing sensitive information (like API keys or passwords) and configuration data (like environment settings) in GitHub Actions workflows.

### **Secrets**

- Secrets are encrypted values stored in GitHub and injected into workflows securely.
- They are managed in the repository or organization settings under "Secrets and Variables."
- Common use cases include API tokens, database passwords, and private keys.

### **Variables**

- Variables are non-sensitive values used to configure workflows or pass information across steps.
- They can be scoped globally (repository-wide) or locally (workflow or job-specific).
- Examples include environment-specific settings, version numbers, and file paths.

Example:

```yaml
name: Secrets and Variables Example

on:
  push:
    branches:
      - main

jobs:
  example-job:
    runs-on: ubuntu-latest

    # Define environment variables for the job
    env:
      DEPLOY_ENV: production
      CONFIG_PATH: ./config/prod-config.json

    steps:
      # Step 1: Check out the repository
      - name: Checkout repository
        uses: actions/checkout@v3

      # Step 2: Use a secret
      - name: Access API with secret
        run: curl -H "Authorization: Bearer ${{ secrets.API_TOKEN }}" https://api.example.com/data

      # Step 3: Use environment variables
      - name: Print environment configuration
        run: echo "Environment: $DEPLOY_ENV, Config Path: $CONFIG_PATH"
```

### Explanation

1. **Secrets**:
   - In the example, the secret `API_TOKEN` is used to securely authenticate with an external API.
   - Secrets are accessed using the syntax `${{ secrets.<SECRET_NAME> }}`.
   - Secrets must be predefined in the GitHub repository or organization settings.

2. **Variables**:
   - `DEPLOY_ENV` and `CONFIG_PATH` are defined as environment variables under the `env` key.
   - They are accessible directly in shell commands, e.g., `$DEPLOY_ENV`.

3. **Environment Context**:
   - Environment variables are scoped to the job and available in all steps.
   - Secrets and variables are not hardcoded in the workflow file, ensuring security and flexibility.

### Adding Secrets to a Repository

1. Go to your GitHub repository.
2. Navigate to **Settings > Secrets and variables > Actions**.
3. Add a new secret with a name (e.g., `API_TOKEN`) and its corresponding value.

### Best Practices

- **Use Secrets for Sensitive Data**: Never hardcode sensitive information like passwords or API keys in your workflow file.
- **Environment Variables for Configuration**: Use variables for non-sensitive, configurable parameters (e.g., file paths, deployment environments).
- **Combine Both**: Use secrets for authentication and variables for operational parameters in the same workflow.

### Common Use Cases

1. **Secrets**:
   - Accessing third-party APIs using tokens.
   - Setting up database credentials for integration tests.
   - Configuring SSH keys for deployment.

2. **Variables**:
   - Specifying build configurations (e.g., debug or production mode).
   - Setting file paths dynamically based on the environment.
   - Defining reusable constants like version numbers.

## advanced topics

### Using GitHub CLI (`gh`) in a Workflow

The **GitHub CLI (`gh`)** is a command-line tool for interacting with GitHub, including managing issues, pull requests, repositories, and workflows. It can also be used within a GitHub Actions workflow for tasks like debugging, triggering workflows, or managing repositories programmatically.

### Example Workflow Using `gh`

```yaml
name: Workflow with GitHub CLI

on:
  workflow_dispatch: # Manual trigger

jobs:
  use-gh-cli:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Check out the repository
      - name: Checkout repository
        uses: actions/checkout@v3

      # Step 2: Set up GitHub CLI
      - name: Install GitHub CLI
        run: sudo apt-get install -y gh

      # Step 3: Authenticate with GitHub CLI
      - name: Authenticate with GitHub CLI
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Provided automatically by GitHub Actions
        run: |
          echo $GITHUB_TOKEN | gh auth login --with-token

      # Step 4: Use GitHub CLI to create an issue
      - name: Create an issue using GitHub CLI
        run: |
          gh issue create --title "Automated Issue" \
                          --body "This issue was created by a GitHub Actions workflow."

      # Step 5: Use GitHub CLI to list workflows
      - name: List workflows using GitHub CLI
        run: gh workflow list
```

### Explanation

1. **Trigger**:
   - This workflow uses the `workflow_dispatch` trigger, allowing it to be started manually.

2. **Installing GitHub CLI**:
   - The `gh` CLI is installed using the package manager (`apt-get` in this case).

3. **Authentication**:
   - The `GITHUB_TOKEN`, provided automatically in GitHub Actions workflows, is used to authenticate `gh` via the `gh auth login --with-token` command.
   - This ensures that the CLI can interact with the GitHub API securely.

4. **Creating an Issue**:
   - The `gh issue create` command is used to open a new issue in the repository.
   - The `--title` and `--body` options specify the issue's details.

5. **Listing Workflows**:
   - The `gh workflow list` command displays all workflows in the repository.
   - This can help debug or confirm the presence of specific workflows.

### Key Use Cases for `gh` in Workflows

1. **Managing Issues and Pull Requests**:
   - Automate issue creation or update issue statuses.
   - Merge pull requests programmatically.

2. **Workflow Control**:
   - Trigger or list workflows.
   - View logs of specific workflow runs.

3. **Repository Management**:
   - Automate the creation of branches or releases.
   - Tag commits or manage repository settings.

### Why Use `gh` in Workflows?

- **Flexibility**: The CLI allows advanced GitHub API interactions directly from workflows.
- **Efficiency**: Enables tasks like debugging, triggering workflows, or automating repository management without writing complex API calls.
- **Built-In Authentication**: The `GITHUB_TOKEN` ensures secure, seamless integration within workflows.

### GitHub APIs

### Using GitHub APIs in a Workflow

GitHub APIs allow developers to interact programmatically with GitHub to manage workflows, repositories, and more. By integrating API calls into workflows, you can achieve deeper customization and handle tasks that aren't natively supported by GitHub Actions.

### Example Workflow Using GitHub APIs

This example demonstrates creating a GitHub issue programmatically using the **GitHub REST API** within a workflow.

```yaml
name: Workflow with GitHub API

on:
  workflow_dispatch: # Manual trigger

jobs:
  use-github-api:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Set up authentication and make an API call
      - name: Create a GitHub Issue via API
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Built-in GitHub token for authentication
        run: |
          curl -X POST \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            https://api.github.com/repos/${{ github.repository }}/issues \
            -d '{
              "title": "Automated Issue",
              "body": "This issue was created programmatically via the GitHub API.",
              "labels": ["bug", "automated"]
            }'

      # Step 2: Fetch Workflow Runs using GitHub API
      - name: Fetch Workflow Runs
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          curl -X GET \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            https://api.github.com/repos/${{ github.repository }}/actions/runs
```

### Explanation

1. **Trigger**:
   - The workflow uses `workflow_dispatch`, allowing it to be triggered manually via the GitHub Actions interface.

2. **Authentication**:
   - The `GITHUB_TOKEN` secret (automatically provided by GitHub) authenticates API calls securely without exposing sensitive information.

3. **Step 1: Create an Issue**:
   - The `curl` command sends a POST request to the `/issues` endpoint of the GitHub API.
   - The API request includes:
     - **Headers**: For authorization and API versioning.
     - **Payload**: A JSON body specifying the issue title, description, and labels.

4. **Step 2: Fetch Workflow Runs**:
   - The second `curl` command sends a GET request to the `/actions/runs` endpoint.
   - It retrieves a list of recent workflow runs for the repository.
   - The response can include metadata like run IDs, statuses, and timestamps, which can be processed further.

### Use Cases for GitHub API in Workflows

1. **Custom Issue Management**:
   - Programmatically create, update, or close issues based on workflow outcomes.

2. **Enhanced Workflow Management**:
   - List or trigger workflows dynamically using the `/actions` endpoints.

3. **Repository Automation**:
   - Manage releases, branches, or tags programmatically.

4. **Data Insights**:
   - Fetch and analyze workflow metrics or repository statistics.

### Why Use GitHub APIs in Workflows?

- **Flexibility**: APIs enable complex and customized operations that are not possible with predefined actions.
- **Programmatic Control**: Manage workflows and repositories dynamically.
- **Seamless Integration**: Combine API calls with other workflow steps for end-to-end automation.

### Best Practices

1. Use the `GITHUB_TOKEN` or personal access tokens (for extended permissions).
2. Add error handling for API calls to gracefully manage failures.
3. Leverage GitHub's GraphQL API for advanced queries and optimizations.

## Matrix Strategy

The Matrix Strategy in GitHub Actions allows workflows to create multiple jobs dynamically by combining different input parameters. This is particularly useful for testing across various configurations, such as versions of programming languages, operating systems, or dependencies.

Below is a detailed explanation of different aspects of the Matrix Strategy with examples.

One-dimensional matrices

A one-dimensional matrix tests variations of a single parameter. For instance, you may want to test your application on different versions of Node.js.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14, 16, 18] # One-dimensional matrix
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
```

Here:

The matrix iterates over node-version values (14, 16, 18).
Three jobs are created, each testing the application with a different Node.js version.

Multi-dimensional matrices

A multi-dimensional matrix tests combinations of multiple parameters, such as programming language versions and operating systems.

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        python-version: [3.8, 3.9, 3.10]
    runs-on: ${{ matrix.os }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest
```

Here:

The matrix combines os and python-version.
A total of 3×3=9 jobs are created for all combinations of operating systems and Python versions.

Including extra values

You can include additional metadata or parameters in the matrix using the include keyword. This is helpful if some combinations require specific configurations.

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        python-version: [3.9, 3.10]
        include:
          - os: windows-latest
            python-version: 3.9
            additional-dependency: pywin32
    runs-on: ${{ matrix.os }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          if [[ "${{ matrix.os }}" == "windows-latest" && "${{ matrix.python-version }}" == "3.9" ]]; then
            pip install ${{ matrix.additional-dependency }}
          fi
      - name: Run tests
        run: pytest
```
Here:

The include adds an extra parameter, additional-dependency, for specific configurations.

Excluding extra values

You can use the exclude keyword to skip specific combinations in a matrix.

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        python-version: [3.8, 3.9]
        exclude:
          - os: macos-latest
            python-version: 3.8
    runs-on: ${{ matrix.os }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest
```

Here:

The combination of macos-latest and Python 3.8 is excluded.


Handling Failure Cases

You can manage job failures using the fail-fast option. By default, if one matrix job fails, GitHub Actions cancels the remaining jobs. Setting fail-fast: false prevents this.

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        node-version: [14, 16, 18]
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - name: Run tests
        run: npm test
```
Here:

If one job fails, the others continue running.

Defining Max Concurrent Jobs

The max-parallel option limits the number of jobs running concurrently, which can help manage resource usage.

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        python-version: [3.8, 3.9]
      max-parallel: 2
    runs-on: ${{ matrix.os }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
      - name: Run tests
        run: pytest
```

Here:

At most, 2 jobs run concurrently, even if the matrix creates more jobs.

### Containers in Workflow

**Containers** provide isolated and consistent environments for jobs in GitHub Actions workflows. They allow you to use pre-configured software, libraries, and dependencies, ensuring that workflows run reliably regardless of the underlying runner.

### Types of Container Usage

1. **Job Environment**:
   - The entire job runs inside a specified container.
   - Useful when you need a consistent runtime with pre-installed dependencies.

2. **Service Containers**:
   - Additional containers run alongside the job to provide services (e.g., databases, message queues) needed for the workflow.

### Example 1: Job Environment with a Container

In this example, the job runs inside a `node:16` container.

```yaml
name: Containerized Job Example

on:
  push:
    branches:
      - main

jobs:
  container-job:
    runs-on: ubuntu-latest
    container:
      image: node:16 # Use Node.js 16 container

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
```

**Explanation**:
- **`container.image`** specifies the Docker image to use for the job.
- The job runs entirely within the `node:16` container, which has Node.js 16 pre-installed.
- The container environment ensures the correct Node.js version and isolated dependencies.

### Example 2: Service Containers

In this example, a PostgreSQL database is provided as a service container alongside the job.

```yaml
name: Workflow with Service Container

on:
  push:
    branches:
      - main

jobs:
  service-container-job:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_USER: user
          POSTGRES_PASSWORD: password
          POSTGRES_DB: testdb
        options: > 
          --health-cmd="pg_isready -U user" 
          --health-interval=10s 
          --health-timeout=5s 
          --health-retries=5

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up environment
        run: npm install

      - name: Run tests with database
        env:
          DATABASE_URL: postgres://user:password@localhost:5432/testdb
        run: npm test
```

**Explanation**:
1. **`services`**:
   - Defines a `postgres` service container using the `postgres:13` Docker image.
   - The `env` section sets environment variables like username, password, and database name.
   - `options` adds health checks to ensure the database is ready before the job begins.

2. **Job Execution**:
   - The workflow runs on `ubuntu-latest` with the `postgres` service container running alongside it.
   - Steps can connect to the database via `localhost:5432`.

### Key Benefits of Using Containers

1. **Consistency**:
   - Ensures that jobs run in the same environment across different runners and environments.

2. **Isolation**:
   - Prevents conflicts between dependencies of different jobs.

3. **Reproducibility**:
   - Containers ensure workflows behave the same way locally and in CI.

4. **Simplified Setup**:
   - Pre-configured containers reduce the need to install dependencies during workflow execution.

### When to Use Containers

- **Job Environment**:
  - Use when your job requires a specific runtime environment (e.g., Node.js, Python, Java).
  - Example: Running tests in a Python 3.9 environment.

- **Service Containers**:
  - Use when your workflow needs supporting services (e.g., databases, message queues).
  - Example: Testing an application that interacts with PostgreSQL or Redis.

## Reference
- Examples: [Github Actions example repository](ttps://github.com/rmnobarra/github-actions-playground)
- Book: [Learning GitHub Actions book](https://www.amazon.com/Learning-GitHub-Actions-Automation-Integration/dp/109813107X)

## conclusion

GitHub Actions redefines automation by integrating it seamlessly into the GitHub ecosystem. With components like reusable workflows, robust security, and advanced integrations, it empowers developers to build, test, and deploy with unparalleled efficiency. Mastering GitHub Actions opens a world of automation possibilities that streamline development and operations.