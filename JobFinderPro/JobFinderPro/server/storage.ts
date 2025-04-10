import {
  User, 
  InsertUser, 
  WorkerProfile, 
  InsertWorkerProfile,
  Job,
  InsertJob,
  Market,
  InsertMarket,
  Review,
  InsertReview
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Worker profile operations
  getWorkerProfile(userId: number): Promise<WorkerProfile | undefined>;
  createWorkerProfile(profile: InsertWorkerProfile): Promise<WorkerProfile>;
  updateWorkerProfile(userId: number, profile: Partial<WorkerProfile>): Promise<WorkerProfile | undefined>;
  
  // Job operations
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<Job>): Promise<Job | undefined>;
  getJobsByEmployer(employerId: number): Promise<Job[]>;
  getJobsByWorker(workerId: number): Promise<Job[]>;
  getJobsNearby(latitude: number, longitude: number, radius: number, category?: string): Promise<Job[]>;
  
  // Market operations
  getMarket(id: number): Promise<Market | undefined>;
  createMarket(market: InsertMarket): Promise<Market>;
  updateMarket(id: number, market: Partial<Market>): Promise<Market | undefined>;
  getMarketsNearby(latitude: number, longitude: number, radius: number, type?: string): Promise<Market[]>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByTarget(targetId: number): Promise<Review[]>;
  
  // Specialized queries
  searchWorkers(profession: string | undefined, latitude: number, longitude: number, radius: number): Promise<(User & { workerProfile: WorkerProfile })[]>;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workerProfiles: Map<number, WorkerProfile>; // Keyed by userId
  private jobs: Map<number, Job>;
  private markets: Map<number, Market>;
  private reviews: Map<number, Review>;
  
  private currentUserId: number;
  private currentWorkerProfileId: number;
  private currentJobId: number;
  private currentMarketId: number;
  private currentReviewId: number;

  constructor() {
    this.users = new Map();
    this.workerProfiles = new Map();
    this.jobs = new Map();
    this.markets = new Map();
    this.reviews = new Map();
    
    this.currentUserId = 1;
    this.currentWorkerProfileId = 1;
    this.currentJobId = 1;
    this.currentMarketId = 1;
    this.currentReviewId = 1;
    
    // Add some initial data
    this.seedData();
  }

  // USER OPERATIONS
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      rating: 0,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // WORKER PROFILE OPERATIONS
  async getWorkerProfile(userId: number): Promise<WorkerProfile | undefined> {
    return Array.from(this.workerProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createWorkerProfile(profile: InsertWorkerProfile): Promise<WorkerProfile> {
    const id = this.currentWorkerProfileId++;
    const workerProfile: WorkerProfile = { ...profile, id };
    this.workerProfiles.set(id, workerProfile);
    return workerProfile;
  }

  async updateWorkerProfile(userId: number, profileData: Partial<WorkerProfile>): Promise<WorkerProfile | undefined> {
    const profile = await this.getWorkerProfile(userId);
    if (!profile) return undefined;
    
    const updatedProfile: WorkerProfile = { ...profile, ...profileData };
    this.workerProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  // JOB OPERATIONS
  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.currentJobId++;
    const job: Job = { 
      ...insertJob, 
      id, 
      workerId: null, 
      status: "open",
      createdAt: new Date() 
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: number, jobData: Partial<Job>): Promise<Job | undefined> {
    const job = await this.getJob(id);
    if (!job) return undefined;
    
    const updatedJob: Job = { ...job, ...jobData };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async getJobsByEmployer(employerId: number): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(
      (job) => job.employerId === employerId
    );
  }

  async getJobsByWorker(workerId: number): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(
      (job) => job.workerId === workerId
    );
  }

  async getJobsNearby(latitude: number, longitude: number, radius: number, category?: string): Promise<Job[]> {
    return Array.from(this.jobs.values())
      .filter(job => {
        if (!job.location) return false;
        
        // Filter by category if provided
        if (category && job.category !== category) return false;
        
        // Filter by status (only return open jobs)
        if (job.status !== "open") return false;
        
        // Filter by distance
        const distance = calculateDistance(
          latitude, 
          longitude, 
          job.location.latitude, 
          job.location.longitude
        );
        
        return distance <= radius;
      })
      .sort((a, b) => {
        const distanceA = calculateDistance(
          latitude, 
          longitude, 
          a.location!.latitude, 
          a.location!.longitude
        );
        const distanceB = calculateDistance(
          latitude, 
          longitude, 
          b.location!.latitude, 
          b.location!.longitude
        );
        return distanceA - distanceB;
      });
  }

  // MARKET OPERATIONS
  async getMarket(id: number): Promise<Market | undefined> {
    return this.markets.get(id);
  }

  async createMarket(insertMarket: InsertMarket): Promise<Market> {
    const id = this.currentMarketId++;
    const market: Market = { ...insertMarket, id, rating: 0 };
    this.markets.set(id, market);
    return market;
  }

  async updateMarket(id: number, marketData: Partial<Market>): Promise<Market | undefined> {
    const market = await this.getMarket(id);
    if (!market) return undefined;
    
    const updatedMarket: Market = { ...market, ...marketData };
    this.markets.set(id, updatedMarket);
    return updatedMarket;
  }

  async getMarketsNearby(latitude: number, longitude: number, radius: number, type?: string): Promise<Market[]> {
    return Array.from(this.markets.values())
      .filter(market => {
        if (!market.location) return false;
        
        // Filter by type if provided
        if (type && market.type !== type) return false;
        
        // Filter by distance
        const distance = calculateDistance(
          latitude, 
          longitude, 
          market.location.latitude, 
          market.location.longitude
        );
        
        return distance <= radius;
      })
      .sort((a, b) => {
        const distanceA = calculateDistance(
          latitude, 
          longitude, 
          a.location!.latitude, 
          a.location!.longitude
        );
        const distanceB = calculateDistance(
          latitude, 
          longitude, 
          b.location!.latitude, 
          b.location!.longitude
        );
        return distanceA - distanceB;
      });
  }

  // REVIEW OPERATIONS
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = { ...insertReview, id, createdAt: new Date() };
    this.reviews.set(id, review);
    
    // Update target's rating
    const targetReviews = await this.getReviewsByTarget(insertReview.targetId);
    const totalRating = targetReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / targetReviews.length;
    
    const target = await this.getUser(insertReview.targetId);
    if (target) {
      await this.updateUser(target.id, { rating: averageRating });
    }
    
    return review;
  }

  async getReviewsByTarget(targetId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.targetId === targetId
    );
  }

  // SPECIALIZED QUERIES
  async searchWorkers(
    profession: string | undefined, 
    latitude: number, 
    longitude: number, 
    radius: number
  ): Promise<(User & { workerProfile: WorkerProfile; distance: number })[]> {
    const workers = Array.from(this.users.values()).filter(
      user => user.role === "worker" && user.location
    );
    
    const workersWithProfiles = await Promise.all(
      workers.map(async worker => {
        const workerProfile = await this.getWorkerProfile(worker.id);
        if (!workerProfile) return null;
        
        // Filter by profession if provided
        if (profession && workerProfile.profession !== profession) return null;
        
        // Calculate distance
        if (!worker.location) return null;
        const distance = calculateDistance(
          latitude,
          longitude,
          worker.location.latitude,
          worker.location.longitude
        );
        
        // Filter by radius
        if (distance > radius) return null;
        
        return { ...worker, workerProfile, distance };
      })
    );
    
    return workersWithProfiles
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance) as (User & { workerProfile: WorkerProfile; distance: number })[];
  }

  // Seed data
  private seedData() {
    // Create users
    const user1: InsertUser = {
      username: "ahmed123",
      password: "password123",
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      phone: "+911234567890",
      role: "employer",
      profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
      location: { latitude: 28.4595, longitude: 77.0266 },
      address: "Sector 15, Gurugram"
    };
    
    const user2: InsertUser = {
      username: "hamid456",
      password: "password456",
      name: "Hamid Khan",
      email: "hamid@example.com",
      phone: "+911234567891",
      role: "worker",
      profilePicture: "https://randomuser.me/api/portraits/men/2.jpg",
      location: { latitude: 28.4605, longitude: 77.0276 },
      address: "Sector 16, Gurugram"
    };
    
    const user3: InsertUser = {
      username: "raj789",
      password: "password789",
      name: "Raj Kumar",
      email: "raj@example.com",
      phone: "+911234567892",
      role: "worker",
      profilePicture: "https://randomuser.me/api/portraits/men/3.jpg",
      location: { latitude: 28.4615, longitude: 77.0286 },
      address: "Sector 17, Gurugram"
    };
    
    const user4: InsertUser = {
      username: "ananya234",
      password: "password234",
      name: "Ananya Sharma",
      email: "ananya@example.com",
      phone: "+911234567893",
      role: "employer",
      profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
      location: { latitude: 28.4625, longitude: 77.0296 },
      address: "Sector 18, Gurugram"
    };
    
    const user5: InsertUser = {
      username: "vikram567",
      password: "password567",
      name: "Vikram Malhotra",
      email: "vikram@example.com",
      phone: "+911234567894",
      role: "employer",
      profilePicture: "https://randomuser.me/api/portraits/men/4.jpg",
      location: { latitude: 28.4635, longitude: 77.0306 },
      address: "BTM Layout, Bangalore"
    };
    
    const user1Data = this.createUser(user1);
    const user2Data = this.createUser(user2);
    const user3Data = this.createUser(user3);
    const user4Data = this.createUser(user4);
    const user5Data = this.createUser(user5);
    
    // Create worker profiles
    const workerProfile1: InsertWorkerProfile = {
      userId: 2,
      profession: "Plumber",
      experience: 5,
      hourlyRate: 50000, // 500 rupees
      dailyRate: 300000, // 3000 rupees
      availability: "available",
      bio: "Experienced plumber with expertise in residential and commercial plumbing systems.",
      skills: ["Pipe Fitting", "Leak Repair", "Fixture Installation"]
    };
    
    const workerProfile2: InsertWorkerProfile = {
      userId: 3,
      profession: "Electrician",
      experience: 7,
      hourlyRate: 60000, // 600 rupees
      dailyRate: 350000, // 3500 rupees
      availability: "available",
      bio: "Certified electrician with 7 years of experience in wiring, installations, and repairs.",
      skills: ["Wiring", "Circuit Repair", "Lighting Installation"]
    };
    
    this.createWorkerProfile(workerProfile1);
    this.createWorkerProfile(workerProfile2);
    
    // Create jobs
    const job1: InsertJob = {
      title: "Bathroom Plumbing Repair",
      description: "Need to fix leaking sink and shower in apartment bathroom. Urgent work required.",
      category: "Plumbing",
      budget: 100000, // 1000 rupees
      location: { latitude: 28.4595, longitude: 77.0266 },
      address: "Sector 18, Gurugram",
      employerId: 4,
      scheduledFor: new Date(Date.now() + 86400000) // Tomorrow
    };
    
    const job2: InsertJob = {
      title: "House Painting - Two Rooms",
      description: "Looking for an experienced painter to paint two bedrooms. Light colors, materials provided.",
      category: "Painting",
      budget: 250000, // 2500 rupees
      location: { latitude: 28.4635, longitude: 77.0306 },
      address: "BTM Layout, Bangalore",
      employerId: 5,
      scheduledFor: new Date(Date.now() + 172800000) // Day after tomorrow
    };
    
    this.createJob(job1);
    this.createJob(job2);
    
    // Create markets
    const market1: InsertMarket = {
      name: "Sharma Hardware Store",
      description: "Hardware, plumbing supplies, paints, tools, electrical items",
      type: "Hardware",
      location: { latitude: 28.4645, longitude: 77.0316 },
      address: "Sector 19, Gurugram",
      phone: "+911234567895",
      items: [
        { name: "PVC Pipe (1 inch)", price: 15000 },
        { name: "Water Tap", price: 35000 },
        { name: "Wire (1 meter)", price: 5000 }
      ]
    };
    
    this.createMarket(market1);
    
    // Create reviews
    const review1: InsertReview = {
      userId: 1,
      targetId: 2,
      jobId: 1,
      rating: 5,
      comment: "Excellent work, very professional!"
    };
    
    const review2: InsertReview = {
      userId: 4,
      targetId: 3,
      jobId: 2,
      rating: 4,
      comment: "Good work, but took a bit longer than expected."
    };
    
    this.createReview(review1);
    this.createReview(review2);
  }
}

export const storage = new MemStorage();
