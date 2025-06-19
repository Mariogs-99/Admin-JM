export const getUserRole = (): string | null => {
  return localStorage.getItem("role");
};

export const isAdmin = (): boolean => {
  return getUserRole() === "ADMIN";
};

export const isUser = (): boolean => {
  return getUserRole() === "USER";
};
