import React from 'react';
import { AppText, Box, colors, radius } from '@core/ui';

import type { InvoiceStatus } from '../../domain/schemas/invoice';

const STATUS_COLORS: Record<InvoiceStatus, { fg: string; bg: string }> = {
  Paid: { fg: colors.success, bg: colors.successSurface },
  Pending: { fg: colors.warning, bg: colors.warningSurface },
  Overdue: { fg: colors.danger, bg: colors.dangerSurface },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const palette = STATUS_COLORS[status];
  return (
    <Box
      style={{
        backgroundColor: palette.bg,
        borderRadius: radius.full,
        paddingHorizontal: 10,
        paddingVertical: 2,
      }}
    >
      <AppText
        variant="caption"
        color={palette.fg}
        style={{ fontSize: 12, fontWeight: '600' }}
      >
        {status}
      </AppText>
    </Box>
  );
}
