import type { HttpClient } from "./http.ts";

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  clientSecret?: string;
  scope?: string;
  usePkce?: boolean;
}

interface OAuthAuth {
  getAuthUrl: (baseUrl: string) => Promise<{ url: string; state: string }>;
  exchangeCode: (
    code: string,
    state?: string,
  ) => Promise<{ accessToken: string; refreshToken?: string }>;
  getToken: () => Promise<string>;
  setTokens: (accessToken: string, refreshToken?: string, expiresIn?: number) => void;
  revoke: () => void;
}

export function createOAuthAuth(
  client: HttpClient,
  config: OAuthConfig,
): OAuthAuth {
  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  let expiresAt: number | null = null;
  let codeVerifier: string | null = null;
  let state: string | null = null;

  const generateRandom = (len: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => chars[b % chars.length]).join("");
  };

  const base64UrlEncode = (buffer: Uint8Array) => {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  };

  const isValid = () => accessToken && (!expiresAt || Date.now() < expiresAt);

  const refreshAccess = async () => {
    if (!refreshToken) throw new Error("No refresh token available");

    const payload: Record<string, string> = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: config.clientId,
    };
    if (config.clientSecret) payload.client_secret = config.clientSecret;

    const response = await client.post("/userapiauthservice/oauth2/token", payload) as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
    };

    accessToken = response.access_token;
    if (response.refresh_token) refreshToken = response.refresh_token;
    if (response.expires_in) expiresAt = Date.now() + (response.expires_in - 60) * 1000;
    if (accessToken) client.setAuthHeader(accessToken);
  };

  return {
    getAuthUrl: async (baseUrl: string) => {
      state = generateRandom(32);
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        state,
      });

      if (config.scope) params.append("scope", config.scope);

      if (config.usePkce ?? true) {
        codeVerifier = generateRandom(64);
        const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
        const challenge = base64UrlEncode(new Uint8Array(hash));
        params.append("code_challenge", challenge);
        params.append("code_challenge_method", "S256");
      }

      return {
        url: `${baseUrl.replace(/\/$/, "")}/userapiauthservice/oauth2/authorize?${params}`,
        state,
      };
    },

    exchangeCode: async (code: string, providedState?: string) => {
      if (providedState && providedState !== state) {
        throw new Error("State mismatch - possible CSRF attack");
      }

      const payload: Record<string, string> = {
        grant_type: "authorization_code",
        code,
        redirect_uri: config.redirectUri,
        client_id: config.clientId,
      };

      if (config.clientSecret) payload.client_secret = config.clientSecret;
      if (codeVerifier) payload.code_verifier = codeVerifier;

      const response = await client.post("/userapiauthservice/oauth2/token", payload) as {
        access_token: string;
        refresh_token?: string;
        expires_in?: number;
      };

      accessToken = response.access_token;
      refreshToken = response.refresh_token ?? null;
      if (response.expires_in) expiresAt = Date.now() + (response.expires_in - 60) * 1000;
      if (accessToken) client.setAuthHeader(accessToken);

      return {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      };
    },

    getToken: async () => {
      if (!isValid()) {
        if (refreshToken) await refreshAccess();
        else throw new Error("No valid token. Complete OAuth flow first.");
      }
      return accessToken ?? "";
    },

    setTokens: (token: string, refresh?: string, expiresIn?: number) => {
      accessToken = token;
      refreshToken = refresh ?? null;
      if (expiresIn) expiresAt = Date.now() + (expiresIn - 60) * 1000;
    },

    revoke: () => {
      accessToken = null;
      refreshToken = null;
      expiresAt = null;
      client.removeAuthHeader();
    },
  };
}

