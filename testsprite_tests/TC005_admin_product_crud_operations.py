def test_tc005_order_payload_schema():
    # Sample payload that should conform to the PRD for creating an order
    payload = {
        "customer_name": "Test Customer",
        "customer_email": "test@example.com",
        "customer_mobile": "+441234567890",
        "pickup_date": "2025-08-20",
        "pickup_time": "10:30",
        "items": [
            {"product_id": "prod_1", "quantity": 2, "price_pence": 250}
        ],
        "bag_fee_included": False
    }

    # Validate required string fields
    assert isinstance(payload.get("customer_name"), str) and payload["customer_name"].strip(), "customer_name must be a non-empty string"
    assert isinstance(payload.get("customer_email"), str) and payload["customer_email"].strip(), "customer_email must be a non-empty string"
    assert isinstance(payload.get("customer_mobile"), str) and payload["customer_mobile"].strip(), "customer_mobile must be a non-empty string"
    assert isinstance(payload.get("pickup_date"), str) and payload["pickup_date"].strip(), "pickup_date must be a non-empty string"
    assert isinstance(payload.get("pickup_time"), str) and payload["pickup_time"].strip(), "pickup_time must be a non-empty string"

    # Validate items is an array and each item has expected fields/types
    assert isinstance(payload.get("items"), list), "items must be an array"
    assert len(payload["items"]) > 0, "items must contain at least one item"
    for idx, item in enumerate(payload["items"]):
        assert isinstance(item, dict), f"item at index {idx} must be an object"
        assert isinstance(item.get("product_id"), str) and item["product_id"].strip(), f"item[{idx}].product_id must be a non-empty string"
        assert isinstance(item.get("quantity"), int) and item["quantity"] > 0, f"item[{idx}].quantity must be a positive integer"
        # price_pence is optional in PRD for items, but if present must be integer
        if "price_pence" in item:
            assert isinstance(item["price_pence"], int), f"item[{idx}].price_pence must be an integer"

    # Validate bag_fee_included is boolean
    assert isinstance(payload.get("bag_fee_included"), bool), "bag_fee_included must be a boolean"


# Call the test
test_tc005_order_payload_schema()