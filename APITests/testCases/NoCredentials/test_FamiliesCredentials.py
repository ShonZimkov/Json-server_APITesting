import requests
from APITests.utilities.readProperties import ReadConfig
from APITests.utilities.customLogin import customLogin


baseURL = ReadConfig.getBaseURL()
def test_createFamily_noName(): # add Family test with no name
    family_payload = new_family_payload_noName()
    head = new_family_headers()
    create_family_response = create_family(family_payload, head)
    assert create_family_response.status_code == 400

def test_updateFamily_noName(): # update Family test with no name
    head = new_family_headers()
    new_payload = {
    }
    update_family_response = update_family(1, new_payload, head)
    assert update_family_response.status_code == 400


def create_family(payload, headers):
    return requests.post(baseURL + "/families", json=payload, headers=headers)

def update_family(family_id, payload, headers):
    return requests.put(baseURL + f"/families/{family_id}", json=payload, headers=headers)

def new_family_payload_noName():

    return {
    }

def new_family_headers():
    token, status_code = customLogin.login()
    assert status_code == 200

    return {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token
    }