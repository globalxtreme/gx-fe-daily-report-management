import Cookies from "js-cookie";

export function getToken(): string | undefined {
  return Cookies.get("auth_token");
}

export function logout(): void {
  Cookies.remove("auth_token");
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth/redirect`;
}

export function redirectToLogin(): void {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth/redirect`;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
