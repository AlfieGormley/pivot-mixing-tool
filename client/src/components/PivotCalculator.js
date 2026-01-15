import React, { useState } from 'react';
import { getPivotBpm } from '../api/apiService';

function PivotCalculator() {
  const [originBpm, setOriginBpm] = useState('');
  const [destinationBpm, setDestinationBpm] = useState('');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = async (event) => {
    event.preventDefault();
    setError(null);
    setResult(null);

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

  return (
    <div>
      {' '}
      <form onSubmit={handleCalculate}>
        <div style={{ marginBottom: '10px' }}>
          <label>Origin BPM: </label>
          <input
            type="number"
            value={originBpm}
            onChange={(e) => setOriginBpm(e.target.value)}
            placeholder="e.g., 120"
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Destination BPM: </label>
          <input
            type="number"
            value={destinationBpm}
            onChange={(e) => setDestinationBpm(e.target.value)}
            placeholder="e.g., 130"
            required
          />
        </div>
        <button type="submit">Calculate</button>
      </form>
      {error && (
        <p style={{ color: 'red', marginTop: '15px' }}>Error: {error}</p>
      )}
      {result && (
        <div style={{ marginTop: '15px' }}>
          <h3>Result:</h3>
          <p>
            Pivot BPM: {result.pivot_bpm} (Ratio: {result.ratio})
          </p>
        </div>
      )}
    </div>
  );
}

export default PivotCalculator;
