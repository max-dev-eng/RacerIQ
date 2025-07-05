import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayIcon, ClockIcon, MapIcon, TrendingUpIcon } from "lucide-react";
import { getAllTracks, getTrackInfo } from "@/lib/tracks";

interface TrackLearningProps {}

export default function TrackLearning({}: TrackLearningProps) {
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  
  const tracks = getAllTracks();
  const selectedTrackData = selectedTrack ? getTrackInfo(selectedTrack) : null;

  const handlePlayVideo = () => {
    setIsPlaying(true);
    // In a real implementation, this would load and play the track tutorial video
    setTimeout(() => setIsPlaying(false), 3000); // Mock video duration
  };

  return (
    <section id="track-analysis" className="py-16 bg-racing-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Track Analysis & Learning
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Master each circuit with professional insights. Select a track to watch detailed analysis videos 
              covering racing lines, braking points, and optimal sector strategies.
            </p>
          </div>

          {/* Track Selection Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {tracks.map((track) => (
              <Card 
                key={track.slug}
                className={`racing-card cursor-pointer transition-all duration-300 group ${
                  selectedTrack === track.slug 
                    ? "border-racing-green bg-racing-light ring-2 ring-racing-green" 
                    : "border-racing-light hover:border-racing-green hover:bg-racing-light"
                }`}
                onClick={() => setSelectedTrack(track.slug)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold transition-colors mb-2 ${
                        selectedTrack === track.slug 
                          ? "text-white" 
                          : "text-black group-hover:text-white"
                      }`}>{track.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-400 text-sm">{track.length} km</span>
                      </div>
                    </div>
                    <img 
                      src={track.imageUrl} 
                      alt={track.name}
                      className="w-20 h-16 object-cover rounded-lg border border-racing-gray"
                    />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapIcon size={14} />
                      <span>{track.slug}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <TrendingUpIcon size={14} />
                      <span>{track.turns} turns</span>
                    </div>
                  </div>


                </CardContent>
              </Card>
            ))}
          </div>

          {/* Video Player Section */}
          {selectedTrackData && (
            <Card className="bg-white border border-gray-200 rounded-xl shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-black mb-2">
                    {selectedTrackData.name} - Master Class
                  </h3>
                  <p className="text-gray-600">
                    Professional racing analysis and optimal driving techniques
                  </p>
                </div>

                {/* Video Placeholder */}
                <div className="relative bg-racing-dark rounded-lg aspect-video mb-6 flex items-center justify-center border border-racing-gray">
                  {!isPlaying ? (
                    <div className="text-center">
                      <Button
                        onClick={handlePlayVideo}
                        className="bg-racing-green hover:bg-green-600 text-racing-black font-semibold px-8 py-4 text-lg"
                      >
                        <PlayIcon className="mr-2" size={20} />
                        Play Track Analysis Video
                      </Button>
                      <p className="text-gray-400 text-sm mt-4">
                        Duration: 8-12 minutes • Professional Commentary
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-green mb-4"></div>
                      <p className="text-white">Loading track analysis...</p>
                      <p className="text-gray-400 text-sm">Video content coming soon</p>
                    </div>
                  )}
                </div>

                {/* Track Details */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-black">Track Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Length:</span>
                        <span className="text-black">{selectedTrackData.length} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Turns:</span>
                        <span className="text-black">{selectedTrackData.turns}</span>
                      </div>

                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-black">Key Characteristics</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTrackData.characteristics.map((char, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="text-xs border-racing-green text-racing-green"
                        >
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-black">What You'll Learn</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Optimal racing lines</li>
                      <li>• Braking points & zones</li>
                      <li>• Sector-by-sector analysis</li>
                      <li>• Setup recommendations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!selectedTrack && (
            <div className="text-center py-12">
              <MapIcon className="mx-auto text-racing-green mb-4" size={48} />
              <h3 className="text-xl font-semibold text-white mb-2">
                Select a Track to Begin Learning
              </h3>
              <p className="text-gray-400">
                Choose any circuit above to watch professional analysis videos and improve your lap times
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}