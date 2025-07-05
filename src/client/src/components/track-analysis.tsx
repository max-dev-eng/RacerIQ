import { MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrackMap from "@/components/track-map";
import type { LapAnalysis } from "RacerIQ/src/shared/schema";

interface TrackAnalysisProps {
  analysis: LapAnalysis;
}

export default function TrackAnalysis({ analysis }: TrackAnalysisProps) {
  const sectorTimes = analysis.sectorTimes as any[];
  const totalDelta = sectorTimes?.reduce((sum, sector) => sum + (sector.delta || 0), 0) || 1.564;

  return (
    <section className="py-16 bg-racing-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Track Sector Analysis</h3>
            <p className="text-gray-400">Interactive performance breakdown by track section</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Interactive Track Map */}
            <Card className="racing-card">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-6 flex items-center">
                  <MapPin className="text-racing-green mr-3" size={20} />
                  Austrian GP Track Map
                </h4>
                
                <TrackMap trackId={analysis.trackId!} sectorTimes={sectorTimes} />
                
                <p className="text-sm text-gray-400 mt-4 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.5 10C7.32843 10 8 9.32843 8 8.5C8 7.67157 7.32843 7 6.5 7C5.67157 7 5 7.67157 5 8.5C5 9.32843 5.67157 10 6.5 10Z" />
                    <path fillRule="evenodd" d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z" clipRule="evenodd" />
                  </svg>
                  Click on track sectors for detailed analysis
                </p>
              </CardContent>
            </Card>

            {/* Sector Performance Table */}
            <Card className="racing-card">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-6 flex items-center">
                  <Clock className="text-racing-green mr-3" size={20} />
                  Sector Performance
                </h4>
                
                <div className="space-y-4">
                  {sectorTimes?.map((sector) => (
                    <div 
                      key={sector.sector}
                      className={`bg-racing-black rounded-lg p-4 border-l-4 ${
                        sector.status === 'faster' ? 'border-racing-green' : 'border-racing-yellow'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-semibold">Sector {sector.sector}</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded font-medium ${
                            sector.status === 'faster' 
                              ? 'bg-racing-green text-racing-black' 
                              : 'bg-racing-yellow text-racing-black'
                          }`}>
                            {sector.status === 'faster' ? 'FASTER' : 'SLOWER'}
                          </span>
                        </div>
                        <span className={`font-mono ${
                          sector.status === 'faster' ? 'text-racing-green' : 'text-racing-yellow'
                        }`}>
                          {sector.delta > 0 ? '+' : ''}{sector.delta.toFixed(3)}s
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Your Time: {sector.time}s</span>
                        <span>Baseline: {sector.baseline}s</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Overall Performance */}
                <div className="mt-6 p-4 bg-racing-black rounded-lg border border-racing-light">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Overall Lap Time</span>
                    <div className="text-right">
                      <div className="font-mono text-lg">{analysis.totalTime}</div>
                      <div className="text-sm text-racing-yellow">+{totalDelta.toFixed(3)}s vs baseline</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
