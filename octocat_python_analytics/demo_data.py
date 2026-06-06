"""Hardcoded demo data for the standalone analytics module."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True)
class Supplier:
    """Supplier dimension for analytics."""

    id: int
    name: str


@dataclass(frozen=True)
class Branch:
    """Branch dimension for analytics."""

    id: int
    name: str


@dataclass(frozen=True)
class Product:
    """Product dimension for analytics."""

    id: int
    supplier_id: int
    name: str


@dataclass(frozen=True)
class Order:
    """Order fact with branch ownership."""

    id: int
    branch_id: int
    order_date: date


@dataclass(frozen=True)
class Delivery:
    """Delivery fact capturing expected vs actual completion date."""

    id: int
    supplier_id: int
    expected_date: date
    delivered_date: date


@dataclass(frozen=True)
class OrderLine:
    """Order line fact for product-level trend analytics."""

    id: int
    order_id: int
    product_id: int
    quantity: int


SUPPLIERS: list[Supplier] = [
    Supplier(id=1, name="PurrTech Industries"),
    Supplier(id=2, name="WhiskerWare Labs"),
    Supplier(id=3, name="CatNip Creations"),
]

BRANCHES: list[Branch] = [
    Branch(id=1, name="Meowtown Central"),
    Branch(id=2, name="Tabby Terrace"),
    Branch(id=3, name="Pawline Point"),
]

PRODUCTS: list[Product] = [
    Product(id=1, supplier_id=1, name="Smart Feeder Pro"),
    Product(id=2, supplier_id=1, name="Litter Dome X"),
    Product(id=3, supplier_id=2, name="Laser Chase 360"),
    Product(id=4, supplier_id=2, name="Nap Pod Deluxe"),
    Product(id=5, supplier_id=3, name="CatFlix Window Perch"),
    Product(id=6, supplier_id=3, name="PawSense Tracker"),
]

ORDERS: list[Order] = [
    Order(id=1, branch_id=1, order_date=date(2026, 4, 1)),
    Order(id=2, branch_id=1, order_date=date(2026, 4, 3)),
    Order(id=3, branch_id=2, order_date=date(2026, 4, 7)),
    Order(id=4, branch_id=3, order_date=date(2026, 4, 9)),
    Order(id=5, branch_id=2, order_date=date(2026, 4, 11)),
    Order(id=6, branch_id=1, order_date=date(2026, 4, 15)),
    Order(id=7, branch_id=3, order_date=date(2026, 4, 18)),
    Order(id=8, branch_id=2, order_date=date(2026, 4, 21)),
]

DELIVERIES: list[Delivery] = [
    Delivery(id=1, supplier_id=1, expected_date=date(2026, 4, 5), delivered_date=date(2026, 4, 5)),
    Delivery(id=2, supplier_id=1, expected_date=date(2026, 4, 10), delivered_date=date(2026, 4, 12)),
    Delivery(id=3, supplier_id=1, expected_date=date(2026, 4, 18), delivered_date=date(2026, 4, 18)),
    Delivery(id=4, supplier_id=2, expected_date=date(2026, 4, 6), delivered_date=date(2026, 4, 9)),
    Delivery(id=5, supplier_id=2, expected_date=date(2026, 4, 14), delivered_date=date(2026, 4, 15)),
    Delivery(id=6, supplier_id=2, expected_date=date(2026, 4, 20), delivered_date=date(2026, 4, 20)),
    Delivery(id=7, supplier_id=3, expected_date=date(2026, 4, 8), delivered_date=date(2026, 4, 8)),
    Delivery(id=8, supplier_id=3, expected_date=date(2026, 4, 16), delivered_date=date(2026, 4, 19)),
    Delivery(id=9, supplier_id=3, expected_date=date(2026, 4, 24), delivered_date=date(2026, 4, 24)),
]

ORDER_LINES: list[OrderLine] = [
    OrderLine(id=1, order_id=1, product_id=1, quantity=5),
    OrderLine(id=2, order_id=1, product_id=3, quantity=2),
    OrderLine(id=3, order_id=2, product_id=2, quantity=4),
    OrderLine(id=4, order_id=2, product_id=6, quantity=3),
    OrderLine(id=5, order_id=3, product_id=4, quantity=2),
    OrderLine(id=6, order_id=3, product_id=5, quantity=5),
    OrderLine(id=7, order_id=4, product_id=1, quantity=3),
    OrderLine(id=8, order_id=5, product_id=3, quantity=6),
    OrderLine(id=9, order_id=5, product_id=6, quantity=1),
    OrderLine(id=10, order_id=6, product_id=2, quantity=5),
    OrderLine(id=11, order_id=7, product_id=4, quantity=4),
    OrderLine(id=12, order_id=7, product_id=5, quantity=2),
    OrderLine(id=13, order_id=8, product_id=6, quantity=7),
    OrderLine(id=14, order_id=8, product_id=1, quantity=2),
]
