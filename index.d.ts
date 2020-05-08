declare namespace Express {
  export interface EverseUser {
    id: number;
    name: string;
    email: string;
    developer: Boolean;
    verified: Boolean;
    disabled: Boolean;
    email_id?: number;
    icon: string | undefined;
  }

  export interface Request {
     user?: EverseUser
  }
}