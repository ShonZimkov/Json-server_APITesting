import requests
from APITests.utilities.readProperties import ReadConfig
from APITests.utilities.customLogin import customLogin


baseURL = ReadConfig.getBaseURL()

def test_createLocation(): # add Location test with no name
    location_payload = new_location_payload_noName()
    head = new_location_headers()
    create_location_response = create_location(location_payload, head)
    assert create_location_response.status_code == 400

def test_updateLocation(): # update Location test with no name
    head = new_location_headers()
    new_payload = {
    }
    update_location_response = update_location(1, new_payload, head)
    assert update_location_response.status_code == 400


def create_location(payload, headers):
    return requests.post(baseURL + "/locations", json=payload, headers=headers)

def update_location(location_id, payload, headers):
    return requests.put(baseURL + f"/locations/{location_id}", json=payload, headers=headers)

def new_location_payload_noName():

    return {
    }

def new_location_headers():
    token, status_code = customLogin.login()
    assert status_code == 200

    return {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token
    }