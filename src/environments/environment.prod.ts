// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com',
  tokenRefreshBuffer: 5 * 60 * 1000, // 5 minutes
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  features: {
    enableDevTools: false,
    enableLogging: false,
  },
  googleMaps: {
    apiKey: 'YOUR_PRODUCTION_API_KEY',
    defaultZoom: 15,
    defaultCenter: { lat: 40.7128, lng: -74.0060 }
  }
};
