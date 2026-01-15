import json
import pytest
from flask import url_for

def test_get_pivot_bpm_success(client):

    response = client.post(
        url_for('api.get_pivot_bpm'),
        data=json.dumps({"origin_bpm": 120, "destination_bpm": 130}),
        content_type="application/json",
    )
    data = response.get_json()

    assert response.status_code == 200
    assert data["status"] == "success"
    assert data["payload"]


def test_get_pivot_bpm_missing_key(client):

    response = client.post(
        url_for('api.get_pivot_bpm'),
        data=json.dumps({"origin_bpm": 120}),
        content_type="application/json",
    )
    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Missing required key" in data["error"]


def test_get_pivot_bpm_invalid_value(client):

    response = client.post(
        url_for('api.get_pivot_bpm'),
        data=json.dumps({"origin_bpm": 120, "destination_bpm": "abc"}),
        content_type="application/json",
    )
    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert data["error"] == "BPM values must be valid positive numbers."


def test_get_pivot_bpm_invalid_json(client):

    response = client.post(
        url_for('api.get_pivot_bpm'),
        data='{"origin_bpm": 120, "destination_bpm": 130',
        content_type="application/json",
    )
    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert data["error"] == "Request body must be valid JSON."


def test_get_pivot_bpm_zero_bpm_value(client):

    response = client.post(
        url_for('api.get_pivot_bpm'), 
        data=json.dumps({"origin_bpm": 0, "destination_bpm": 130}),
        content_type="application/json",
    )
    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert data["error"] == "BPM values must be valid positive numbers."