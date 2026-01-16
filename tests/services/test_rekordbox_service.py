import pytest
from app.services import rekordbox_service

# Write new test for this when we change to db storage
def test_save_tracks_saves_all_tracks():
    tracks = [
        {"Name": "Track1", "BPM": "120"},
        {"Name": "Track2", "BPM": "125"},
    ]
    rekordbox_service.save_tracks(tracks)
    assert rekordbox_service.TRACKS == tracks

def test_find_tracks_by_bpm_no_matches():
    rekordbox_service.save_tracks([
        {"Name": "Track1", "BPM": "110"},
        {"Name": "Track2", "BPM": "130"},
    ])
    result = rekordbox_service.find_tracks_by_bpm(120, range=2)
    assert result == []

def test_find_tracks_by_bpm_single_match():
    rekordbox_service.save_tracks([
        {"Name": "Track1", "BPM": "120"},
        {"Name": "Track2", "BPM": "130"},
    ])
    result = rekordbox_service.find_tracks_by_bpm(120, range=0)
    assert len(result) == 1
    assert result[0]["Name"] == "Track1"

def test_find_tracks_by_bpm_multiple_matches():
    rekordbox_service.save_tracks([
        {"Name": "Track1", "BPM": "119"},
        {"Name": "Track2", "BPM": "120"},
        {"Name": "Track3", "BPM": "121"},
        {"Name": "Track4", "BPM": "122"},
        {"Name": "Track5", "BPM": "118"},
    ])
    result = rekordbox_service.find_tracks_by_bpm(120, range=1)
    names = [track["Name"] for track in result]
    assert set(names) == {"Track1", "Track2", "Track3"}

def test_find_tracks_by_bpm_just_outside_range():
    rekordbox_service.save_tracks([
        {"Name": "Track1", "BPM": "117.9"},
        {"Name": "Track2", "BPM": "122.1"},
    ])
    result = rekordbox_service.find_tracks_by_bpm(120, range=2)
    assert result == []

def test_find_tracks_by_bpm_non_numeric_bpm():
    rekordbox_service.save_tracks([
        {"Name": "Track1", "BPM": "not_a_number"},
        {"Name": "Track2", "BPM": None},
        {"Name": "Track3", "BPM": ""},
    ])
    result = rekordbox_service.find_tracks_by_bpm(120)
    assert result == []


def test_find_tracks_by_bpm_float_and_int():
    rekordbox_service.save_tracks([
        {"Name": "Track1", "BPM": 120},
        {"Name": "Track2", "BPM": "120.0"},
        {"Name": "Track3", "BPM": 121.5},
    ])
    result = rekordbox_service.find_tracks_by_bpm(120, range=1.5)
    names = [track["Name"] for track in result]
    assert set(names) == {"Track1", "Track2", "Track3"}