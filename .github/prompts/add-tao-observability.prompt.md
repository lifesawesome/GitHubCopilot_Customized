---
name: 'add-tao-observability'
description: 'Add TAO observability instrumentation (tracing, metrics, logging) to Express routes'
agent: 'agent'
---

# Add TAO Observability

Instrument the selected Express route or service file with the TAO (TypeScript API Observability) framework.

## Important
- **TAO is already installed** — do NOT add it to package.json
- Refer to [TAO documentation](../../docs/tao.md) for complete API reference

## Instrumentation Guidelines

### Route-Level Tracing
Add `@Trace` decorator to route handler classes or wrap handlers:

```typescript
import { Trace, Measure, Log } from 'tao';

// Trace the entire route handler
@Trace('product-route')
class ProductRoute {
    @Measure('get-all-products')
    getAllProducts(req: Request, res: Response) {
        // handler logic
    }
}
```

### Metrics
Add `@Measure` for performance-critical operations:
- Database queries or data fetching
- Complex computations
- External API calls

### Structured Logging
Add `@Log` for important operations:
- Entity creation/update/deletion
- Error conditions
- Authentication events

### Custom Metrics
Register custom metrics for business KPIs:

```typescript
import { MetricsRegistry } from 'tao';

const orderCounter = MetricsRegistry.counter('orders_created_total', 'Total orders created');
const deliveryDuration = MetricsRegistry.histogram('delivery_duration_seconds', 'Delivery fulfillment time');
```

### Environment Configuration
TAO is configured via environment variables:

```env
TAO_SERVICE_NAME=octocat-api
TAO_TRACE_ENDPOINT=http://jaeger:14268/api/traces
TAO_METRICS_ENDPOINT=http://prometheus:9090
TAO_LOG_LEVEL=info
```

## Rules
- Do not modify existing business logic
- Add observability as a cross-cutting concern only
- Keep metric names lowercase with underscores
- Use meaningful span names that reflect the operation
- Include relevant attributes (entity ID, status, operation type)
