import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList, Routes } from '../routes';
import InvoiceListScreen from './index';
import CreateInvoiceScreen from './create-invoice';
import InvoiceDetailScreen from './invoice-detail';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName={Routes.InvoiceList}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={Routes.InvoiceList} component={InvoiceListScreen} />
      <Stack.Screen name={Routes.CreateInvoice} component={CreateInvoiceScreen} />
      <Stack.Screen name={Routes.InvoiceDetail} component={InvoiceDetailScreen} />
    </Stack.Navigator>
  );
}
