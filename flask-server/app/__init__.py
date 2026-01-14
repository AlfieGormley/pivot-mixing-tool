from flask import Flask
from flask_cors import CORS

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        # Standard path
        app.config.from_pyfile('config.py', silent=True) 
    else:
        # Test path
        app.config.from_mapping(test_config)

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    # Import and register the single blueprint
    from . import api
    app.register_blueprint(api.bp)

    return app