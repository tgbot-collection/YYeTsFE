import Cookies from "js-cookie";

export function logout() {
  Cookies.remove("username");
  localStorage.removeItem("username");
}
