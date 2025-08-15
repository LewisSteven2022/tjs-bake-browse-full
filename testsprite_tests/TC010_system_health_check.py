import requests


def test_get_fees():
    url = "http://127.0.0.1:3000/api/fees"
    resp = requests.get(url, timeout=5)

    # Verify HTTP response
    assert resp.status_code == 200, f"Expected 200 OK, got {resp.status_code}. Body: {resp.text}"

    # Verify JSON structure
    data = resp.json()
    assert isinstance(data, dict), f"Expected JSON object, got {type(data)}"
    assert 'fees' in data, "Missing 'fees' key in response"
    assert isinstance(data['fees'], list), "'fees' must be a list"

    # Verify each fee entry
    for idx, fee in enumerate(data['fees']):
        assert isinstance(fee, dict), f"fees[{idx}] must be an object"
        assert 'name' in fee and isinstance(fee['name'], str), f"fees[{idx}].name missing or not a string"
        assert 'amount_pence' in fee and isinstance(fee['amount_pence'], int), f"fees[{idx}].amount_pence missing or not an integer"

    print('Test passed: /api/fees returned valid fees')


if __name__ == '__main__':
    test_get_fees()