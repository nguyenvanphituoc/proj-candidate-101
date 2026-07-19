/**
 * All navigation types live here — app/ owns navigation, modules own screens
 * (TECH_SPEC §4 ownership decisions).
 */
import type { InvoiceDetailParams } from '@/modules/invoice';

export const Routes = {
  Login: 'Login',
  InvoiceList: 'InvoiceList',
  CreateInvoice: 'CreateInvoice',
  InvoiceDetail: 'InvoiceDetail',
} as const;

export type AuthStackParamList = {
  [Routes.Login]: undefined;
};

export type MainStackParamList = {
  [Routes.InvoiceList]: undefined;
  [Routes.CreateInvoice]: undefined;
  [Routes.InvoiceDetail]: InvoiceDetailParams;
};

/**
 * Global registration so module screens get typed `useNavigation()` without
 * importing app/ — keeps the module → app dependency surface at zero for
 * navigation.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends AuthStackParamList, MainStackParamList {}
  }
}
