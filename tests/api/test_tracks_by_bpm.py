import json
import pytest
from flask import url_for


# This test should be altered when we start storing tracks in a db rather than in memory
def test_tracks_by_bpm_success(client):

    # simulate uploading tracks to memory
    from app.services.rekordbox_service import save_tracks
    save_tracks([
        {"Name": "Track1", "Artist": "Artist1", "BPM": "120", "Key": "C", "PlaylistPath": "/A", "TrackID": "1"},
        {"Name": "Track2", "Artist": "Artist2", "BPM": "125", "Key": "G", "PlaylistPath": "/B", "TrackID": "2"},
    ])

    response = client.post(
        url_for('api.tracks_by_bpm'),
        data=json.dumps({"target_bpm": 120, "range": 2}),
        content_type="application/json",
    )
    data = response.get_json()

    assert response.status_code == 200
    assert data["status"] == "success"
    assert data["payload"]

def test_tracks_by_bpm_no_json(client):
    response = client.post(
        url_for('api.tracks_by_bpm'),
        data='',
        content_type="application/json",
    )
    data = response.get_json()
    assert response.status_code == 400
    assert data["status"] == "error"
    assert data["error"] == "Request body must be valid JSON."

def test_tracks_by_bpm_missing_key(client):
    response = client.post(
        url_for('api.tracks_by_bpm'),
        data=json.dumps({"range": 2}),
        content_type="application/json",
    )
    data = response.get_json()
    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Missing required key" in data["error"]

def test_tracks_by_bpm_invalid_value(client):
    response = client.post(
        url_for('api.tracks_by_bpm'),
        data=json.dumps({"target_bpm": "abc", "range": 2}),
        content_type="application/json",
    )
    data = response.get_json()
    assert response.status_code == 400
    assert data["status"] == "error"
    assert "valid positive numbers" in data["error"]

def test_tracks_by_bpm_type_error(client):
    response = client.post(
        url_for('api.tracks_by_bpm'),
        data=json.dumps({"target_bpm": [120], "range": 2}),
        content_type="application/json",
    )
    data = response.get_json()
    assert response.status_code == 400
    assert data["status"] == "error"
    assert "valid positive numbers" in data["error"]

def test_tracks_by_bpm_no_tracks_found(client):
    
    from app.services.rekordbox_service import save_tracks
    # Save tracks in memory that wont match the query
    save_tracks([
        {"Name": "Track1", "Artist": "Artist1", "BPM": "120", "Key": "C", "PlaylistPath": "/A", "TrackID": "1"},
        {"Name": "Track2", "Artist": "Artist2", "BPM": "125", "Key": "G", "PlaylistPath": "/B", "TrackID": "2"},
    ])

    response = client.post(
        url_for('api.tracks_by_bpm'),
        data=json.dumps({"target_bpm": 999, "range": 1}),
        content_type="application/json",
    )
    data = response.get_json()
    assert response.status_code == 200
    assert data["status"] == "success"
    assert len(data["payload"]) == 0
