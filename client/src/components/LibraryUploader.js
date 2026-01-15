import React, { useState } from 'react';
import { FileInput, Button, Group, Alert } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { uploadRekordboxXml } from '../api/apiService';

const LibraryUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [error, setError] = useState(null);
  const [trackData, setTrackData] = useState([]);

  const handleUpload = async () => {
    setIsLoading(true);
    setError(null);
    setUploadMessage('');
    setTrackData([]);

    try {
      const payload = await uploadRekordboxXml(selectedFile);
      setTrackData(payload);
      setUploadMessage(`Successfully processed ${payload.length} tracks.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Group>
        <FileInput
          style={{ width: 220 }}
          placeholder="Select Rekordbox XML Export"
          accept=".xml"
          radius=""
          value={selectedFile}
          onChange={setSelectedFile}
          clearable
        />

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          loading={isLoading}
          style={{ alignSelf: 'flex-end' }}
        >
          Upload and Process
        </Button>
      </Group>

      {uploadMessage && (
        <Alert
          withCloseButton
          onClose={() => setUploadMessage('')}
          mt="md"
          icon={<IconCheck size={16} />}
          color="green"
          title="Success!"
        >
          {uploadMessage}
        </Alert>
      )}

      {error && (
        <Alert
          withCloseButton
          onClose={() => setError(null)}
          mt="md"
          icon={<IconX size={16} />}
          color="red"
          title="An Error Occurred"
        >
          {error}
        </Alert>
      )}
      {trackData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Processed Tracks:</h3>
          <pre>{JSON.stringify(trackData.slice(0, 5), null, 2)}</pre>
          <p>...and {trackData.length - 5} more.</p>
        </div>
      )}
    </>
  );
};

export default LibraryUploader;
