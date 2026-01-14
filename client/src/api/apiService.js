const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Uploads the Rekordbox XML file to the backend.
 * @param {File} file - The file object selected by the user.
 * @returns {Promise<object>} A promise that resolves to the JSON response from the backend.
 */
export const uploadRekordboxXml = async (file) => {
  const formData = new FormData();
  formData.append('rekordbox_xml', file);

  const response = await fetch(`${API_BASE_URL}/upload-xml`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.error || `HTTP error! Status: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
};
