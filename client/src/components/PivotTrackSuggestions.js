import React, { useEffect, useState } from 'react';
import { getTracksByBpm } from '../api/apiService';
import TrackCard from './TrackCard';

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
    <div style={{ marginTop: 24 }}>
      {pivotTracks.slice(0, 1).map((track, idx) => (
        <TrackCard key={track.TrackID || idx} track={track} />
      ))}
    </div>
  );
}

export default PivotTrackSuggestions;
