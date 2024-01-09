import requests
from APITests.utilities.readProperties import ReadConfig
from APITests.utilities.customLogin import customLogin


baseURL = ReadConfig.getBaseURL()
transaction_id = 3
def test_getTransactions(): # get Transactions test
    head = new_transaction_headers()
    list_transactions_response = list_transactions(head)
    assert list_transactions_response.status_code == 401

def test_createTransaction(): # add Transaction test
    transaction_payload = new_transaction_payload()
    head = new_transaction_headers()
    create_transaction_response = create_transaction(transaction_payload, head)
    assert create_transaction_response.status_code == 401

def test_getTransactionByID(): # get single Transaction by ID test
    head = new_transaction_headers()
    get_product_response = get_transaction(1, head)
    assert get_product_response.status_code == 401

def test_updateTransaction(): # update Transaction test
    head = new_transaction_headers()
    new_payload = {
        "cost": 30,
        "quantity": 70,
        "productId": 4
    }
    update_transaction_response = update_transaction(transaction_id, new_payload, head)
    assert update_transaction_response.status_code == 401

def test_deleteTransaction(): # delete Transaction test
    head = new_transaction_headers()
    delete_transaction_response = delete_transaction(transaction_id, head)
    assert delete_transaction_response.status_code == 401

def create_transaction(payload, headers):
    return requests.post(baseURL + "/transactions", json=payload, headers=headers)

def update_transaction(transaction_id, payload, headers):
    return requests.put(baseURL + f"/transactions/{transaction_id}", json=payload, headers=headers)

def get_transaction(transaction_id, headers):
    return requests.get(baseURL + f"/transactions/{transaction_id}", headers=headers)

def list_transactions(headers):
    return requests.get(baseURL + "/transactions", headers=headers)

def delete_transaction(transaction_id, headers):
    return requests.delete(baseURL + f"/transactions/{transaction_id}", headers=headers)

def new_transaction_payload():
    cost = 50
    quantity = 100
    productId = 5

    return {
        "id": transaction_id,
        "cost": cost,
        "quantity": quantity,
        "productId": productId
    }

def new_transaction_headers():
    token, status_code = customLogin.login()
    assert status_code == 200

    return {
        'Accept': '*/*',
        'Authorization': 'Bearer '
    }