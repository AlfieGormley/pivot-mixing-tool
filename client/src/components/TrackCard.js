import React from 'react';
import { Badge, Divider, Group } from '@mantine/core';

function TrackCard({ track }) {
  const placeholderImg = `https://picsum.photos/seed/${track.TrackID}/80`;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: 12,
        padding: 12,
        minWidth: 360,
        maxWidth: 480,
      }}
    >
      <img
        src={placeholderImg}
        alt="Artwork"
        style={{
          width: 80,
          height: 80,
          borderRadius: 8,
          marginRight: 16,
        }}
      />
      <div>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#111' }}>
          {track.Name}
        </div>
        <div style={{ color: '#444', fontSize: 14 }}>{track.Artist}</div>
        <Divider color="#d1cdcdff" style={{ margin: '8px 0' }} />
        <Group
          mt={8}
          justify="center"
          spacing="calc(1.7rem * var(--mantine-scale))"
        >
          <Badge color="blue" variant="filled">
            {track.BPM} BPM
          </Badge>
          <Badge color="green" variant="filled">
            {track.Key}
          </Badge>
          <Badge color="purple" variant="filled">
            {track.PlaylistPath}
          </Badge>
        </Group>
      </div>
    </div>
  );
}

export default TrackCard;
