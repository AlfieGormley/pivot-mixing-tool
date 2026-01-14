from flask import Blueprint, request, jsonify
from app.services.pivot_service import calculate_pivot_bpm
from app.services.rekordbox_service import parse_rekordbox_xml
from app.utils.response_helpers import api_success, api_error

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route("/get-pivot-bpm", methods=['POST'])
def get_pivot_bpm():
    data = request.get_json()
    pivot_bpm = calculate_pivot_bpm(data['track_1_bpm'], data['track_2_bpm'])
    return {"combined_bpm": pivot_bpm}

@bp.route("/upload-xml", methods=['POST'])
def upload_xml():
    if "rekordbox_xml" not in request.files:
        return api_error("The key 'rekordbox_xml' is missing.")
    
    file = request.files['rekordbox_xml']
    
    if file.filename == '':
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
    