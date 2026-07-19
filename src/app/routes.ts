/**
 * All navigation types live here — app/ owns navigation, modules own screens
 * (TECH_SPEC §4 ownership decisions).
 */
export const Routes = {
  Login: 'Login',
  InvoiceList: 'InvoiceList',
  CreateInvoice: 'CreateInvoice',
} as const;

export type AuthStackParamList = {
  [Routes.Login]: undefined;
};

export type MainStackParamList = {
  [Routes.InvoiceList]: undefined;
  [Routes.CreateInvoice]: undefined;
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
