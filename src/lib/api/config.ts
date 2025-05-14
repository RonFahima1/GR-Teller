export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  VERSION: 'v1',
  ENDPOINTS: {
    sender: {
      find: '/sender/find',
      create: '/sender/add',
      update: '/sender/edit',
      recentTransactions: '/transactionNew/senderRecentTransactions',
      userTransactions: '/transactionNew/getUserRecentTransactions'
    },
    recipient: {
      find: '/recipient/find',
      findWithTransactions: '/recipient/findWithTransactions',
      add: '/recipient/add',
      edit: '/recipient/edit',
      relationships: '/organization/getRecipientRelationship'
    },
    transaction: {
      create: '/transactionNew/create',
      validate: '/transaction/validate',
      confirm: '/transaction/confirm',
      exchange: '/transaction/exchange',
      clientAccount: '/clientAccount'
    }
  }
}; 