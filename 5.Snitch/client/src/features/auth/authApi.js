import api from "../../lib/api";

function getUserFromResponse(response, operation) {
  const payload = response.data;

  if (operation === "login") {
    return {
      user: {
        id: payload.data.user,
        name: payload.data.name,
        email: payload.data.email,
        role: payload.data.role,
      },
      accessToken: payload.data.accesToken,
    };
  }

  const user = operation === "refresh" ? payload.data.user : payload.user;
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken: user.accesToken || user.accessToken,
  };
}

export async function login(credentials) {
  const response = await api.post("/auth/login", credentials);
  return getUserFromResponse(response, "login");
}

export async function register(details) {
  const response = await api.post("/auth/register", details);
  return getUserFromResponse(response, "register");
}

export async function refreshSession() {
  const response = await api.get("/auth/refresh");
  return getUserFromResponse(response, "refresh");
}

export async function fetchCurrentUser(accessToken) {
  const response = await api.get("/auth/getme", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.user;
}

export async function logout() {
  await api.post("/auth/logout");
}
