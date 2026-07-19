import React from 'react';

import { DateField } from './DatePicker/DateField';
import { LimitedTextField } from './Input/LimitedTextField';
import { TextField } from './Input/TextField';
import { SelectionField } from './Selection/SelectionField';
import type { ElementFieldPropsType } from './type';

const fieldComponentMap: Record<
  ElementFieldPropsType['type'],
  React.FunctionComponent
> = {
  text: TextField,
  'text-limited': LimitedTextField,
  date: DateField,
  selection: SelectionField,
};

export function getComponent(
  type: ElementFieldPropsType['type'],
): React.FunctionComponent {
  return fieldComponentMap[type];
}
