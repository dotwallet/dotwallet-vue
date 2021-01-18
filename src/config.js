// named DOT_ENV to avoid conflicting with the client developer's NODE_ENV
export const DOTWALLET_API =
  process.env.DOT_ENV == 'dot-development'
    ? `https://staging.api.ddpurse.com/v1/`
    : `https://api.ddpurse.com/v1/`;
export const DOTWALLET_CLIENT =
  process.env.DOT_ENV == 'dot-development'
    ? 'https://prerelease.ddpurse.com'
    : `https://ddpurse.com`;
export const YOUR_SERVER_URL = 'http://192.168.1.112:3333/';
export const YOUR_PAGE_URL = 'http://0.0.0.0:8080/';
export const DEV_WALLET_ADDRESS = '1L4eTJidJjVajv4caJkmQyTFRXBnoN4Pap';
