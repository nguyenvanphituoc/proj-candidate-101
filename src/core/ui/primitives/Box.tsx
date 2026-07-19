import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { spacing, SpacingToken } from '../theme/tokens';

interface BoxProps extends ViewProps {
  row?: boolean;
  gap?: SpacingToken;
  padding?: SpacingToken;
  flex?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
}

export function Box({
  row = false,
  gap,
  padding,
  flex,
  align,
  justify,
  style,
  ...rest
}: BoxProps) {
  return (
    <View
      style={[
        {
          flexDirection: row ? 'row' : 'column',
          gap: gap ? spacing[gap] : undefined,
          padding: padding ? spacing[padding] : undefined,
          flex,
          alignItems: align,
          justifyContent: justify,
        },
        style,
      ]}
      {...rest}
    />
  );
}
