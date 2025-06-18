# Cloudflare Workers Build Badge

[![CI](https://github.com/Xeffen25/cloudflare-workers-build-badge/actions/workflows/CI.yml/badge.svg)](https://github.com/Xeffen25/cloudflare-workers-build-checks/actions/workflows/CI.yml)
![CD](https://img.shields.io/endpoint?url=https%3A%2F%2Fcloudflare-workers-build-badge.xeffen25.workers.dev%2F%3Fusername%3DXeffen25%26repository%3Dcloudflare-workers-build-badge%26branch%3Dmain)

This project provides a **Cloudflare Worker** that acts as a bridge to retrieve the build status of your GitHub repositories deployed via **Cloudflare Workers and Pages**. It then formats this status into a JSON payload compatible with [Shields.io](https://shields.io/), allowing you to display dynamic build status badges directly in your `README.md` files.

The worker leverages the GitHub API to inspect the `CheckSuite` associated with your repository's branches, specifically looking for the "Cloudflare Workers and Pages" check.

## Features

- **Dynamic Status Badges**: Display "passing", "failing", or "pending" build statuses.
- **Customizable Colors**: Colors change based on the build conclusion.
- **Cloudflare Logo**: Includes the Cloudflare Workers logo for clear identification.
- **Easy Integration**: Simple URL structure for Shields.io badges.

## Getting Started

Follow these steps to set up and deploy your Cloudflare Workers Build Status Badge.

### 1. Prerequisites

Before you begin, ensure you have the following:

- A GitHub account.
- A Cloudflare account with Workers enabled. If you're new to Cloudflare Workers, check out the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/).
- [Node.js](https://nodejs.org/en/download/) (LTS recommended) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

### 2. Clone the Repository

Start by cloning this repository to your local machine:

```bash
git clone https://github.com/Xeffen25/cloudflare-workers-build-badge.git
cd cloudflare-workers-build-checks
```

### 3. Install Dependencies

Navigate into the cloned directory and install the project's dependencies:

```bash
npm install
```

### 4. Configure GitHub Personal Access Token (PAT)

This worker needs a GitHub Personal Access Token (PAT) to access your repository's check suites.

1.  **Generate a GitHub PAT**:

- Go to your GitHub settings: **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
- Click "Generate new token".
- Give your token a descriptive name (e.g., `cloudflare-worker-pat`).
- For the **scope**, you only need to select `repo` (specifically, `repo:status` and `public_repo` might be sufficient, but `repo` covers it).
- Click "Generate token" and **copy the token immediately**. You won't be able to see it again.
- **Link to GitHub PAT documentation:** [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

2.  **Store Your PAT as a Secret**:
    For local development and deployment, you'll store this PAT as an environment variable.

- Create a file named `.dev.vars` in the root of your project:

```
GITHUB_PAT="your_github_personal_access_token_here"
```

Replace `"your_github_personal_access_token_here"` with the actual token you generated.

- **Important**: Make sure `.dev.vars` is included in your `.gitignore` file to prevent it from being committed to your repository. This repository already includes it, but always double-check.

### 5. Local Testing

You can test the worker locally before deploying it.

1.  Start the local development server:

```bash
npm run dev
```

This will typically start the server on `http://localhost:8787`.

2.  **Test the endpoint**:
    Open your web browser or use a tool like `curl` to visit the following URL structure, replacing the placeholders with your actual GitHub username, repository name, and branch name:

```
http://localhost:8787/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME/YOUR_BRANCH_NAME/status
```

For example, if your repository is `Xeffen25/my-cloudflare-app` and the main branch is `main`, the URL would be:
`http://localhost:8787/Xeffen25/my-cloudflare-app/main/status`

You should receive a JSON response similar to this (the `message` and `color` will vary based on your build status):

```jsonc
{
  "schemaVersion": 1,
  "labelColor": "#343B42",
  "label": "CD",
  "message": "passing", // or "failing", "pending", "queued", etc.
  "color": "#2ac44e", // or "#D02E3C" for not passing
  "namedLogo": "cloudflareworkers",
  "logoColor": "#F5821F",
}
```

- `message`: Indicates the build status (e.g., "passing", "failing", "pending", "queued").
- `color`: The hex color code for the badge, changing based on the build conclusion.

### 6. Deployment to Cloudflare Workers

The most recommended way to deploy this worker is by integrating it with your GitHub repository via Cloudflare Pages or Workers directly, which handles continuous deployment.

1.  **Create a New Cloudflare Worker/Pages Project**:

- Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
- Navigate to **Workers & Pages**.
- Click "Create application" (for Pages) or "Create a Worker" (for Workers).
- Choose "Connect to Git" and select the GitHub repository where you cloned this project.
- Follow the on-screen instructions to set up the build command (`npm install && npm run build` if you have a build step, though for a simple worker `npm install` might be enough) and output directory (usually not applicable for Workers).

2.  **Add Secrets to Cloudflare Workers**:
    After setting up the deployment, you **must** add your `GITHUB_PAT` as a secret to your deployed Cloudflare Worker environment.

- In your Cloudflare dashboard, go to your Worker project.
- Navigate to **Settings** > **Variables**.
- Under "Environment Variables", click "Add variable".
- For **Variable name**, enter `GITHUB_PAT`.
- For **Value**, paste your GitHub Personal Access Token.
- Click "Save".
- **Link to Cloudflare Worker Secrets documentation:** [Add secrets to your Worker](https://developers.cloudflare.com/workers/platform/environment-variables/#secrets)

### 7. Add the Badge to Your GitHub Repository README.md

Once your Cloudflare Worker is deployed, you can use its public URL to create a status badge in any of your `README.md` files.

Use the following Markdown syntax, replacing `YOUR_WORKER_URL`, `YOUR_GITHUB_USERNAME`, `YOUR_REPOSITORY_NAME`, and `YOUR_BRANCH_NAME` with your specific details:

```markdown
![Cloudflare Build Status](https://img.shields.io/endpoint?url=YOUR_WORKER_URL%3Fusername%3DYOUR_GITHUB_USERNAME%26repository%3DYOUR_REPOSITORY_NAME%26branch%3DYOUR_BRANCH_NAME)
```

- **`YOUR_WORKER_URL`**: This is the public URL of your deployed Cloudflare Worker (e.g., `https://your-worker-name.your-account.workers.dev`).
- **`YOUR_GITHUB_USERNAME`**: The GitHub username of the repository owner.
- **`YOUR_REPOSITORY_NAME`**: The name of the GitHub repository.
- **`YOUR_BRANCH_NAME`**: The specific branch you want to check (e.g., `main`, `master`, `dev`).

**Example:**

If your deployed Cloudflare Worker's URL is `https://cloudflare-workers-build-badge.xeffen25.workers.dev/` and you want to display the status for `Xeffen25/cloudflare-workers-build-badge` on the `main` branch, your badge Markdown would look like this:

```markdown
![Cloudflare Build Status](https://img.shields.io/endpoint?url=https%3A%2F%2Fcloudflare-workers-build-badge.xeffen25.workers.dev%2F%3Fusername%3DXeffen25%26repository%3Dcloudflare-workers-build-badge%26branch%3Dmain)
```

And the result would show: ![Cloudflare Build Status](https://img.shields.io/endpoint?url=https%3A%2F%2Fcloudflare-workers-build-badge.xeffen25.workers.dev%2F%3Fusername%3DXeffen25%26repository%3Dcloudflare-workers-build-badge%26branch%3Dmain)

Your `README.md` will now display a dynamic badge reflecting the latest Cloudflare Workers and Pages build status of your chosen repository and branch!

## Alternative (Less Secure) Method: Using a Key Query Parameter

While **not recommended for security reasons**, you can also use a pre-deployed instance of this worker (like the one hosted by the project maintainer) and pass your GitHub Personal Access Token (PAT) directly as a query parameter.

**This method exposes your PAT in the URL, which can be logged by servers, proxies, and browser histories. Only use this if you fully understand and accept the security risks.**

To use this method, append `&key=YOUR_GITHUB_PAT` to the Shields.io endpoint URL:

```
![Cloudflare Build Status](https://img.shields.io/endpoint?url=https%3A%2F%2Fcloudflare-workers-build-badge.xeffen25.workers.dev%2F%3Fusername%3DXeffen25%26repository%3Dcloudflare-workers-build-badge%26branch%3Dmain%26key%3DYOUR_GITHUB_PAT)
```

Replace `YOUR_GITHUB_PAT` with your actual GitHub Personal Access Token. Remember, this token will be visible in plain text in your `README.md` and potentially in publicly accessible logs. It is **strongly advised** to deploy your own Cloudflare Worker and store your PAT as a secure environment variable as described previously.
