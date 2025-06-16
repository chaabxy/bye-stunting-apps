export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  credentials: LoginCredentials;
  error: string;
  isLoading: boolean;
}

export class AuthModel {
  private static readonly ADMIN_EMAIL = "admin@byestunting.id";
  private static readonly ADMIN_PASSWORD = "admin123";
  private static readonly STORAGE_KEY = "adminLoggedIn";

  static validateCredentials(credentials: LoginCredentials): boolean {
    return (
      credentials.email === this.ADMIN_EMAIL &&
      credentials.password === this.ADMIN_PASSWORD
    );
  }

  static setAuthToken(): void {
    localStorage.setItem(this.STORAGE_KEY, "true");
  }

  static getAuthToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  static removeAuthToken(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static isAuthenticated(): boolean {
    return this.getAuthToken() === "true";
  }
}
