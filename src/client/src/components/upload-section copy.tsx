import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Upload, MapPin, Eye, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Track, Car, LapAnalysis, ComparisonFormat } from "RacerIQ/src/shared/schema";

interface UploadSectionProps {
  onAnalysisComplete: (analysis: LapAnalysis) => void;
}

const comparisonFormats: { value: ComparisonFormat; label: string; description: string; icon: string }[] = [
  { value: "side-by-side", label: "Side-by-Side", description: "Compare videos simultaneously", icon: "fas fa-columns" },
  { value: "overlay", label: "Overlay", description: "Baseline at 20% opacity", icon: "fas fa-layer-group" },
  { value: "split-screen", label: "Split + Telemetry", description: "With data overlay", icon: "fas fa-chart-bar" },
  { value: "picture-in-picture", label: "Picture-in-Picture", description: "Floating comparison", icon: "fas fa-expand-arrows-alt" }
];

export default function UploadSection({ onAnalysisComplete }: UploadSectionProps) {
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<ComparisonFormat>("side-by-side");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const { toast } = useToast();

  // Fetch tracks
  const { data: tracks, isLoading: tracksLoading } = useQuery<Track[]>({
    queryKey: ["/api/tracks"],
  });

  // Fetch cars
  const { data: cars, isLoading: carsLoading } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  // Filter cars by selected class
  const filteredCars = cars?.filter(car => 
    !selectedClass || car.category === selectedClass
  ) || [];

  // Reset car selection when class changes
  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    setSelectedCar(""); // Reset car selection when class changes
  };

  const carClasses = [
    { value: "GT3", label: "GT3", description: "Premier racing class with high-performance specifications" },
    { value: "GT4", label: "GT4", description: "Entry-level professional racing with controlled regulations" },
    { value: "Cup", label: "Cup (Spec Series)", description: "One-make series with identical vehicle specifications" }
  ];

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/upload", formData);
      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Analysis mutation
  const analysisMutation = useMutation({
    mutationFn: async ({ videoId, comparisonFormat }: { videoId: number; comparisonFormat: ComparisonFormat }) => {
      const response = await apiRequest("POST", "/api/analyze", { videoId, comparisonFormat });
      return response.json();
    },
    onSuccess: (analysis) => {
      onAnalysisComplete(analysis);
      toast({
        title: "Analysis Complete",
        description: "Your lap has been analyzed successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile || !selectedTrack || !selectedCar) {
      toast({
        title: "Missing Information",
        description: "Please select a track, car, and upload a video file.",
        variant: "destructive",
      });
      return;
    }

    try {
      // First upload the video
      const formData = new FormData();
      formData.append("video", uploadedFile);
      formData.append("trackId", selectedTrack);
      formData.append("carId", selectedCar);

      const video = await uploadMutation.mutateAsync(formData);
      
      // Then analyze it
      await analysisMutation.mutateAsync({
        videoId: video.id,
        comparisonFormat: selectedFormat
      });
    } catch (error) {
      // Error handling is done in mutation onError callbacks
    }
  };

  const selectedTrackData = tracks?.find(track => track.id.toString() === selectedTrack);
  const selectedCarData = filteredCars?.find(car => car.id.toString() === selectedCar);

  return (
    <section id="upload" className="py-16 bg-racing-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Upload Your Lap</h3>
            <p className="text-gray-400">Start by uploading your recorded lap video and selecting your track and car</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Track Selection */}
            <Card className="racing-card">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="text-racing-green mr-3" size={20} />
                  Select Track
                </h4>
                <div className="space-y-4">
                  <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                    <SelectTrigger className="racing-input">
                      <SelectValue placeholder="Choose a track" />
                    </SelectTrigger>
                    <SelectContent className="bg-racing-dark border border-racing-light">
                      {tracks?.map((track) => (
                        <SelectItem key={track.id} value={track.id.toString()} className="text-white hover:bg-racing-gray">
                          {track.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Track Preview */}
                  {selectedTrackData && (
                    <div className="bg-racing-black rounded-lg p-4 text-on-dark">
                      <img 
                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200" 
                        alt={`${selectedTrackData.name} aerial view`}
                        className="w-full h-24 object-cover rounded-lg mb-3" 
                      />
                      <div className="text-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{selectedTrackData.name}</span>
                          <span className="text-racing-green">{selectedTrackData.length}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>{selectedTrackData.turns} Turns</span>
                          <span>{selectedTrackData.sectors} Sectors</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Car Class Selection */}
            <Card className="racing-card">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <svg className="text-racing-green mr-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                  Select Class
                </h4>
                <div className="space-y-4">
                  {/* Class Selection */}
                  <div className="grid grid-cols-1 gap-3">
                    {carClasses.map((carClass) => (
                      <div
                        key={carClass.value}
                        className={`cursor-pointer transition-all p-4 rounded-lg border-2 ${
                          selectedClass === carClass.value 
                            ? "border-racing-green bg-racing-dark shadow-lg ring-2 ring-racing-green/30" 
                            : "border-gray-600 bg-racing-black hover:border-racing-green hover:bg-racing-dark"
                        }`}
                        onClick={() => handleClassChange(carClass.value)}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-white">{carClass.label}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            carClass.value === 'GT3' ? 'bg-racing-green text-racing-black' :
                            carClass.value === 'GT4' ? 'bg-blue-500 text-white' :
                            'bg-racing-yellow text-racing-black'
                          }`}>
                            {carClass.value}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{carClass.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Car Selection within Class */}
                  {selectedClass && (
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-300">Choose Car</h5>
                      <Select value={selectedCar} onValueChange={setSelectedCar}>
                        <SelectTrigger className="racing-input">
                          <SelectValue placeholder={`Choose a ${selectedClass} car`} />
                        </SelectTrigger>
                        <SelectContent className="bg-racing-dark border border-racing-light">
                          {filteredCars.map((car) => (
                            <SelectItem key={car.id} value={car.id.toString()} className="text-white hover:bg-racing-gray">
                              {car.brand} {car.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {/* Car Preview */}
                      {selectedCarData && (
                        <div className="bg-racing-black rounded-lg p-4 text-on-dark">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{selectedCarData.brand} {selectedCarData.name}</span>
                              <span className="text-racing-green text-xs">{selectedCarData.year}</span>
                            </div>
                            {selectedCarData.specifications && (
                              <div className="grid grid-cols-2 gap-2 text-gray-400 text-xs">
                                <span>Power: {(selectedCarData.specifications as Record<string, any>).power}</span>
                                <span>Weight: {(selectedCarData.specifications as Record<string, any>).weight}</span>
                              </div>
                            )}
                            {selectedCarData.description && (
                              <p className="text-gray-400 text-xs">{selectedCarData.description}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="racing-card">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <Upload className="text-racing-green mr-3" size={20} />
                  Upload Video
                </h4>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    dragActive 
                      ? "border-racing-green bg-racing-gray" 
                      : "border-racing-light hover:border-racing-green"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('video-upload')?.click()}
                >
                  <input
                    id="video-upload"
                    type="file"
                    accept=".mp4,.avi,.mov,.mkv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {uploadedFile ? (
                    <div>
                      <div className="text-racing-green text-4xl mb-4">✓</div>
                      <p className="text-lg font-medium mb-2">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-400">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl text-gray-400 mb-4">📹</div>
                      <p className="text-lg font-medium mb-2">Drop your lap video here</p>
                      <p className="text-sm text-gray-400 mb-4">or click to browse files</p>
                      <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                        <span className="bg-racing-black px-2 py-1 rounded">MP4</span>
                        <span className="bg-racing-black px-2 py-1 rounded">AVI</span>
                        <span className="bg-racing-black px-2 py-1 rounded">MOV</span>
                        <span className="bg-racing-black px-2 py-1 rounded">MKV</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-sm text-gray-400 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Max file size: 500MB. Best quality: 1080p 60fps
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Format Selection */}
          <Card className="racing-card mt-12">
            <CardContent className="p-6">
              <h4 className="text-xl font-semibold mb-6 flex items-center">
                <Eye className="text-racing-green mr-3" size={20} />
                Choose Comparison Format
              </h4>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {comparisonFormats.map((format) => (
                  <div
                    key={format.value}
                    className={`cursor-pointer transition-all group p-4 rounded-lg border-2 ${
                      selectedFormat === format.value 
                        ? "border-racing-green bg-gray-50 shadow-lg ring-2 ring-racing-green/30" 
                        : "border-gray-500 bg-gray-800 hover:border-racing-green hover:bg-gray-600"
                    }`}
                    onClick={() => setSelectedFormat(format.value)}
                  >
                    <div className={`flex items-center justify-center h-20 rounded mb-3 ${
                      selectedFormat === format.value ? "bg-gray-200" : "bg-gray-900"
                    }`}>
                      <div className={`text-2xl transition-colors ${
                        selectedFormat === format.value 
                          ? "text-racing-green" 
                          : "text-gray-300 group-hover:text-racing-green"
                      }`}>
                        {format.value === "side-by-side" && "⫸"}
                        {format.value === "overlay" && "⧉"}
                        {format.value === "split-screen" && "⧈"}
                        {format.value === "picture-in-picture" && "⧇"}
                      </div>
                    </div>
                    <h5 className={`font-medium text-center mb-1 ${
                      selectedFormat === format.value ? "text-black" : "text-white"
                    }`}>{format.label}</h5>
                    <p className={`text-xs text-center transition-colors ${
                      selectedFormat === format.value 
                        ? "text-gray-600" 
                        : "text-gray-500 group-hover:text-gray-300"
                    }`}>
                      {format.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button
              onClick={handleAnalyze}
              disabled={!uploadedFile || !selectedTrack || !selectedCar || uploadMutation.isPending || analysisMutation.isPending}
              className="racing-button-primary text-lg px-8 py-4"
            >
              <Rocket className="mr-3" size={20} />
              {uploadMutation.isPending || analysisMutation.isPending ? "Analyzing..." : "Analyze My Lap"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
