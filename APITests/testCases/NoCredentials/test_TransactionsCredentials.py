import requests
from APITests.utilities.readProperties import ReadConfig
from APITests.utilities.customLogin import customLogin


baseURL = ReadConfig.getBaseURL()
def test_createTransaction_noCost(): # add Transaction test with no cost
    transaction_payload = new_transaction_payload_noCost()
    head = new_transaction_headers()
    create_transaction_response = create_transaction(transaction_payload, head)
    assert create_transaction_response.status_code == 400

def test_createTransaction_noQuantity(): # add Transaction test with no quantity
    transaction_payload = new_transaction_payload_noQuantity()
    head = new_transaction_headers()
    create_transaction_response = create_transaction(transaction_payload, head)
    assert create_transaction_response.status_code == 400

def test_createTransaction_noProductId(): # add Transaction test with no productID
    transaction_payload = new_transaction_payload_noProductId()
    head = new_transaction_headers()
    create_transaction_response = create_transaction(transaction_payload, head)
    assert create_transaction_response.status_code == 400

def test_updateTransaction_noCost(): # update Transaction  with no cost
    head = new_transaction_headers()
    new_payload = {
        "quantity": 50,
        "productId": 2
    }
    update_transaction_response = update_transaction(1, new_payload, head)
    assert update_transaction_response.status_code == 400

def test_updateTransaction_noQuantity(): # update Transaction  with no quantity
    head = new_transaction_headers()
    new_payload = {
        "cost": 20,
        "productId": 2,
    }
    update_transaction_response = update_transaction(1, new_payload, head)
    assert update_transaction_response.status_code == 400

def test_updateTransaction_noProductId(): # update Transaction  with no productID
    head = new_transaction_headers()
    new_payload = {
        "cost": 2,
        "quantity": 200
    }
    update_transaction_response = update_transaction(1, new_payload, head)
    assert update_transaction_response.status_code == 400


def create_transaction(payload, headers):
    return requests.post(baseURL + "/transactions", json=payload, headers=headers)

def update_transaction(transaction_id, payload, headers):
    return requests.put(baseURL + f"/transactions/{transaction_id}", json=payload, headers=headers)

def new_transaction_payload_noCost():
    quantity = 10
    productId = 1

    return {
      "quantity": quantity,
      "productId": productId
    }

def new_transaction_payload_noQuantity():
    cost = 15
    productId = 1

    return {
      "cost": cost,
      "productId": productId
    }

def new_transaction_payload_noProductId():
    cost = 15
    quantity = 10

    return {
      "cost": cost,
      "quantity": quantity
    }


def new_transaction_headers():
    token, status_code = customLogin.login()
    assert status_code == 200

    return {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token
    }