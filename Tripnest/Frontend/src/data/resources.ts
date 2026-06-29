import type { Resource } from '../types';

// Mock host resources: guides, policies, templates and videos. Swap for API later.
export const resources: Resource[] = [
  {
    id: 'r1',
    title: 'Hosting starter guide',
    description: 'Everything you need to set up your first listing and take great bookings.',
    category: 'guide',
    format: '8 min read',
    url: '#',
  },
  {
    id: 'r2',
    title: 'Pricing your listing',
    description: 'How to set base, weekend and seasonal rates that stay competitive.',
    category: 'guide',
    format: '6 min read',
    url: '#',
  },
  {
    id: 'r3',
    title: 'House rules template',
    description: 'A ready-to-edit set of house rules you can attach to any listing.',
    category: 'template',
    format: 'DOCX',
    url: '#',
  },
  {
    id: 'r4',
    title: 'Guest welcome letter',
    description: 'Editable check-in instructions and local recommendations template.',
    category: 'template',
    format: 'PDF',
    url: '#',
  },
  {
    id: 'r5',
    title: 'Cancellation & refund policy',
    description: 'Official TripNest policy covering cancellations, refunds and disputes.',
    category: 'policy',
    format: 'Policy',
    url: '#',
  },
  {
    id: 'r6',
    title: 'Host safety standards',
    description: 'Required safety equipment and inspection checklist for every property.',
    category: 'policy',
    format: 'Policy',
    url: '#',
  },
  {
    id: 'r7',
    title: 'Photographing your space',
    description: 'A short walkthrough on capturing photos that get more clicks.',
    category: 'video',
    format: '4 min video',
    url: '#',
  },
  {
    id: 'r8',
    title: 'Using the smart calendar',
    description: 'Set minimum nights, owner blocks and seasonal pricing in minutes.',
    category: 'video',
    format: '5 min video',
    url: '#',
  },
];
