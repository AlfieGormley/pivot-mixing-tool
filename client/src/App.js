import '@mantine/core/styles.css';
import React, { useState } from 'react';
import { MantineProvider } from '@mantine/core';
import LibraryUploader from './components/LibraryUploader';

function App() {
  const [combinedBpm, setCombinedBpm] = useState();

  const [bpm1, setBpm1] = useState();
  const [bpm2, setBpm2] = useState();

  const handleCalculate = (event) => {
    event.preventDefault();

    // Send a POST request to your Flask API
    fetch('/api/get-pivot-bpm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the BPM values in the request body as JSON
      body: JSON.stringify({
        track_1_bpm: parseFloat(bpm1),
        track_2_bpm: parseFloat(bpm2),
      }),
    })
      .then((response) => {
        return response.json(); // This returns a promise with the JSON data
      })
      // Now, work with the actual data
      .then((data) => {
        setCombinedBpm(data.combined_bpm);
      });
  };

  return (
    <MantineProvider defaultColorScheme="dark">
      <>
        <h1>Pivot BPM Calculator</h1>
        <form>
          <div style={{ marginBottom: '10px' }}>
            <label>Track 1 BPM: </label>
            <input
              type="number"
              value={bpm1}
              onChange={(e) => setBpm1(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Track 2 BPM: </label>
            <input
              type="number"
              value={bpm2}
              onChange={(e) => setBpm2(e.target.value)}
              required
            />
          </div>
          <button onClick={handleCalculate} type="submit">
            Submit
          </button>
        </form>
        <div>
          <p> This is the combined bpm: {combinedBpm} </p>
        </div>
        <LibraryUploader></LibraryUploader>
      </>
    </MantineProvider>
  );
}

export default App;
