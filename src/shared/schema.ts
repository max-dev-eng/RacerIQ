import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  country: text("country").notNull(),
  length: text("length").notNull(),
  turns: integer("turns").notNull(),
  sectors: integer("sectors").notNull().default(3),
  description: text("description"),
  mapData: json("map_data"),
});

export const lapVideos = pgTable("lap_videos", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  fileSize: integer("file_size").notNull(),
  duration: integer("duration"), // in seconds
  format: text("format").notNull(),
  trackId: integer("track_id").references(() => tracks.id),
  carId: integer("car_id").references(() => cars.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const lapAnalyses = pgTable("lap_analyses", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => lapVideos.id),
  trackId: integer("track_id").references(() => tracks.id),
  totalTime: text("total_time").notNull(), // e.g., "1:23.456"
  sectorTimes: json("sector_times").notNull(), // Array of sector times
  telemetryData: json("telemetry_data"), // Throttle, brake, speed data
  comparisonFormat: text("comparison_format").notNull(), // side-by-side, overlay, etc.
  aiSuggestions: json("ai_suggestions"), // AI coaching feedback
  createdAt: timestamp("created_at").defaultNow(),
});

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(), // GT3, GT4, Cup, GTE
  year: integer("year"),
  description: text("description"),
  specifications: json("specifications"), // Power, weight, etc.
});

export const baselineLaps = pgTable("baseline_laps", {
  id: serial("id").primaryKey(),
  trackId: integer("track_id").references(() => tracks.id),
  carId: integer("car_id").references(() => cars.id),
  filename: text("filename").notNull(),
  totalTime: text("total_time").notNull(),
  sectorTimes: json("sector_times").notNull(),
  telemetryData: json("telemetry_data"),
  description: text("description"),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTrackSchema = createInsertSchema(tracks).omit({
  id: true,
});

export const insertCarSchema = createInsertSchema(cars).omit({
  id: true,
});

export const insertLapVideoSchema = createInsertSchema(lapVideos).omit({
  id: true,
  uploadedAt: true,
});

export const insertLapAnalysisSchema = createInsertSchema(lapAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertBaselineLapSchema = createInsertSchema(baselineLaps).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;

export type Car = typeof cars.$inferSelect;
export type InsertCar = z.infer<typeof insertCarSchema>;

export type LapVideo = typeof lapVideos.$inferSelect;
export type InsertLapVideo = z.infer<typeof insertLapVideoSchema>;

export type LapAnalysis = typeof lapAnalyses.$inferSelect;
export type InsertLapAnalysis = z.infer<typeof insertLapAnalysisSchema>;

export type BaselineLap = typeof baselineLaps.$inferSelect;
export type InsertBaselineLap = z.infer<typeof insertBaselineLapSchema>;

// Enums and constants
export const SUPPORTED_VIDEO_FORMATS = ['mp4', 'avi', 'mov', 'mkv'] as const;
export const COMPARISON_FORMATS = ['side-by-side', 'overlay', 'split-screen', 'picture-in-picture'] as const;
export const TRACK_SLUGS = ['austrian-gp', 'nurburgring', 'monza', 'spa'] as const;

export type VideoFormat = typeof SUPPORTED_VIDEO_FORMATS[number];
export type ComparisonFormat = typeof COMPARISON_FORMATS[number];
export type TrackSlug = typeof TRACK_SLUGS[number];
