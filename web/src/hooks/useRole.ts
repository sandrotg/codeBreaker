import { useAuth } from '../contexts/AuthContext';

// IDs de roles
export const ROLES = {
  ADMIN: 'v6bf70524-219e-4a31-a2c0-89ec507cb459',
  STUDENT: '597b2e7f-b95b-4ea3-95ff-15b61d64ce86',
} as const;

export function useRole() {
  const { user } = useAuth();

  const isAdmin = user?.roleId === ROLES.ADMIN;
  const isStudent = user?.roleId === ROLES.STUDENT;

  const canCreateChallenges = isAdmin;
  const canGenerateChallenges = isAdmin;
  const canCreateEvaluations = isAdmin;
  const canCreateCourses = isAdmin;
  const canEditChallenges = isAdmin;
  const canDeleteChallenges = isAdmin;
  const canViewCourses = true; // Tanto admin como estudiante pueden ver cursos
  const canViewAllCourses = isAdmin; // Solo admin puede ver TODOS los cursos
  const canViewEvaluations = true; // Tanto admin como estudiante pueden ver evaluaciones
  const canEditEvaluations = isAdmin; // Solo admin puede editar/activar evaluaciones

  return {
    isAdmin,
    isStudent,
    canCreateChallenges,
    canGenerateChallenges,
    canCreateEvaluations,
    canCreateCourses,
    canEditChallenges,
    canDeleteChallenges,
    canViewCourses,
    canViewAllCourses,
    canViewEvaluations,
    canEditEvaluations,
  };
}
