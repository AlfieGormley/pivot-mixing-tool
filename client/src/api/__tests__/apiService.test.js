import { getPivotBpm, getTracksByBpm, uploadRekordboxXml } from '../apiService';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe('getPivotBpm', () => {
  it('returns payload on success', async () => {
    const expected_payload = { ratio: '4:3', pivot_bpm: 128 };

    fetch.mockResponseOnce(
      JSON.stringify({
        status: 'success',
        payload: expected_payload,
      })
    );

    const actual_payload = await getPivotBpm(120, 130);

    expect(actual_payload).toEqual(expected_payload);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/get-pivot-bpm'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin_bpm: 120, destination_bpm: 130 }),
      })
    );
  });

  it('throws error on backend error status', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        status: 'error',
        error: 'BPM values must be valid positive numbers.',
      }),
      { status: 400 }
    );

    await expect(getPivotBpm(0, 130)).rejects.toThrow(
      'BPM values must be valid positive numbers.'
    );
  });

  it('throws error on invalid response', async () => {
    fetch.mockResponseOnce('not json data', { status: 200 });

    await expect(getPivotBpm(120, 130)).rejects.toThrow();
  });

  it('throws error on rejection', async () => {
    fetch.mockRejectOnce(new Error());

    await expect(getPivotBpm(120, 130)).rejects.toThrow();
  });
});

describe('getTracksByBpm', () => {
  it('returns payload on success', async () => {
    const expected_payload = [
      {
        TrackID: '250763947',
        Name: 'Amber (Original Mix)',
        Artist: 'Geode',
        BPM: '109.00',
        Key: 'Ebm',
        PlaylistPath: 'Dubstep/Deep',
      },
      {
        TrackID: '243820178',
        Name: 'Dundas - Jafu',
        Artist: 'Deep Heads',
        BPM: '106.00',
        Key: 'Em',
        PlaylistPath: 'Dubstep/Deep',
      },
      {
        TrackID: '215490139',
        Name: 'Somnium',
        Artist: 'Congi',
        BPM: '107.00',
        Key: 'Bm',
        PlaylistPath: 'Dubstep/Deep',
      },
    ];
    fetch.mockResponseOnce(
      JSON.stringify({
        status: 'success',
        payload: expected_payload,
      })
    );

    const actual_payload = await getTracksByBpm(107, 2);

    expect(actual_payload).toEqual(expected_payload);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/tracks/by-bpm'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_bpm: 107, range: 2 }),
      })
    );
  });

  it('throws error on backend error status', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        status: 'error',
        error: 'BPM and range values must be valid positive numbers.',
      }),
      { status: 400 }
    );

    await expect(getTracksByBpm(-1, 2)).rejects.toThrow(
      'BPM and range values must be valid positive numbers.'
    );
  });

  it('throws error on invalid response', async () => {
    fetch.mockResponseOnce('not json data', { status: 200 });

    await expect(getTracksByBpm(128, 2)).rejects.toThrow();
  });

  it('throws error on rejection', async () => {
    fetch.mockRejectOnce(new Error());

    await expect(getTracksByBpm(128, 2)).rejects.toThrow();
  });
});

describe('uploadRekordboxXml', () => {
  it('returns track count on success', async () => {
    const expected_payload = 7;
    fetch.mockResponseOnce(
      JSON.stringify({
        status: 'success',
        payload: expected_payload,
      })
    );

    const file = new File(['dummy content'], 'test.xml', { type: 'text/xml' });

    const actual_payload = await uploadRekordboxXml(file);

    expect(actual_payload).toBe(expected_payload);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/upload-xml'),
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );
  });

  it('throws error on backend error status', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        status: 'error',
        error: 'No file selected for upload.',
      }),
      { status: 400 }
    );

    const file = new File([''], 'file content', { type: 'text/xml' });

    await expect(uploadRekordboxXml(file)).rejects.toThrow(
      'No file selected for upload.'
    );
  });

  it('throws error on invalid response', async () => {
    fetch.mockResponseOnce('not json data', { status: 200 });

    const file = new File(['dummy content'], 'test.xml', { type: 'text/xml' });

    await expect(uploadRekordboxXml(file)).rejects.toThrow();
  });

  it('throws error on rejection', async () => {
    fetch.mockRejectOnce(new Error());

    const file = new File(['dummy content'], 'test.xml', { type: 'text/xml' });

    await expect(uploadRekordboxXml(file)).rejects.toThrow();
  });
});
