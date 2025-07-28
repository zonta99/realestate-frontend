// src/app/core/auth/services/token-storage.service.ts
import { Injectable } from '@angular/core';
import { AuthTokens } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly TOKEN_KEY = 'auth_tokens';

  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify({
      ...tokens,
      expiresAt: tokens.expiresAt.toISOString()
    }));
  }

  getTokens(): AuthTokens | null {
    try {
      const stored = localStorage.getItem(this.TOKEN_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        expiresAt: new Date(parsed.expiresAt)
      };
    } catch {
      return null;
    }
  }

  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.accessToken || null;
  }

  isTokenValid(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return false;
    return new Date() < tokens.expiresAt;
  }
}
