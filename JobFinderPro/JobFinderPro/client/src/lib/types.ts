import { User, WorkerProfile } from "@shared/schema";

// Combine User and WorkerProfile with distance
export interface WorkerWithProfile extends User {
  workerProfile: WorkerProfile;
  distance?: number;
}

// Add distance to Market type
export interface MarketWithDistance extends Market {
  distance?: number;
}

// Location type
export interface Location {
  latitude: number;
  longitude: number;
}

// User credentials for login
export interface UserCredentials {
  username: string;
  password: string;
}

// Review with user details
export interface ReviewWithUser extends Review {
  user: {
    name: string;
    profilePicture?: string;
  };
}
