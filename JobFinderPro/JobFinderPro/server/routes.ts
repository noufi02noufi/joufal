import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertWorkerProfileSchema, insertJobSchema, insertMarketSchema, insertReviewSchema, searchWorkersSchema, searchJobsSchema, searchMarketsSchema, userLoginSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - all prefixed with /api
  
  // AUTH ROUTES
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const validatedData = userLoginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (user.password !== validatedData.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, we would use proper authentication (JWT, session, etc.)
      // and not return the password
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(validatedData);
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // USER ROUTES
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id, 10);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      
      // If it's a worker, get their profile
      if (user.role === "worker") {
        const workerProfile = await storage.getWorkerProfile(userId);
        if (workerProfile) {
          return res.status(200).json({ ...userWithoutPassword, workerProfile });
        }
      }
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id, 10);
      
      // In a real app, we would check if the user is authorized to update this profile
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, req.body);
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user" });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // WORKER PROFILE ROUTES
  app.post("/api/worker-profiles", async (req: Request, res: Response) => {
    try {
      const validatedData = insertWorkerProfileSchema.parse(req.body);
      
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.role !== "worker") {
        return res.status(400).json({ message: "User is not a worker" });
      }
      
      const existingProfile = await storage.getWorkerProfile(validatedData.userId);
      if (existingProfile) {
        return res.status(400).json({ message: "Worker profile already exists" });
      }
      
      const newWorkerProfile = await storage.createWorkerProfile(validatedData);
      
      res.status(201).json(newWorkerProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/worker-profiles/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      
      // In a real app, we would check if the user is authorized to update this profile
      const workerProfile = await storage.getWorkerProfile(userId);
      if (!workerProfile) {
        return res.status(404).json({ message: "Worker profile not found" });
      }
      
      const updatedProfile = await storage.updateWorkerProfile(userId, req.body);
      if (!updatedProfile) {
        return res.status(500).json({ message: "Failed to update worker profile" });
      }
      
      res.status(200).json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // JOB ROUTES
  app.post("/api/jobs", async (req: Request, res: Response) => {
    try {
      const validatedData = insertJobSchema.parse(req.body);
      
      const employer = await storage.getUser(validatedData.employerId);
      if (!employer) {
        return res.status(404).json({ message: "Employer not found" });
      }
      
      if (employer.role !== "employer") {
        return res.status(400).json({ message: "User is not an employer" });
      }
      
      const newJob = await storage.createJob(validatedData);
      
      res.status(201).json(newJob);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/jobs/:id", async (req: Request, res: Response) => {
    try {
      const jobId = parseInt(req.params.id, 10);
      
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/jobs/:id", async (req: Request, res: Response) => {
    try {
      const jobId = parseInt(req.params.id, 10);
      
      // In a real app, we would check if the user is authorized to update this job
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      const updatedJob = await storage.updateJob(jobId, req.body);
      if (!updatedJob) {
        return res.status(500).json({ message: "Failed to update job" });
      }
      
      res.status(200).json(updatedJob);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/jobs/employer/:employerId", async (req: Request, res: Response) => {
    try {
      const employerId = parseInt(req.params.employerId, 10);
      
      const employer = await storage.getUser(employerId);
      if (!employer) {
        return res.status(404).json({ message: "Employer not found" });
      }
      
      const jobs = await storage.getJobsByEmployer(employerId);
      
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/jobs/worker/:workerId", async (req: Request, res: Response) => {
    try {
      const workerId = parseInt(req.params.workerId, 10);
      
      const worker = await storage.getUser(workerId);
      if (!worker) {
        return res.status(404).json({ message: "Worker not found" });
      }
      
      const jobs = await storage.getJobsByWorker(workerId);
      
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/jobs/nearby", async (req: Request, res: Response) => {
    try {
      const validatedData = searchJobsSchema.parse(req.body);
      
      const jobs = await storage.getJobsNearby(
        validatedData.latitude,
        validatedData.longitude,
        validatedData.radius,
        validatedData.category
      );
      
      res.status(200).json(jobs);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // MARKET ROUTES
  app.post("/api/markets", async (req: Request, res: Response) => {
    try {
      const validatedData = insertMarketSchema.parse(req.body);
      
      const newMarket = await storage.createMarket(validatedData);
      
      res.status(201).json(newMarket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/markets/:id", async (req: Request, res: Response) => {
    try {
      const marketId = parseInt(req.params.id, 10);
      
      const market = await storage.getMarket(marketId);
      if (!market) {
        return res.status(404).json({ message: "Market not found" });
      }
      
      res.status(200).json(market);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/markets/nearby", async (req: Request, res: Response) => {
    try {
      const validatedData = searchMarketsSchema.parse(req.body);
      
      const markets = await storage.getMarketsNearby(
        validatedData.latitude,
        validatedData.longitude,
        validatedData.radius,
        validatedData.type
      );
      
      res.status(200).json(markets);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // REVIEW ROUTES
  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const target = await storage.getUser(validatedData.targetId);
      if (!target) {
        return res.status(404).json({ message: "Target user not found" });
      }
      
      if (validatedData.jobId) {
        const job = await storage.getJob(validatedData.jobId);
        if (!job) {
          return res.status(404).json({ message: "Job not found" });
        }
      }
      
      const newReview = await storage.createReview(validatedData);
      
      res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/reviews/target/:targetId", async (req: Request, res: Response) => {
    try {
      const targetId = parseInt(req.params.targetId, 10);
      
      const target = await storage.getUser(targetId);
      if (!target) {
        return res.status(404).json({ message: "Target user not found" });
      }
      
      const reviews = await storage.getReviewsByTarget(targetId);
      
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // SEARCH ROUTES
  app.post("/api/search/workers", async (req: Request, res: Response) => {
    try {
      const validatedData = searchWorkersSchema.parse(req.body);
      
      const workers = await storage.searchWorkers(
        validatedData.profession,
        validatedData.latitude,
        validatedData.longitude,
        validatedData.radius
      );
      
      res.status(200).json(workers);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
