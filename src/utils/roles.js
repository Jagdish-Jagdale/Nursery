export const ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  USER: 'user',
}

export const hasAnyRole = (role, allowed = []) => allowed.includes(role)
