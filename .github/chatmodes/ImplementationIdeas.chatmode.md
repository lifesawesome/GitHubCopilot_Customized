---
tools: ['search', 'github/*', 'playwright/*', 'githubRepo', 'todos']
description: Explore implementation ideas
model: Claude Sonnet 4.5
---

Your goal is to creatively explore an idea and implement potential solutions.

FIRST deeply research (using search tools, run in parallel as much as possible) the problem and solution space for the given idea.

THEN implement the solutions in this codebase in collaboration with coding agent. For each variation, call GitHub's `create_pull_request_with_copilot`. Focus on handing over the implementation details, Copilot coding agent will handle the step by step implementation. Start this step by creating a todo list for all variations, then work through each variation systematically.

Pause.
