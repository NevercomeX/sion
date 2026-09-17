import { UserProfile, InviteToken, UserRole } from "../types";

const USERS_STORAGE_KEY = "rs_v2_users";
const PASSWORDS_STORAGE_KEY = "rs_v2_user_passwords";
const SESSION_STORAGE_KEY = "rs_v2_user_session";
const INVITES_STORAGE_KEY = "rs_v2_invite_tokens";

// Seed default users
const SEED_USERS: UserProfile[] = [
  {
    id: "usr_admin_01",
    name: "Administrador General",
    email: "admin@rocadesion.org",
    phone: "+58 412 1234567",
    role: "admin",
    status: "active",
    avatarColor: "#0f513f",
    assignedGroup: "Liderazgo Central",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: "usr_leader_01",
    name: "Líder Carlos Mendoza",
    email: "lider@rocadesion.org",
    phone: "+58 414 9876543",
    role: "leader",
    status: "active",
    avatarColor: "#176b55",
    assignedGroup: "Grupo Pequeño Esperanza",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: "usr_collector_01",
    name: "Encuestadora María Gómez",
    email: "encuestador@rocadesion.org",
    phone: "+58 416 5554433",
    role: "collector",
    status: "active",
    avatarColor: "#2b8a6e",
    assignedGroup: "Grupo Pequeño Fe",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
];

const SEED_PASSWORDS: Record<string, string> = {
  "admin@rocadesion.org": "admin123",
  "lider@rocadesion.org": "lider123",
  "encuestador@rocadesion.org": "user123",
};

const SEED_INVITES: InviteToken[] = [
  {
    code: "RS_INVITE_2026",
    role: "collector",
    assignedGroup: "Grupo Pequeño General",
    createdByName: "Administrador General",
    createdAt: new Date().toISOString(),
    active: true,
    usedCount: 0,
  },
  {
    code: "LIDER_GP_2026",
    role: "leader",
    assignedGroup: "Grupo Pequeño Nuevas Vidas",
    createdByName: "Administrador General",
    createdAt: new Date().toISOString(),
    active: true,
    usedCount: 0,
  },
];

// Helper to initialize local storage databases
function initializeStore() {
  if (typeof window === "undefined") return;

  try {
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(PASSWORDS_STORAGE_KEY)) {
      localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(SEED_PASSWORDS));
    }
    if (!localStorage.getItem(INVITES_STORAGE_KEY)) {
      localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(SEED_INVITES));
    }
  } catch (err) {
    console.error("Error initializing auth store:", err);
  }
}

// Get registered users list
export function fetchUsers(): UserProfile[] {
  initializeStore();
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : SEED_USERS;
  } catch (err) {
    console.error("Error fetching users:", err);
    return SEED_USERS;
  }
}

// Get active session user
export function getLoggedInUser(): UserProfile | null {
  initializeStore();
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const sessionUser: UserProfile = JSON.parse(raw);
    const users = fetchUsers();
    const current = users.find((u) => u.id === sessionUser.id || u.email.toLowerCase() === sessionUser.email.toLowerCase());
    return current || sessionUser;
  } catch (err) {
    console.error("Error fetching active session:", err);
    return null;
  }
}

// Save active user session
export function setLoggedInUser(user: UserProfile | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (err) {
    console.error("Error setting active session:", err);
  }
}

// Authenticate user with email and password
export async function loginWithEmailPassword(
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  initializeStore();
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: "Por favor complete el correo y la contraseña." };
  }

  const users = fetchUsers();
  const targetUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!targetUser) {
    return { success: false, error: "Usuario no encontrado." };
  }

  if (targetUser.status === "inactive") {
    return { success: false, error: "Esta cuenta se encuentra desactivada. Contacte al administrador." };
  }

  let passMap: Record<string, string> = SEED_PASSWORDS;
  if (typeof window !== "undefined") {
    try {
      const rawPass = localStorage.getItem(PASSWORDS_STORAGE_KEY);
      if (rawPass) passMap = JSON.parse(rawPass);
    } catch (err) {
      console.error("Error reading password store:", err);
    }
  }

  const expectedPassword = passMap[cleanEmail] || "admin123";
  if (cleanPass !== expectedPassword) {
    return { success: false, error: "Contraseña incorrecta." };
  }

  // Update last login timestamp
  const updatedUser: UserProfile = {
    ...targetUser,
    lastLogin: new Date().toISOString(),
  };

  saveUserRecord(updatedUser);
  setLoggedInUser(updatedUser);

  return { success: true, user: updatedUser };
}

// Logout
export function logoutUser() {
  setLoggedInUser(null);
}

// Update profile details for current user
export function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): { success: boolean; user?: UserProfile; error?: string } {
  const users = fetchUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return { success: false, error: "Usuario no encontrado." };

  const updated = { ...users[idx], ...updates };
  users[idx] = updated;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (err) {
      console.error("Error writing users store:", err);
    }
  }

  const current = getLoggedInUser();
  if (current && current.id === userId) {
    setLoggedInUser(updated);
  }

  return { success: true, user: updated };
}

