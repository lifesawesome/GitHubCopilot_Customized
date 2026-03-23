---
name: 'refactor-component'
description: 'Refactor a React component for better structure, performance, and maintainability'
agent: 'agent'
---

# Refactor React Component

Analyze the selected React component and refactor it following OctoCAT project conventions.

## Refactoring Checklist

### 1. TypeScript Props
- Extract props into a named interface above the component
- Use `React.FC<Props>` typing
- Add JSDoc to complex props

### 2. State Management
- Replace prop drilling with Context where appropriate
- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive computed values
- Ensure proper dependency arrays in `useEffect`

### 3. Styling
- Convert any inline styles to Tailwind CSS classes
- Ensure dark mode support with `dark:` prefixes
- Use consistent spacing/sizing patterns

### 4. Component Structure
- Extract reusable sub-components if the file exceeds ~150 lines
- Move API calls to custom hooks if used in multiple components
- Keep render logic clean — extract complex conditionals to variables

### 5. Accessibility
- Add `aria-label` to interactive elements
- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`)
- Ensure keyboard navigability for custom controls

### 6. Error/Loading States
- Add loading spinner or skeleton for async data
- Add error boundary or error message display
- Handle empty state (no data)

## Output
1. Refactored code with clear comments on what changed
2. List of improvements made
3. Any additional suggestions for further improvement
