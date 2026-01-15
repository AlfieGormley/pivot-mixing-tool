from flask import Blueprint, request, jsonify
from app.services.pivot_service import calculate_pivot_bpm
from app.services.rekordbox_service import parse_rekordbox_xml
from app.utils.response_helpers import api_success, api_error

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route("/get-pivot-bpm", methods=['POST'])
def get_pivot_bpm():
    data = request.get_json(silent=True)
    if data is None:
        return api_error("Request body must be valid JSON.")
    
    try:
        origin_bpm_value = data["origin_bpm"]
        destination_bpm_value = data["destination_bpm"]

        origin_bpm = float(origin_bpm_value) 
        destination_bpm = float(destination_bpm_value)

        ratio, pivot_bpm = calculate_pivot_bpm(origin_bpm, destination_bpm)

        result = {"ratio": ratio, "pivot_bpm": pivot_bpm}

        return api_success(data=result, message="Pivot calculated successfully.")

    except KeyError as e:
        return api_error(f"Missing required key in request data: {str(e)}")
    except (ValueError, TypeError):
        return api_error("BPM values must be valid positive numbers.")
    except Exception as e:
        print(f"An unexpected error occurred in get_pivot_bpm: {e}")
        return api_error("An unexpected server error occurred.", 500)

@bp.route("/upload-xml", methods=['POST'])
def upload_xml():
    if "rekordbox_xml" not in request.files:
        return api_error("The key 'rekordbox_xml' is missing.")
    
    file = request.files["rekordbox_xml"]
    
    if file.filename == "":
        return api_error("No file selected for upload.")
    
    try:
        playlist_tracks = parse_rekordbox_xml(file)
        
        return api_success(
            data= playlist_tracks,
            message=f"Successfully processed \"{file.filename}\"."
        )

    except ValueError as e:
        return api_error(str(e))
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return api_error("An unexpected server error occurred during file processing.", 500)
    