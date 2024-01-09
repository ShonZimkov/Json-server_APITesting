import requests
from APITests.utilities.readProperties import ReadConfig
from APITests.utilities.customLogin import customLogin


baseURL = ReadConfig.getBaseURL()
family_id = 3
def test_getFamilys(): # get Familys test
    head = new_family_headers()
    list_families_response = list_families(head)
    assert list_families_response.status_code == 200

def test_createFamily(): # add Family test
    family_payload = new_family_payload()
    head = new_family_headers()
    create_family_response = create_family(family_payload, head)
    assert create_family_response.status_code == 201

def test_getFamilyByID(): # get single Family by ID test
    head = new_family_headers()
    get_product_response = get_family(1, head)
    assert get_product_response.status_code == 200

def test_updateFamily(): # update Family test
    head = new_family_headers()
    new_payload = {
        "name": "Sweets"
    }
    update_family_response = update_family(family_id, new_payload, head)
    assert update_family_response.status_code == 200

def test_deleteFamily(): # delete Family test
    head = new_family_headers()
    delete_family_response = delete_family(family_id, head)
    assert delete_family_response.status_code == 200

def create_family(payload, headers):
    return requests.post(baseURL + "/families", json=payload, headers=headers)

def update_family(family_id, payload, headers):
    return requests.put(baseURL + f"/families/{family_id}", json=payload, headers=headers)

def get_family(family_id, headers):
    return requests.get(baseURL + f"/families/{family_id}", headers=headers)

def list_families(headers):
    return requests.get(baseURL + "/families", headers=headers)

def delete_family(family_id, headers):
    return requests.delete(baseURL + f"/families/{family_id}", headers=headers)

def new_family_payload():
    name = 'Sours'

    return {
        "id": family_id,
        "name": name
    }

def new_family_headers():
    token, status_code = customLogin.login()
    assert status_code == 200

    return {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token
    }