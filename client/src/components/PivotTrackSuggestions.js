import React, { useEffect, useState } from 'react';
import { getTracksByBpm } from '../api/apiService';

function PivotTrackSuggestions({ pivotBpm }) {
  const [pivotTracks, setPivotTracks] = useState([]);
  const range = 5;
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPivotTracks = async () => {
      setError(null);

      try {
        const payload = await getTracksByBpm(
          parseFloat(pivotBpm),
          parseFloat(range)
        );

        setPivotTracks(payload);
      } catch (err) {
        setError(err.message);
      }
    };
    getPivotTracks();
  }, [pivotBpm]);

  return (
    <div>
      {' '}
      <div>
        <h3>Track Suggestions</h3>
        <ul>
          {pivotTracks.slice(0, 3).map((track, idx) => (
            <li key={track.TrackID || idx}>
              <strong>{track.Name}</strong> by {track.Artist} | BPM: {track.BPM}{' '}
              | Key: {track.Key} | Location: {track.PlaylistPath}
            </li>
          ))}
        </ul>
        {pivotTracks.length === 0 && <div>No tracks found.</div>}
      </div>
    </div>
  );
}

export default PivotTrackSuggestions;
