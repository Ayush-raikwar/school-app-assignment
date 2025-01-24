import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from './src/navigation/routes';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Routes/>
  );
};

export default App;
