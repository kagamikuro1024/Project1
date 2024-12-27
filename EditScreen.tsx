// import React from 'react';
import { PaperProvider } from 'react-native-paper';
import MainScreen from './Mainscreen';


const EditScreen = () => {
  return (
    <PaperProvider>
      <MainScreen />
    </PaperProvider>
  );
};

export default EditScreen;