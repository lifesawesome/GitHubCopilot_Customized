# Lesson 5: MCP Servers & Extensions

## Overview

| Aspect | Detail |
|--------|--------|
| **Duration** | 60 minutes (40 min instruction + 20 min hands-on) |
| **Level** | Advanced |
| **Prerequisites** | Lessons 1-4, Docker installed (for GitHub MCP), local VS Code (for Playwright MCP) |
| **Outcome** | Extend Copilot with MCP servers for browser testing and GitHub integration |

---

## Why This Matters

Copilot is powerful out of the box, but the **Model Context Protocol (MCP)** lets you connect it to external tools and services. This means Copilot can browse the web, interact with GitHub APIs, query databases, and integrate with any system that speaks MCP.

---

## What Is MCP?

**Model Context Protocol** is an open standard for connecting AI assistants to external tools and data sources.

```
Copilot Chat ← MCP Protocol → MCP Server → External Tool
                                             ├── Playwright (browser)
                                             ├── GitHub (repos, issues, PRs)
                                             ├── Database (queries)
                                             └── Custom (your tools)
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| **MCP Server** | A process that exposes tools to the AI model |
| **Tools** | Functions the AI can call (e.g., `browse_page`, `create_issue`) |
| **Resources** | Data the AI can read (e.g., file contents, API responses) |
| **Protocol** | JSON-RPC over stdio or SSE |

---

## MCP Servers in This Project

### 1. Playwright MCP Server

**Purpose**: Automate browser interactions — navigate, click, fill forms, take screenshots.

**Use Cases**:
- Run functional tests against the running frontend
- Verify UI changes visually
- Execute BDD test scenarios
- Screenshot captured for verification

**Configuration** (in `.vscode/mcp.json`):
```json
{
    "servers": {
        "playwright": {
            "command": "npx",
            "args": ["@playwright/mcp-server"]
        }
    }
}
```

**Example Interaction**:
```
Browse to http://localhost:5137 and verify the Products page shows at least 10 products
```

### 2. GitHub MCP Server

**Purpose**: Interact with GitHub directly from Copilot Chat — issues, PRs, repos.

**Use Cases**:
- Create issues from Chat
- List and manage PRs
- Search code across repos
- Assign tasks to Copilot Coding Agent

**Configuration Options**:

**Local (Docker-based)**:
```json
{
    "servers": {
        "github-local": {
            "command": "docker",
            "args": ["run", "-i", "--rm",
                     "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
                     "ghcr.io/github/github-mcp-server"],
            "env": {
                "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}"
            }
        }
    }
}
```

**Remote (OAuth-based)**:
```json
{
    "servers": {
        "github-remote": {
            "type": "sse",
            "url": "https://api.githubcopilot.com/mcp/"
        }
    }
}
```

**Example Interactions**:
```
What are the open issues on this repo?

Create an issue to add a dark mode toggle to the admin page and assign it to me.

Create a PR from the current branch with a summary of changes.
```

---

## Setting Up MCP Servers

### Step 1: Configure MCP Servers

MCP servers are configured in `.vscode/mcp.json` at the workspace level.

### Step 2: Start a Server

Use the Command Palette:
1. `Ctrl+Shift+P` → "MCP: List Servers"
2. Select the server (e.g., `playwright`)
3. Click "Start Server"

Or start from the `mcp.json` file — there's a "Start" button above each server configuration.

### Step 3: Use in Chat

Once running, the MCP tools appear in Agent mode:
- Copilot automatically discovers available tools
- Tools show up when relevant to your prompt
- You can accept/reject each tool call

---

## Playwright MCP Workflows

### Functional Testing

```
Browse to http://localhost:5137/products and:
1. Verify the search bar is visible
2. Search for "SmartFeeder"
3. Verify only matching products appear
4. Take a screenshot of the results
```

### BDD-Style Testing

Generate feature files and execute them:

```
Generate a Gherkin feature file for testing the Products page:
- Scenario: View all products
- Scenario: Search products by name
- Scenario: Add product to cart

Then browse to the app and execute each scenario step.
```

### Visual Verification

```
Browse to http://localhost:5137 and take screenshots of:
1. The home page
2. The products page  
3. The about page
Compare the screenshots to verify the layout is consistent.
```

---

## GitHub MCP Workflows

### Issue Management

```
# List issues
Show me all open issues assigned to me

# Create issue
Create an issue titled "Add order status filtering" with a description 
of the required changes to the frontend and API

# Assign to agent
Assign issue #3 to Copilot for automated implementation
```

### PR Workflows

```
# Create PR
Create a pull request from my current branch with a summary of all changes

# Review PR
Summarize the changes in PR #5 and highlight any potential issues
```

### Code Search

```
Search the repository for any usage of console.log in production code
```

---

## Building Custom MCP Servers

You can build your own MCP servers for internal tools:

```typescript
// Example: Custom MCP server for internal API
import { Server } from '@modelcontextprotocol/sdk/server';

const server = new Server({
    name: 'internal-api',
    version: '1.0.0',
});

server.setRequestHandler('tools/list', async () => ({
    tools: [{
        name: 'get_deployment_status',
        description: 'Check deployment status for a given environment',
        inputSchema: { /* ... */ }
    }]
}));
```

---

## Security Considerations

| MCP Server | Security Notes |
|------------|---------------|
| Playwright | Runs browser locally — only access local/trusted URLs |
| GitHub | Uses PAT or OAuth — restrict token permissions to minimum needed |
| Custom | Validate all inputs, sanitize outputs, use least-privilege access |

- **Never** put tokens in version-controlled `mcp.json` — use input variables
- **Review** each tool call before approving in Chat
- **Limit** GitHub PAT to specific repos and minimal permissions

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Server won't start | Check Docker is running (for GitHub MCP) |
| Tools not appearing | Restart the MCP server, check logs |
| Authentication failed | Regenerate PAT, verify permissions |
| Playwright can't browse | Ensure the app is running on the expected port |
| CORS errors in browser | Check API CORS config matches frontend URL |

---

## Summary

| MCP Server | Purpose | Requirements |
|------------|---------|-------------|
| Playwright | Browser automation & testing | `npx @playwright/mcp-server` |
| GitHub (local) | Repo/issue/PR management | Docker + PAT |
| GitHub (remote) | Repo/issue/PR management | OAuth |
| Custom | Internal tools integration | MCP SDK |

---

## Next Steps

- [Hands-on Exercises](hands-on-exercises.md) — Practice with MCP servers
- Back to [Workshop Agenda](../README_Agenda.md)
