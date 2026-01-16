import React, { useEffect, useState } from 'react';
import { getPivotBpm } from '../api/apiService';
import { RangeSlider } from '@mantine/core';
import PivotTrackSuggestions from './PivotTrackSuggestions';

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
          marginLeft: 150,
          alignItems: 'centre',
          justifyContent: 'centre',
        }}
      >
        <div>
          {error && (
            <p style={{ color: 'red', marginTop: '15px' }}>Error: {error}</p>
          )}
          {result && (
            <>
              <div style={{ marginTop: '15px' }}>
                <h3>Result:</h3>
                <p>
                  Pivot BPM: {result.pivot_bpm} (Ratio: {result.ratio})
                </p>
              </div>
              <PivotTrackSuggestions
                pivotBpm={result.pivot_bpm}
              ></PivotTrackSuggestions>
            </>
          )}
        </div>

        <RangeSlider
          style={{
            maxWidth: '50%',
          }}
          min={110}
          max={180}
          color="white"
          step={0.1}
          value={bpms}
          onChange={setBpms}
          thumbSize={26}
          marks={[
            { value: bpms[0], label: `Origin BPM` },
            { value: bpms[1], label: `Destination BPM` },
          ]}
        />
      </div>
    </>
  );
}

export default PivotCalculator;
