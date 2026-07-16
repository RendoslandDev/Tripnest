import type { Statement } from '../types';

// Mock monthly payout statements. Swap for API data later.
export const statements: Statement[] = [
  {
    id: '1',
    month: 'August 2025',
    period: 'Aug 1 – Aug 31',
    grossRevenue: 4860,
    managementFee: 972,
    netPayout: 3888,
    status: 'pending',
  },
  {
    id: '2',
    month: 'July 2025',
    period: 'Jul 1 – Jul 31',
    grossRevenue: 5210,
    managementFee: 1042,
    netPayout: 4168,
    status: 'paid',
  },
  {
    id: '3',
    month: 'June 2025',
    period: 'Jun 1 – Jun 30',
    grossRevenue: 3920,
    managementFee: 784,
    netPayout: 3136,
    status: 'paid',
  },
  {
    id: '4',
    month: 'May 2025',
    period: 'May 1 – May 31',
    grossRevenue: 4475,
    managementFee: 895,
    netPayout: 3580,
    status: 'paid',
  },
];
