import '@mantine/core/styles.css';
import React, { useState } from 'react';
import { MantineProvider } from '@mantine/core';
import LibraryUploader from './components/LibraryUploader';
import PivotCalculator from './components/PivotCalculator';

function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <PivotCalculator></PivotCalculator>
      <LibraryUploader></LibraryUploader>
    </MantineProvider>
  );
}

export default App;
