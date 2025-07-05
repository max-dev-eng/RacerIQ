import { Play, Pause, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TelemetryDisplay from "@/components/telemetry-display";
import type { LapAnalysis } from "RacerIQ/src/shared/schema";

interface VideoComparisonProps {
  analysis: LapAnalysis;
}

export default function VideoComparison({ analysis }: VideoComparisonProps) {
  return (
    <section id="analysis" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Video Analysis</h3>
            <p className="text-gray-400">Your lap vs. professional baseline</p>
          </div>

          {/* Video Comparison Player */}
          <Card className="bg-racing-dark border border-racing-gray mb-8">
            <div className="bg-racing-gray px-6 py-4 border-b border-racing-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">Austrian GP - Sector Analysis</span>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-racing-green rounded-full"></div>
                    <span>Your Lap</span>
                    <div className="w-3 h-3 bg-racing-yellow rounded-full ml-4"></div>
                    <span>Baseline</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="font-mono">{analysis.totalTime}</span>
                  <span className="text-gray-400">|</span>
                  <span className="font-mono text-racing-yellow">1:21.892</span>
                  <span className="text-racing-red">+1.564</span>
                </div>
              </div>
            </div>

            {/* Video Players */}
            <div className={`grid h-96 ${analysis.comparisonFormat === 'side-by-side' ? 'lg:grid-cols-2' : ''}`}>
              {/* User's Lap */}
              <div className="bg-racing-black relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                    alt="Racing simulator cockpit view" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button className="w-16 h-16 bg-racing-green rounded-full flex items-center justify-center text-racing-black hover:bg-green-400 transition-colors">
                      <Play size={24} />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-racing-dark/90 px-3 py-1 rounded text-sm">
                  Your Lap
                </div>
              </div>

              {/* Baseline Lap */}
              {analysis.comparisonFormat === 'side-by-side' && (
                <div className="bg-racing-black relative border-l border-racing-gray">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                      alt="Professional racing driver" 
                      className="w-full h-full object-cover opacity-80" 
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button className="w-16 h-16 bg-racing-yellow rounded-full flex items-center justify-center text-racing-black hover:bg-yellow-400 transition-colors">
                        <Play size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-racing-dark/90 px-3 py-1 rounded text-sm">
                    Professional Baseline
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="px-6 py-4 bg-racing-gray border-t border-racing-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button className="w-10 h-10 bg-racing-dark rounded-lg flex items-center justify-center hover:bg-racing-light transition-colors p-0">
                    <Play className="text-racing-green" size={16} />
                  </Button>
                  <Button className="w-10 h-10 bg-racing-dark rounded-lg flex items-center justify-center hover:bg-racing-light transition-colors p-0">
                    <Pause className="text-gray-400" size={16} />
                  </Button>
                  <Button className="w-10 h-10 bg-racing-dark rounded-lg flex items-center justify-center hover:bg-racing-light transition-colors p-0">
                    <RotateCcw className="text-gray-400" size={16} />
                  </Button>
                </div>
                
                <div className="flex-1 mx-6">
                  <div className="bg-racing-dark rounded-full h-2 relative">
                    <div className="bg-racing-green h-2 rounded-full w-1/3"></div>
                    <div className="absolute top-0 left-1/3 w-4 h-4 bg-racing-green rounded-full -mt-1 cursor-pointer"></div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm font-mono">
                  <span>0:34</span>
                  <span className="text-gray-400">/</span>
                  <span>1:23</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Telemetry Data */}
          <TelemetryDisplay analysis={analysis} />
        </div>
      </div>
    </section>
  );
}
