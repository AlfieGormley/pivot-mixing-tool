from flask import jsonify

def api_success(data=None, message="Success"):
    response = {
        "status": "success",
        "message": message,
        "payload": data
    }
    return jsonify(response), 200

def api_error(message="An error occurred", status_code=400):
    response = {
        "status": "error",
        "error": message,
        "payload": None
    }
    return jsonify(response), status_code