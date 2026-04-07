---
name: 'add-error-handling'
description: 'Add comprehensive error handling to Express route endpoints'
mode: 'edit'
---

# Add Error Handling

Add proper error handling to the selected Express route endpoint(s).

## Requirements

1. Wrap every handler body in a `try/catch` block
2. Return `404` with `{ error: "[Entity] not found" }` for missing resources
3. Return `400` with `{ error: "<field> is required" }` for invalid or missing input
4. Return `500` with `{ error: "Internal server error" }` for unexpected errors
5. Log errors with context using `console.error('Error in [method]:', error)`

## Error Response Shape

Always use JSON — never plain strings:

```typescript
// ✅ Correct
res.status(404).json({ error: 'Supplier not found' });

// ❌ Wrong
res.status(404).send('Supplier not found');
```

## Example — Before

```typescript
router.get('/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Not found');
    res.json(item);
});
```

## Example — After

```typescript
router.get('/:id', (req, res) => {
    try {
        const item = items.find(i => i.id === parseInt(req.params.id));
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (error) {
        console.error('Error in GET /:id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
```

## Do NOT

- Change the existing business logic
- Modify successful response shapes
- Add validation for fields that are already optional in the model
- Remove 204 (no-content) responses from DELETE handlers
