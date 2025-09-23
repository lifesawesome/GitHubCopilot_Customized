
# 🚀 OctoCAT Supply: The Ultimate GitHub Copilot Demo v1.13.0

![OctoCAT Supply](./frontend/public/hero.png)

Welcome to the OctoCAT Supply Website - your go-to demo for showcasing the incredible capabilities of GitHub Copilot, GHAS, and the power of AI-assisted development!

## ✨ What Makes This Demo Special

This isn't just another demo app - it's a carefully crafted showcase that demonstrates the full spectrum of GitHub's AI capabilities:

- 🤖 **Copilot Agent Mode & Vision** - Watch Copilot understand UI designs and implement complex features across multiple files
- 🎭 **MCP Server Integration** - Demonstrate extended capabilities with Playwright for testing and GitHub API integration
- 🛡️ **Security First** - Showcase GHAS scanning and Copilot-powered vulnerability fixes
- 🧪 **Test Generation** - Exhibit Copilot's ability to analyze coverage and generate meaningful tests
- 🔄 **CI/CD & IaC** - Generate deployment workflows and infrastructure code with natural language
- 🎯 **Custom Instructions** - Show how Copilot can be tailored to understand internal frameworks and standards

## 🏗️ Architecture

The application is built using modern TypeScript with a clean separation of concerns:

```mermaid
erDiagram
    Headquarters ||--o{ Branch: has
    Branch ||--o{ Order: placed_at
    Order ||--o{ OrderDetail: contains
    OrderDetail ||--o{ OrderDetailDelivery: fulfilled_by
    OrderDetail }|--|| Product: references
    Delivery ||--o{ OrderDetailDelivery: includes
    Supplier ||--o{ Delivery: provides
```

### Tech Stack
- **Frontend**: React 18+, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, TypeScript, OpenAPI/Swagger
- **DevOps**: Docker

## 🎯 Hands-On Scenarios

1. **Requirements Specifications and Agentic Implementation**
   - Use a custom prompt to define features and an implementation plan
      - Use the "Plan" prompt combined with the MonaFigurine.png file (found in ./docs/design) to create an implementation plan for a new product offering on the website.
   - Generate UI components from design mockups (using Copilot Vision) and Generated Implementation Plan.
      - Reference the Implementation Plan created in the previous step to build out the new product offering on the website.
      - Use the MonaFigurine.png file to generate a product card component for the new product offering.
      - Integrate the new components into the existing React application.
   - Finalize the checkout Page using Copilot Vision
      - Use the CheckoutPage.png file to generate a checkout page for the new product offering.
      - Integrate the checkout page into the existing React application.

2. **GUIDED HANDS-ON: Create a Chat Mode**
   This activity will be performed together as a group.
   - Have Copilot Create a Custom Chat Mode using **Agent Mode**
      - Use Agent Mode and ask Copilot to pull the gist from https://gist.github.com/burkeholland/88af0249c4b6aff3820bf37898c8bacf.  Hint: Use the "Create a Chat Mode" prompt and #fetch the url of the gist. 


3. **GUIDED HANDS-ON: Create Custom Instructions and a Custom Prompt File**
   This activity will be performed together as a group.
   - Use GitHub Copilot Internal Prompting to update the custom instructions for the OctoCAT Supply project.
     - Hint: Use the "Generate Instructions" prompt to update the custom instructions for the OctoCAT Supply project.
   - Use GitHub Copilot Internal Prompting to create a custom prompt file for the OctoCAT Supply project to update all existing documentation for the project.
      - Hint: Use the "Prompt Files" prompt to create a custom prompt file for the OctoCAT Supply project.  
   - Execute the custom prompt file to update all existing documentation for the project.
      - Hint: Use the slash command to execute the prompt all existing documentation for the project.  Specify the README.md file and the docs/architecture.md file if you only want that updated. 

4. **Test Generation and Coverage Improvement**
   - Analyze existing test coverage
   - Generate unit and integration tests with Copilot
      - Hint: Use the "unit test coverage" prompt to generate unit tests for the Product and Supplier routes.
   - Improve coverage based on analysis
   - BONUS: Ask GitHub Copilot to execute the tests using the Playwright MCP server.

## 🚀 Getting Started

1. Clone this repository
2. Build the projects:
   ```bash
   # Build API and Frontend
   npm install && npm run build
   ```
3. Start the application:
   ```bash
   npm run dev
   ```

Or use the VS Code tasks:
- `Cmd/Ctrl + Shift + P` -> `Run Task` -> `Build All`
- Use the Debug panel to run `Start API & Frontend`

## 🛠️ MCP Server Setup (Optional)

Use VS Code command palette:
   - `MCP: List servers` -> `playwright` -> `Start server`

## 📚 Documentation

- [Detailed Architecture](./docs/architecture.md)
- [Complete Demo Script](./docs/demo-script.md)

---

*This entire project, including the hero image, was created using AI and GitHub Copilot! Even this README was generated by Copilot using the project documentation.* 🤖✨
