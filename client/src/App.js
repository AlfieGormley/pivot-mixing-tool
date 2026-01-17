import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider } from '@mantine/core';
import LibraryUploader from './components/LibraryUploader';
import PivotCalculator from './components/PivotCalculator';

function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <LibraryUploader></LibraryUploader>
      <PivotCalculator></PivotCalculator>
    </MantineProvider>
  );
}

export default App;
