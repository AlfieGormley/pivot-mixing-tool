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
      setUploadMessage(`Successfully processed ${payload} tracks.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {uploadMessage && (
        <Alert
          withCloseButton
          onClose={() => setUploadMessage('')}
          icon={<IconCheck size={16} />}
          color="green"
        >
          {uploadMessage}
        </Alert>
      )}

      {error && (
        <Alert
          withCloseButton
          onClose={() => setError(null)}
          icon={<IconX size={16} />}
          color="red"
        >
          {error}
        </Alert>
      )}
      <Group style={{ marginTop: 50, justifyContent: 'center' }}>
        <FileInput
          style={{ width: 220 }}
          placeholder="Select Rekordbox XML Export"
          styles={{
            placeholder: {
              color: '#fff',
            },
          }}
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
          styles={{
            label: {
              color: '#fff', // or any color you want
            },
          }}
        >
          Upload and Process
        </Button>
      </Group>
    </>
  );
};

export default LibraryUploader;
