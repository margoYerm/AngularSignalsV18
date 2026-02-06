export interface User {
  id: number;
  email: string;
  password?: string; // just on the server, not sent to the client
  pictureUrl?: string;
}