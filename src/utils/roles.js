export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  USER: 'user',
}

export const hasAnyRole = (role, allowed = []) => allowed.includes(role)
