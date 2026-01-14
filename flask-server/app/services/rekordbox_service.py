from pathlib import Path
from xml.etree import ElementTree as ET

def parse_rekordbox_xml(file_object):

    try:
        tree = ET.parse(file_object)
        root = tree.getroot()
        collection_lookup = {}

        # Populate the collection lookup
        for track_node in root.findall(".//COLLECTION/TRACK"):
            track_id = track_node.get("TrackID")
            if track_id:
                collection_lookup[track_id] = {
                    "TrackID": track_id,
                    "Name": track_node.get("Name"),
                    "Artist": track_node.get("Artist"),
                    "BPM": track_node.get("AverageBpm"),
                    "Key": track_node.get("Tonality"),
                }
        
        if not collection_lookup:
            raise ValueError("Invalid Rekordbox XML: The file does not contain a track collection or is in an unsupported format.")
        

        playlist_tracks = []
        processed_track_ids = set()
            
        def build_track_list(node, current_path = ""):

            node_name = node.get("Name", "")
            new_path = f"{current_path}/{node_name}" if current_path else node_name

            for track in node.findall('TRACK'):
                track_id = track.get('Key')
                    
                if track_id in collection_lookup and track_id not in processed_track_ids:
                    track_data = collection_lookup[track_id].copy()
                    track_data["PlaylistPath"] = new_path
                    playlist_tracks.append(track_data)
                    processed_track_ids.add(track_id)
                
            for child_node in node.findall('NODE'):
                build_track_list(child_node, new_path)

        

        # Find the top-level playlist node (<NODE Name="ROOT">) inside <PLAYLISTS>
        playlist_root = root.find("PLAYLISTS/NODE[@Name='ROOT']")

        # Saftey check: return an empty array if ROOT playlist doesnt exisit
        if playlist_root is None:
            return []
        
        for node in playlist_root.findall('NODE'):
            build_track_list(node)

        return playlist_tracks
    
    except ET.ParseError:
        raise ValueError("Invalid File: The uploaded file is not a valid XML document.")
    except Exception as e:
        raise e