/**
 * Interface User correspondant à UserResponse du back-end.
 * Le mot de passe n'est jamais exposé côté front-end pour des raisons de sécurité.
 */
export interface User {
  id: number;
  email: string;
  prenom: string;
  nom: string;
}
