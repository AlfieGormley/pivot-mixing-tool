import pytest
import sys
import os

# Add the flask-server directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../flask-server')))

from app import create_app

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app({"TESTING": True})
    yield app

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()