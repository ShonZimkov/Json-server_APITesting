import requests
from APITests.utilities.readProperties import ReadConfig
from APITests.utilities.customLogin import customLogin


baseURL = ReadConfig.getBaseURL()
location_id = 3
def test_getLocations(): # get Locations test
    head = new_location_headers()
    list_locations_response = list_locations(head)
    assert list_locations_response.status_code == 200

def test_createLocation(): # add Location test
    location_payload = new_location_payload()
    head = new_location_headers()
    create_location_response = create_location(location_payload, head)
    assert create_location_response.status_code == 201

def test_getLocationByID(): # get single Location by ID test
    head = new_location_headers()
    get_product_response = get_location(1, head)
    assert get_product_response.status_code == 200

def test_updateLocation(): # update Location test
    head = new_location_headers()
    new_payload = {
        "name": "New York"
    }
    update_location_response = update_location(location_id, new_payload, head)
    assert update_location_response.status_code == 200

def test_deleteLocation(): # delete Location test
    head = new_location_headers()
    delete_location_response = delete_location(location_id, head)
    assert delete_location_response.status_code == 200

def create_location(payload, headers):
    return requests.post(baseURL + "/locations", json=payload, headers=headers)

def update_location(location_id, payload, headers):
    return requests.put(baseURL + f"/locations/{location_id}", json=payload, headers=headers)

def get_location(location_id, headers):
    return requests.get(baseURL + f"/locations/{location_id}", headers=headers)

def list_locations(headers):
    return requests.get(baseURL + "/locations", headers=headers)

def delete_location(location_id, headers):
    return requests.delete(baseURL + f"/locations/{location_id}", headers=headers)

def new_location_payload():
    name = 'Israel'

    return {
        "id": location_id,
        "name": name
    }

def new_location_headers():
    token, status_code = customLogin.login()
    assert status_code == 200

    return {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token
    }