import requests
from APITests.utilities.readProperties import ReadConfig
from APITests.utilities.customLogin import customLogin


baseURL = ReadConfig.getBaseURL()
def test_createProduct_noName(): # add Product test with no name
    product_payload = new_product_payload_noName()
    head = new_product_headers()
    create_product_response = create_product(product_payload, head)
    assert create_product_response.status_code == 400

def test_createProduct_noPrice(): # add Product test with no price
    product_payload = new_product_payload_noPrice()
    head = new_product_headers()
    create_product_response = create_product(product_payload, head)
    assert create_product_response.status_code == 400

def test_createProduct_noQuantity(): # add Product test with no quantity
    product_payload = new_product_payload_noQuantity()
    head = new_product_headers()
    create_product_response = create_product(product_payload, head)
    assert create_product_response.status_code == 400

def test_createProduct_noLocationId(): # add Product test with no locationID
    product_payload = new_product_payload_noLocationId()
    head = new_product_headers()
    create_product_response = create_product(product_payload, head)
    assert create_product_response.status_code == 400

def test_createProduct_noFamilyId(): # add Product test with no familyID
    product_payload = new_product_payload_noFamilyId()
    head = new_product_headers()
    create_product_response = create_product(product_payload, head)
    assert create_product_response.status_code == 400

def test_updateProduct_noName(): # update Product  with no name
    head = new_product_headers()
    new_payload = {
        "price": 10,
        "quantity": 50,
        "locationId": 2,
        "familyId": 2
    }
    update_product_response = update_product(1, new_payload, head)
    assert update_product_response.status_code == 400

def test_updateProduct_noPrice(): # update Product  with no price
    head = new_product_headers()
    new_payload = {
        "name": "Yogurt",
        "quantity": 50,
        "locationId": 2,
        "familyId": 2
    }
    update_product_response = update_product(1, new_payload, head)
    assert update_product_response.status_code == 400

def test_updateProduct_noQuantity(): # update Product  with no quantity
    head = new_product_headers()
    new_payload = {
        "name": "Yogurt",
        "price": 10,
        "locationId": 2,
        "familyId": 2
    }
    update_product_response = update_product(1, new_payload, head)
    assert update_product_response.status_code == 400

def test_updateProduct_noLocationId(): # update Product  with no locationID
    head = new_product_headers()
    new_payload = {
        "name": "Yogurt",
        "price": 10,
        "quantity": 50,
        "familyId": 2
    }
    update_product_response = update_product(1, new_payload, head)
    assert update_product_response.status_code == 400

def test_updateProduct_noFamilyId(): # update Product  with no familyID
    head = new_product_headers()
    new_payload = {
        "name": "Yogurt",
        "price": 10,
        "quantity": 50,
        "locationId": 2
    }
    update_product_response = update_product(1, new_payload, head)
    assert update_product_response.status_code == 400


def create_product(payload, headers):
    return requests.post(baseURL + "/products", json=payload, headers=headers)

def update_product(product_id, payload, headers):
    return requests.put(baseURL + f"/products/{product_id}", json=payload, headers=headers)


def new_product_payload_noName():
    price = 15
    quantity = 10
    locationId = 1
    familyId = 1

    return {
      "price": price,
      "quantity": quantity,
      "locationId": locationId,
      "familyId": familyId
    }

def new_product_payload_noPrice():
    name = 'Milky'
    quantity = 10
    locationId = 1
    familyId = 1

    return {
      "name": name,
      "quantity": quantity,
      "locationId": locationId,
      "familyId": familyId
    }

def new_product_payload_noQuantity():
    name = 'Milky'
    price = 15
    locationId = 1
    familyId = 1

    return {
      "name": name,
      "price": price,
      "locationId": locationId,
      "familyId": familyId
    }

def new_product_payload_noLocationId():
    name = 'Milky'
    price = 15
    quantity = 10
    familyId = 1

    return {
      "name": name,
      "price": price,
      "quantity": quantity,
      "familyId": familyId
    }

def new_product_payload_noFamilyId():
    name = 'Milky'
    price = 15
    quantity = 10
    locationId = 1

    return {
      "name": name,
      "price": price,
      "quantity": quantity,
      "locationId": locationId
    }

def new_product_headers():
    token, status_code = customLogin.login()
    assert status_code == 200

    return {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token
    }