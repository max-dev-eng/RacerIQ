import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { 
  insertLapVideoSchema, 
  insertLapAnalysisSchema,
  SUPPORTED_VIDEO_FORMATS,
  type ComparisonFormat 
} from "RacerIQ/src/shared/schema";
import { z } from "zod";

// Configure multer for video uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (SUPPORTED_VIDEO_FORMATS.includes(ext as any)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported video format. Supported formats: ${SUPPORTED_VIDEO_FORMATS.join(', ')}`));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all tracks
  app.get("/api/tracks", async (req, res) => {
    try {
      const tracks = await storage.getAllTracks();
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracks" });
    }
  });

  // Get track by slug
  app.get("/api/tracks/:slug", async (req, res) => {
    try {
      const track = await storage.getTrackBySlug(req.params.slug);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      res.json(track);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch track" });
    }
  });

  // Upload lap video
  app.post("/api/upload", upload.single('video'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file provided" });
      }

      const { trackId, carId } = req.body;
      if (!trackId) {
        return res.status(400).json({ message: "Track ID is required" });
      }
      if (!carId) {
        return res.status(400).json({ message: "Car ID is required" });
      }

      // Validate track exists
      const track = await storage.getTrack(parseInt(trackId));
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }

      // Validate car exists
      const car = await storage.getCar(parseInt(carId));
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }

      const videoData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        format: path.extname(req.file.originalname).toLowerCase().slice(1),
        trackId: parseInt(trackId),
        carId: parseInt(carId),
      };

      const validatedData = insertLapVideoSchema.parse(videoData);
      const video = await storage.createLapVideo(validatedData);

      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to upload video" });
    }
  });

  // Analyze lap video
  app.post("/api/analyze", async (req, res) => {
    try {
      const { videoId, comparisonFormat } = req.body;

      if (!videoId || !comparisonFormat) {
        return res.status(400).json({ message: "Video ID and comparison format are required" });
      }

      // Validate video exists
      const video = await storage.getLapVideo(parseInt(videoId));
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Get baseline lap for comparison
      const baselineLap = await storage.getBaselineLap(video.trackId!);
      
      // Generate mock analysis data (in real app, this would be actual AI analysis)
      const mockAnalysis = {
        videoId: parseInt(videoId),
        trackId: video.trackId!,
        totalTime: "1:23.456",
        sectorTimes: [
          { sector: 1, time: "28.456", baseline: "28.690", delta: -0.234, status: "faster" },
          { sector: 2, time: "32.234", baseline: "31.111", delta: 1.123, status: "slower" },
          { sector: 3, time: "22.766", baseline: "23.091", delta: -0.325, status: "faster" }
        ],
        telemetryData: {
          throttle: { your: 89, baseline: 94 },
          brake: { your: 95, baseline: 88 },
          speed: { your: 287, baseline: 294 }
        },
        comparisonFormat: comparisonFormat as ComparisonFormat,
        aiSuggestions: [
          {
            priority: 1,
            title: "Turn 4 - Late Braking Point",
            description: "You're braking 15m later than the baseline. Try braking earlier and trail braking into the apex to maintain better grip and carry more speed through the corner exit."
          },
          {
            priority: 2,
            title: "Sector 2 - Throttle Application",
            description: "Your throttle input is too aggressive on corner exit. Apply 15% less throttle initially and build up gradually to avoid wheel spin and maintain traction."
          },
          {
            priority: 3,
            title: "Racing Line - Turn 7-8 Complex",
            description: "You're taking a wider line through the chicane. Position your car 0.5m closer to the inside curb on Turn 7 entry to set up better for Turn 8."
          }
        ]
      };

      const validatedAnalysis = insertLapAnalysisSchema.parse(mockAnalysis);
      const analysis = await storage.createLapAnalysis(validatedAnalysis);

      res.json(analysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid analysis data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to analyze video" });
    }
  });

  // Get lap analysis
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const analysis = await storage.getLapAnalysis(parseInt(req.params.id));
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  // Get all cars
  app.get("/api/cars", async (req, res) => {
    try {
      const cars = await storage.getAllCars();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cars" });
    }
  });

  // Get cars by category
  app.get("/api/cars/category/:category", async (req, res) => {
    try {
      const cars = await storage.getCarsByCategory(req.params.category);
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cars by category" });
    }
  });

  // Get baseline lap for track
  app.get("/api/baseline/:trackId", async (req, res) => {
    try {
      const carId = req.query.carId ? parseInt(req.query.carId as string) : undefined;
      const baseline = await storage.getBaselineLap(parseInt(req.params.trackId), carId);
      if (!baseline) {
        return res.status(404).json({ message: "Baseline lap not found for this track" });
      }
      res.json(baseline);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch baseline lap" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
