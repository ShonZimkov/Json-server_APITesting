import requests
from APITests.utilities.readProperties import ReadConfig
from APITests.utilities.customLogin import customLogin


baseURL = ReadConfig.getBaseURL()
product_id = 48
def test_getProducts(): # get Products test
    head = new_product_headers()
    list_products_response = list_products(head)
    assert list_products_response.status_code == 200

def test_createProduct(): # add Product test
    product_payload = new_product_payload()
    head = new_product_headers()
    create_product_response = create_product(product_payload, head)
    assert create_product_response.status_code == 201

def test_getProductByID(): # get single Product by ID test
    head = new_product_headers()
    get_product_response = get_product(1, head)
    assert get_product_response.status_code == 200

def test_updateProduct(): # update Product test
    head = new_product_headers()
    new_payload = {
        "name": "Yogurt",
        "price": 10,
        "quantity": 50,
        "locationId": 2,
        "familyId": 2
    }
    update_product_response = update_product(product_id, new_payload, head)
    assert update_product_response.status_code == 200

def test_deleteProduct(): # delete Product test
    head = new_product_headers()
    delete_product_response = delete_product(product_id, head)
    assert delete_product_response.status_code == 200

def create_product(payload, headers):
    return requests.post(baseURL + "/products", json=payload, headers=headers)

def update_product(product_id, payload, headers):
    return requests.put(baseURL + f"/products/{product_id}", json=payload, headers=headers)

def get_product(product_id, headers):
    return requests.get(baseURL + f"/products/{product_id}", headers=headers)

def list_products(headers):
    return requests.get(baseURL + "/products", headers=headers)

def delete_product(product_id, headers):
    return requests.delete(baseURL + f"/products/{product_id}", headers=headers)

def new_product_payload():
    name = 'Milky'
    price = 15
    quantity = 10
    locationId = 1
    familyId = 1

    return {
      "id": product_id,
      "name": name,
      "price": price,
      "quantity": quantity,
      "locationId": locationId,
      "familyId": familyId
    }

def new_product_headers():
    token, status_code = customLogin.login()
    assert status_code == 200

    return {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token
    }