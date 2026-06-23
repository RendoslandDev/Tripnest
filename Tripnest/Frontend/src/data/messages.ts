import type { ChatMessage, Conversation } from '../types';

export const conversations: Conversation[] = [
  { id: 1, name: 'Kwame Mensah', role: 'Agent', lastMessage: 'Hi Kofi, the viewing is confirmed for tomorrow.', time: '2m', unread: 2 },
  { id: 2, name: 'Nana Adwoa', role: 'Caretaker', lastMessage: 'Maintenance update: the plumber is on the way.', time: '1h', unread: 0 },
  { id: 3, name: 'TripNest Support', role: 'Support', lastMessage: 'Your payment was received successfully.', time: '3h', unread: 0 },
  { id: 4, name: 'Yaw Boateng', role: 'Agent', lastMessage: 'Let me know if you have any other questions.', time: '1d', unread: 0 },
];

export const messagesByConversation: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, fromMe: false, text: 'Hello Kofi! Thanks for your interest in the 2 Bedroom Apartment.', time: '09:01' },
    { id: 2, fromMe: true, text: 'Hi Kwame, is it still available for May?', time: '09:03' },
    { id: 3, fromMe: false, text: 'Yes it is. Would you like to schedule a viewing?', time: '09:04' },
    { id: 4, fromMe: true, text: 'That would be great. Tomorrow afternoon?', time: '09:06' },
    { id: 5, fromMe: false, text: 'Hi Kofi, the viewing is confirmed for tomorrow.', time: '09:10' },
  ],
  2: [
    { id: 1, fromMe: false, text: 'Maintenance update: the plumber is on the way.', time: '08:30' },
  ],
  3: [
    { id: 1, fromMe: false, text: 'Your payment was received successfully.', time: 'Yesterday' },
  ],
  4: [
    { id: 1, fromMe: false, text: 'Let me know if you have any other questions.', time: 'Mon' },
  ],
};
