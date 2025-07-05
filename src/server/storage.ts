import { 
  users, tracks, cars, lapVideos, lapAnalyses, baselineLaps,
  type User, type InsertUser, type Track, type InsertTrack,
  type Car, type InsertCar, type LapVideo, type InsertLapVideo, 
  type LapAnalysis, type InsertLapAnalysis, type BaselineLap, type InsertBaselineLap
} from "RacerIQ/src/shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Track methods
  getAllTracks(): Promise<Track[]>;
  getTrack(id: number): Promise<Track | undefined>;
  getTrackBySlug(slug: string): Promise<Track | undefined>;
  createTrack(track: InsertTrack): Promise<Track>;

  // Car methods
  getAllCars(): Promise<Car[]>;
  getCar(id: number): Promise<Car | undefined>;
  getCarsByCategory(category: string): Promise<Car[]>;
  createCar(car: InsertCar): Promise<Car>;

  // Lap video methods
  createLapVideo(video: InsertLapVideo): Promise<LapVideo>;
  getLapVideo(id: number): Promise<LapVideo | undefined>;
  getLapVideosByTrack(trackId: number): Promise<LapVideo[]>;

  // Lap analysis methods
  createLapAnalysis(analysis: InsertLapAnalysis): Promise<LapAnalysis>;
  getLapAnalysis(id: number): Promise<LapAnalysis | undefined>;
  getLapAnalysesByVideo(videoId: number): Promise<LapAnalysis[]>;

  // Baseline lap methods
  getBaselineLap(trackId: number, carId?: number): Promise<BaselineLap | undefined>;
  createBaselineLap(baseline: InsertBaselineLap): Promise<BaselineLap>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tracks: Map<number, Track>;
  private cars: Map<number, Car>;
  private lapVideos: Map<number, LapVideo>;
  private lapAnalyses: Map<number, LapAnalysis>;
  private baselineLaps: Map<number, BaselineLap>;
  private currentUserId: number;
  private currentTrackId: number;
  private currentCarId: number;
  private currentVideoId: number;
  private currentAnalysisId: number;
  private currentBaselineId: number;

  constructor() {
    this.users = new Map();
    this.tracks = new Map();
    this.cars = new Map();
    this.lapVideos = new Map();
    this.lapAnalyses = new Map();
    this.baselineLaps = new Map();
    this.currentUserId = 1;
    this.currentTrackId = 1;
    this.currentCarId = 1;
    this.currentVideoId = 1;
    this.currentAnalysisId = 1;
    this.currentBaselineId = 1;

    // Initialize with default data
    this.initializeDefaultTracks();
    this.initializeDefaultCars();
  }

  private initializeDefaultTracks(): void {
    const defaultTracks: InsertTrack[] = [
      {
        name: "Austrian GP - Red Bull Ring",
        slug: "austrian-gp",
        country: "Austria",
        length: "4.318 km",
        turns: 10,
        sectors: 3,
        description: "High-speed circuit with elevation changes",
        mapData: {
          sectors: [
            { id: 1, path: "M50,150 Q100,50 200,80", color: "green" },
            { id: 2, path: "M200,80 Q300,100 350,150 Q320,200 250,220", color: "yellow" },
            { id: 3, path: "M250,220 Q150,240 100,200 Q70,180 50,150", color: "green" }
          ]
        }
      },
      {
        name: "Nürburgring - Nordschleife",
        slug: "nurburgring",
        country: "Germany",
        length: "20.832 km",
        turns: 154,
        sectors: 3,
        description: "The legendary Green Hell",
        mapData: {
          sectors: [
            { id: 1, path: "M50,150 Q80,80 150,100 Q200,120 250,100", color: "yellow" },
            { id: 2, path: "M250,100 Q300,80 350,120 Q380,160 350,200", color: "green" },
            { id: 3, path: "M350,200 Q300,240 200,220 Q100,200 50,150", color: "yellow" }
          ]
        }
      },
      {
        name: "Monza - Italy",
        slug: "monza",
        country: "Italy",
        length: "5.793 km",
        turns: 11,
        sectors: 3,
        description: "Temple of Speed",
        mapData: {
          sectors: [
            { id: 1, path: "M50,150 L200,150 L250,100", color: "green" },
            { id: 2, path: "M250,100 L350,100 L350,200 L300,250", color: "yellow" },
            { id: 3, path: "M300,250 L150,250 L100,200 L50,150", color: "green" }
          ]
        }
      },
      {
        name: "Spa-Francorchamps - Belgium",
        slug: "spa",
        country: "Belgium",
        length: "7.004 km",
        turns: 19,
        sectors: 3,
        description: "Classic circuit through the Ardennes",
        mapData: {
          sectors: [
            { id: 1, path: "M50,150 Q120,50 200,80 Q280,60 350,100", color: "green" },
            { id: 2, path: "M350,100 Q380,140 350,180 Q320,220 280,200", color: "yellow" },
            { id: 3, path: "M280,200 Q200,240 120,220 Q80,180 50,150", color: "green" }
          ]
        }
      }
    ];

    defaultTracks.forEach(track => this.createTrack(track));
  }

  private initializeDefaultCars(): void {
    const defaultCars: InsertCar[] = [
      // GT3 Class
      {
        name: "992 GT3 R",
        brand: "Porsche",
        category: "GT3",
        year: 2022,
        description: "Track-focused GT3 racer with enhanced aerodynamics",
        specifications: { power: "520 HP", weight: "1250 kg", drivetrain: "RWD" }
      },
      {
        name: "991 GT3 R",
        brand: "Porsche",
        category: "GT3",
        year: 2019,
        description: "Previous generation GT3 with proven racing pedigree",
        specifications: { power: "500 HP", weight: "1220 kg", drivetrain: "RWD" }
      },
      {
        name: "488 GT3/GTE",
        brand: "Ferrari",
        category: "GT3",
        year: 2020,
        description: "Italian thoroughbred with V8 twin-turbo power",
        specifications: { power: "550 HP", weight: "1245 kg", drivetrain: "RWD" }
      },
      {
        name: "296 GT3",
        brand: "Ferrari",
        category: "GT3",
        year: 2023,
        description: "Latest Ferrari GT3 with hybrid V6 technology",
        specifications: { power: "600 HP", weight: "1300 kg", drivetrain: "RWD" }
      },
      {
        name: "R8 LMS GT3",
        brand: "Audi",
        category: "GT3",
        year: 2022,
        description: "All-wheel drive GT3 with distinctive quattro handling",
        specifications: { power: "585 HP", weight: "1230 kg", drivetrain: "AWD" }
      },
      {
        name: "M4 GT3",
        brand: "BMW",
        category: "GT3",
        year: 2022,
        description: "Bavarian precision engineering for competitive racing",
        specifications: { power: "590 HP", weight: "1300 kg", drivetrain: "RWD" }
      },
      {
        name: "AMG GT3",
        brand: "Mercedes",
        category: "GT3",
        year: 2021,
        description: "Three-pointed star's flagship GT3 competitor",
        specifications: { power: "558 HP", weight: "1285 kg", drivetrain: "RWD" }
      },
      // GT4 Class
      {
        name: "Cayman GT4",
        brand: "Porsche",
        category: "GT4",
        year: 2021,
        description: "Mid-engine sports car optimized for track performance",
        specifications: { power: "420 HP", weight: "1420 kg", drivetrain: "RWD" }
      },
      {
        name: "AMG GT4",
        brand: "Mercedes",
        category: "GT4",
        year: 2021,
        description: "German engineering meets track performance",
        specifications: { power: "510 HP", weight: "1500 kg", drivetrain: "RWD" }
      },
      {
        name: "M4 GT4",
        brand: "BMW",
        category: "GT4",
        year: 2022,
        description: "Entry-level GT4 with excellent handling characteristics",
        specifications: { power: "430 HP", weight: "1520 kg", drivetrain: "RWD" }
      },
      // Cup (Spec Series) Class
      {
        name: "992 GT3 Cup",
        brand: "Porsche",
        category: "Cup",
        year: 2022,
        description: "One-make racing series vehicle with strict regulations",
        specifications: { power: "510 HP", weight: "1260 kg", drivetrain: "RWD" }
      }
    ];

    defaultCars.forEach(car => this.createCar(car));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Track methods
  async getAllTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }

  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async getTrackBySlug(slug: string): Promise<Track | undefined> {
    return Array.from(this.tracks.values()).find(track => track.slug === slug);
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = this.currentTrackId++;
    const track: Track = { 
      ...insertTrack, 
      id,
      sectors: insertTrack.sectors ?? 3,
      description: insertTrack.description ?? null,
      mapData: insertTrack.mapData ?? null
    };
    this.tracks.set(id, track);
    return track;
  }

  // Car methods
  async getAllCars(): Promise<Car[]> {
    return Array.from(this.cars.values());
  }

  async getCar(id: number): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async getCarsByCategory(category: string): Promise<Car[]> {
    return Array.from(this.cars.values()).filter(car => car.category === category);
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = this.currentCarId++;
    const car: Car = { 
      ...insertCar, 
      id,
      year: insertCar.year ?? null,
      description: insertCar.description ?? null,
      specifications: insertCar.specifications ?? null
    };
    this.cars.set(id, car);
    return car;
  }

  // Lap video methods
  async createLapVideo(insertVideo: InsertLapVideo): Promise<LapVideo> {
    const id = this.currentVideoId++;
    const video: LapVideo = { 
      ...insertVideo, 
      id,
      duration: insertVideo.duration ?? null,
      trackId: insertVideo.trackId ?? null,
      carId: insertVideo.carId ?? null,
      uploadedAt: new Date()
    };
    this.lapVideos.set(id, video);
    return video;
  }

  async getLapVideo(id: number): Promise<LapVideo | undefined> {
    return this.lapVideos.get(id);
  }

  async getLapVideosByTrack(trackId: number): Promise<LapVideo[]> {
    return Array.from(this.lapVideos.values()).filter(video => video.trackId === trackId);
  }

  // Lap analysis methods
  async createLapAnalysis(insertAnalysis: InsertLapAnalysis): Promise<LapAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: LapAnalysis = { 
      ...insertAnalysis, 
      id,
      trackId: insertAnalysis.trackId ?? null,
      videoId: insertAnalysis.videoId ?? null,
      telemetryData: insertAnalysis.telemetryData ?? null,
      aiSuggestions: insertAnalysis.aiSuggestions ?? null,
      createdAt: new Date()
    };
    this.lapAnalyses.set(id, analysis);
    return analysis;
  }

  async getLapAnalysis(id: number): Promise<LapAnalysis | undefined> {
    return this.lapAnalyses.get(id);
  }

  async getLapAnalysesByVideo(videoId: number): Promise<LapAnalysis[]> {
    return Array.from(this.lapAnalyses.values()).filter(analysis => analysis.videoId === videoId);
  }

  // Baseline lap methods
  async getBaselineLap(trackId: number, carId?: number): Promise<BaselineLap | undefined> {
    return Array.from(this.baselineLaps.values()).find(baseline => 
      baseline.trackId === trackId && (!carId || baseline.carId === carId)
    );
  }

  async createBaselineLap(insertBaseline: InsertBaselineLap): Promise<BaselineLap> {
    const id = this.currentBaselineId++;
    const baseline: BaselineLap = { 
      ...insertBaseline, 
      id,
      trackId: insertBaseline.trackId ?? null,
      carId: insertBaseline.carId ?? null,
      description: insertBaseline.description ?? null,
      telemetryData: insertBaseline.telemetryData ?? null
    };
    this.baselineLaps.set(id, baseline);
    return baseline;
  }
}

export const storage = new MemStorage();