// Change password
export function changeUserPassword(
  email: string,
  currentPass: string,
  newPass: string
): { success: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  let passMap: Record<string, string> = SEED_PASSWORDS;

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(PASSWORDS_STORAGE_KEY);
      if (raw) passMap = JSON.parse(raw);
    } catch (err) {
      console.error("Error reading passwords:", err);
    }
  }

  const current = passMap[cleanEmail] || "admin123";
  if (currentPass !== current) {
    return { success: false, error: "La contraseña actual no es correcta." };
  }

  passMap[cleanEmail] = newPass.trim();

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(passMap));
    } catch (err) {
      console.error("Error writing passwords:", err);
    }
  }

  return { success: true };
}

// Internal helper to save a user record
function saveUserRecord(user: UserProfile) {
  const users = fetchUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (err) {
      console.error("Error saving user:", err);
    }
  }
}

// Invite Tokens Management
export function fetchInviteTokens(): InviteToken[] {
  initializeStore();
  if (typeof window === "undefined") return SEED_INVITES;
  try {
    const raw = localStorage.getItem(INVITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : SEED_INVITES;
  } catch (err) {
    console.error("Error fetching invite tokens:", err);
    return SEED_INVITES;
  }
}

export function validateInviteToken(code: string): InviteToken | null {
  const tokens = fetchInviteTokens();
  const cleanCode = code.trim().toUpperCase();
  const found = tokens.find((t) => t.code.toUpperCase() === cleanCode && t.active);
  return found || null;
}

export function createInviteToken(
  role: UserRole = "collector",
  assignedGroup: string = "Grupo Pequeño",
  creatorName: string = "Administrador"
): InviteToken {
  const tokens = fetchInviteTokens();
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  const newCode = `RS_INVITE_${randomSuffix}`;

  const newToken: InviteToken = {
    code: newCode,
    role,
    assignedGroup,
    createdByName: creatorName,
    createdAt: new Date().toISOString(),
    active: true,
    usedCount: 0,
  };

  tokens.unshift(newToken);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(tokens));
    } catch (err) {
      console.error("Error creating invite token:", err);
    }
  }

  return newToken;
}

export function toggleInviteTokenStatus(code: string): boolean {
  const tokens = fetchInviteTokens();
  const idx = tokens.findIndex((t) => t.code === code);
  if (idx < 0) return false;

  tokens[idx].active = !tokens[idx].active;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(tokens));
    } catch (err) {
      console.error("Error toggling invite token:", err);
    }
  }
  return true;
}

// Register user using an authorized invite link
export async function registerWithInviteToken(
  code: string,
  name: string,
  email: string,
  password: string,
  phone: string = ""
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const token = validateInviteToken(code);
  if (!token) {
    return { success: false, error: "El código de invitación no es válido o ha caducado." };
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = fetchUsers();
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: "El correo electrónico ya está registrado." };
  }

  const newUser: UserProfile = {
    id: `usr_${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    phone: phone.trim(),
    role: token.role,
    status: "active",
    assignedGroup: token.assignedGroup || "Grupo Pequeño",
    avatarColor: "#0f513f",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  // Save new user
  saveUserRecord(newUser);

  // Save user password
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(PASSWORDS_STORAGE_KEY);
      const passMap: Record<string, string> = raw ? JSON.parse(raw) : {};
      passMap[cleanEmail] = password.trim();
      localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(passMap));
    } catch (err) {
      console.error("Error saving user password:", err);
    }
  }

  // Increment invite token usage
  const tokens = fetchInviteTokens();
  const tIdx = tokens.findIndex((t) => t.code === token.code);
  if (tIdx >= 0) {
    tokens[tIdx].usedCount = (tokens[tIdx].usedCount || 0) + 1;
    if (typeof window !== "undefined") {
      localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(tokens));
    }
  }

  // Set active session
  setLoggedInUser(newUser);

  return { success: true, user: newUser };
}

// Admin: Create or Edit User
export function adminSaveUser(
  user: UserProfile,
  newPassword?: string
): { success: boolean; error?: string } {
  saveUserRecord(user);

  if (newPassword && newPassword.trim()) {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(PASSWORDS_STORAGE_KEY);
        const passMap: Record<string, string> = raw ? JSON.parse(raw) : {};
        passMap[user.email.toLowerCase()] = newPassword.trim();
        localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(passMap));
      } catch (err) {
        console.error("Error updating user password:", err);
      }
    }
  }

  return { success: true };
}

// Admin: Delete User
export function adminDeleteUser(userId: string): boolean {
  const users = fetchUsers();
  const filtered = users.filter((u) => u.id !== userId);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }
  return true;
}
