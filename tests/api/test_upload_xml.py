import io
from flask import url_for

# Valid Rekordbox XML Upload
def test_upload_xml_success(client):

    test_xml_content = b"""
    <DJ_PLAYLISTS>
      <COLLECTION>
        <TRACK TrackID="1" Name="Test Track" Artist="Test Artist"></TRACK>
      </COLLECTION>
      <PLAYLISTS>
        <NODE Name="ROOT">
          <NODE Name="Test Playlist"><TRACK Key="1"></TRACK></NODE>
        </NODE>
      </PLAYLISTS>
    </DJ_PLAYLISTS>
    """

    test_file = (io.BytesIO(test_xml_content), 'test.xml')
    data = {'rekordbox_xml': test_file}

    response = client.post(url_for('api.upload_xml'), data=data)

    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['status'] == 'success'
    assert 'Successfully processed' in json_data['message']
    assert len(json_data['payload']) == 1
    assert json_data['payload'][0]['Name'] == 'Test Track'

# Request missing the file key
def test_upload_xml_missing_key(client):

    response = client.post(url_for('api.upload_xml'), data={})

    assert response.status_code == 400
    json_data = response.get_json()
    assert json_data['status'] == 'error'
    assert json_data['error'] == "The key 'rekordbox_xml' is missing."

# Request with key but no file
def test_upload_xml_no_file_attached(client):

    data = {'rekordbox_xml': (io.BytesIO(b''), '')} 

    response = client.post(url_for('api.upload_xml'), data=data)

    assert response.status_code == 400
    json_data = response.get_json()
    assert json_data['status'] == 'error'
    assert json_data['error'] == "No file selected for upload."

# Invalid file type 
def test_upload_xml_with_invalid_file_type(client):

    test_file = (io.BytesIO(b"here is some next thats not XML"), 'test.txt')
    data = {'rekordbox_xml': test_file}

    response = client.post(url_for('api.upload_xml'), data=data)

    assert response.status_code == 400
    json_data = response.get_json()
    assert json_data['status'] == 'error'
    assert json_data['error'] == "Invalid File: The uploaded file is not a valid XML document."

# Malformed XML
def test_upload_xml_with_malformed_structure(client):

    test_xml_content = b"<DJ_PLAYLISTS><PLAYLISTS><TRACK Key='1'></TRACK></PLAYLISTS></DJ_PLAYLISTS>"
    test_file = (io.BytesIO(test_xml_content), 'malformed_structure.xml')
    data = {'rekordbox_xml': test_file}

    response = client.post(url_for('api.upload_xml'), data=data)

    assert response.status_code == 400
    json_data = response.get_json()
    assert json_data['status'] == 'error'
    assert json_data['error'] == "Invalid Rekordbox XML: The file does not contain a track collection or is in an unsupported format."

# Valid XML but no Playlists
def test_upload_xml_with_no_playlists(client):

    test_xml_content = b"""
    <DJ_PLAYLISTS>
      <COLLECTION>
        <TRACK TrackID="1" Name="Test Track" Artist="Test Artist"></TRACK>
      </COLLECTION>
      <PLAYLISTS>
        <NODE Name="ROOT"></NODE>
      </PLAYLISTS>
    </DJ_PLAYLISTS>
    """
    test_file = (io.BytesIO(test_xml_content), 'no_playlists.xml')
    data = {'rekordbox_xml': test_file}

    response = client.post(url_for('api.upload_xml'), data=data)

    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['status'] == 'success'
    assert isinstance(json_data['payload'], list)
    assert len(json_data['payload']) == 0 