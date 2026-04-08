---
name: 'Python Standards'
description: 'Coding conventions and best practices for Python files'
applyTo: '**/*.py'
---

# Python Coding Standards

## Style Guide
- Follow **PEP 8** style guidelines strictly
- Use 4 spaces for indentation — no tabs
- Maximum line length: 88 characters (Black formatter default)
- Use snake_case for functions, methods, and variables
- Use PascalCase for class names
- Use SCREAMING_SNAKE_CASE for constants

```python
# Good
MAX_RETRIES = 3

class UserRepository:
    def get_user_by_id(self, user_id: int) -> User:
        pass

# Bad
maxRetries = 3
class userRepository:
    def GetUserById(self, userId):
        pass
```

## Type Hints
- Use type hints for **all** function signatures (parameters and return types)
- Use `Optional[T]` for nullable types or `T | None` (Python 3.10+)
- Use `typing` module for complex types (`List`, `Dict`, `Tuple`, `Union`)
- Add `-> None` for functions that don't return a value

```python
from typing import Optional

def calculate_total(items: list[dict], discount: float = 0.0) -> float:
    """Calculate the total price with optional discount."""
    pass

def find_user(user_id: int) -> Optional[User]:
    """Return user or None if not found."""
    pass
```

## Docstrings
- Write docstrings for all public modules, classes, and functions
- Use Google-style or NumPy-style docstrings consistently
- Include `Args`, `Returns`, and `Raises` sections where applicable

```python
def process_order(order_id: int, notify: bool = True) -> OrderResult:
    """Process an order and optionally send notification.

    Args:
        order_id: The unique identifier of the order.
        notify: Whether to send email notification. Defaults to True.

    Returns:
        OrderResult containing status and tracking info.

    Raises:
        OrderNotFoundError: If order_id doesn't exist.
        PaymentError: If payment processing fails.
    """
    pass
```

## Imports
- Group imports in order: standard library, third-party, local
- Use absolute imports over relative imports
- One import per line for clarity
- Sort imports alphabetically within each group (use `isort`)

```python
# Standard library
import json
import logging
from datetime import datetime
from pathlib import Path

# Third-party
import requests
from pydantic import BaseModel

# Local
from app.models import User
from app.services import email_service
```

## Error Handling
- Use specific exceptions over generic `Exception`
- Create custom exceptions for domain-specific errors
- Always include meaningful error messages
- Use `try/except/finally` appropriately

```python
class OrderNotFoundError(Exception):
    """Raised when an order cannot be found."""
    pass

def get_order(order_id: int) -> Order:
    try:
        order = repository.find(order_id)
        if order is None:
            raise OrderNotFoundError(f"Order {order_id} not found")
        return order
    except DatabaseError as e:
        logger.error(f"Database error fetching order {order_id}: {e}")
        raise
```

## Classes
- Use dataclasses or Pydantic models for data structures
- Keep classes focused on single responsibility
- Prefer composition over inheritance
- Use `@property` for computed attributes

```python
from dataclasses import dataclass
from pydantic import BaseModel

@dataclass
class Point:
    x: float
    y: float

    @property
    def magnitude(self) -> float:
        return (self.x ** 2 + self.y ** 2) ** 0.5

class UserCreate(BaseModel):
    email: str
    name: str
    password: str
```

## Functions
- Keep functions small and focused (< 20 lines ideally)
- Use default arguments for optional parameters
- Avoid mutable default arguments (`def foo(items=None)` not `def foo(items=[])`)
- Return early to reduce nesting

```python
# Good — early return
def get_discount(user: User) -> float:
    if not user.is_member:
        return 0.0
    if user.tier == "gold":
        return 0.20
    if user.tier == "silver":
        return 0.10
    return 0.05

# Bad — deep nesting
def get_discount(user: User) -> float:
    if user.is_member:
        if user.tier == "gold":
            return 0.20
        else:
            if user.tier == "silver":
                return 0.10
            else:
                return 0.05
    else:
        return 0.0
```

## Testing
- Use `pytest` as the testing framework
- Name test files with `test_` prefix
- Name test functions with `test_` prefix
- Use fixtures for shared setup
- Aim for high coverage on business logic

```python
import pytest
from app.services import calculate_total

class TestCalculateTotal:
    def test_empty_cart_returns_zero(self):
        assert calculate_total([]) == 0.0

    def test_applies_discount_correctly(self):
        items = [{"price": 100}]
        assert calculate_total(items, discount=0.1) == 90.0

    @pytest.fixture
    def sample_cart(self):
        return [{"price": 10}, {"price": 20}]

    def test_sums_multiple_items(self, sample_cart):
        assert calculate_total(sample_cart) == 30.0
```

## Logging
- Use the `logging` module — never `print()` in production code
- Configure logging at application entry point
- Use appropriate log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL

```python
import logging

logger = logging.getLogger(__name__)

def process_payment(amount: float) -> bool:
    logger.info(f"Processing payment of ${amount}")
    try:
        result = payment_gateway.charge(amount)
        logger.debug(f"Payment result: {result}")
        return True
    except PaymentError as e:
        logger.error(f"Payment failed: {e}")
        return False
```

## Async/Await
- Use `async`/`await` for I/O-bound operations
- Use `asyncio.gather()` for concurrent tasks
- Avoid mixing sync and async code unnecessarily

```python
import asyncio
import httpx

async def fetch_user_data(user_ids: list[int]) -> list[dict]:
    async with httpx.AsyncClient() as client:
        tasks = [client.get(f"/api/users/{uid}") for uid in user_ids]
        responses = await asyncio.gather(*tasks)
        return [r.json() for r in responses]
```

## Security
- Never hardcode secrets — use environment variables
- Sanitize user input before database queries
- Use parameterized queries to prevent SQL injection
- Hash passwords with `bcrypt` or `argon2`
