import React, { useEffect, useState } from 'react';
import { getPivotBpm } from '../api/apiService';
import { RangeSlider } from '@mantine/core';
import PivotTrackSuggestions from './PivotTrackSuggestions';
import BpmTile from './BpmTile';

function PivotCalculator() {
  const [bpms, setBpms] = useState([110, 180]);
  const originBpm = bpms[0];
  const destinationBpm = bpms[1];

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCalculate = async () => {
      setError(null);

      try {
        const payload = await getPivotBpm(
          parseFloat(originBpm),
          parseFloat(destinationBpm)
        );

        setResult(payload);
      } catch (err) {
        setError(err.message);
      }
    };
    handleCalculate();
  }, [bpms, destinationBpm, originBpm]);

  return (
    <>
      <div
        style={{
          marginTop: 200,
          marginBottom: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 600, // or any fixed width you prefer
            maxWidth: '90vw',
            minWidth: 350,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {error && (
            <p style={{ color: 'red', marginTop: '15px' }}>Error: {error}</p>
          )}
          {result && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              <div style={{ marginTop: 23 }}>
                <BpmTile bpm={result.pivot_bpm} ratio={result.ratio}></BpmTile>
              </div>
              <PivotTrackSuggestions
                pivotBpm={result.pivot_bpm}
              ></PivotTrackSuggestions>
            </div>
          )}
        </div>

        <RangeSlider
          style={{
            width: '50%',
            marginTop: 40,
          }}
          min={110}
          max={180}
          color="white"
          step={1}
          value={bpms}
          onChange={setBpms}
          thumbSize={26}
          marks={[
            { value: bpms[0], label: `Origin` },
            { value: bpms[1], label: `Destination` },
          ]}
        />
      </div>
    </>
  );
}

export default PivotCalculator;
