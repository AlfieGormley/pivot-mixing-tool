import React from 'react';

function BpmTile({ bpm, ratio }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 112,
        height: 112,
        background: '#242424',
        border: '1.5px solid #fff',
        borderRadius: 12,
      }}
    >
      <div
        style={{
          color: '#fff',
          fontWeight: 700,
          fontSize: 28,
          lineHeight: 1.1,
        }}
      >
        {bpm}
      </div>
      <div
        style={{
          color: '#fff',
          fontSize: 15,
          opacity: 0.7,
          marginTop: 6,
        }}
      >
        Ratio: {ratio}
      </div>
    </div>
  );
}

export default BpmTile;
