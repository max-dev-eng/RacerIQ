import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { LapAnalysis } from "RacerIQ/src/shared/schema";

interface TelemetryDisplayProps {
  analysis: LapAnalysis;
}

export default function TelemetryDisplay({ analysis }: TelemetryDisplayProps) {
  const telemetry = analysis.telemetryData as any;

  return (
    <Card className="racing-card">
      <CardContent className="p-6">
        <h4 className="text-xl font-semibold mb-6 flex items-center">
          <TrendingUp className="text-racing-green mr-3" size={20} />
          Telemetry Analysis
        </h4>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Throttle */}
          <div className="bg-racing-gray rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Throttle Input</span>
              <span className="text-xs text-gray-400">%</span>
            </div>
            <div className="h-24 bg-racing-black rounded relative overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-racing-green/50 to-racing-green/20 rounded"
                style={{ height: `${(telemetry?.throttle?.your || 89) / 100 * 96}px` }}
              ></div>
              <div 
                className="absolute bottom-0 left-0 w-3/4 bg-gradient-to-t from-racing-yellow/50 to-racing-yellow/20 rounded"
                style={{ height: `${(telemetry?.throttle?.baseline || 94) / 100 * 96}px` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Your: {telemetry?.throttle?.your || 89}%</span>
              <span>Base: {telemetry?.throttle?.baseline || 94}%</span>
            </div>
          </div>

          {/* Brake */}
          <div className="bg-racing-gray rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Brake Pressure</span>
              <span className="text-xs text-gray-400">%</span>
            </div>
            <div className="h-24 bg-racing-black rounded relative overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-racing-red/50 to-racing-red/20 rounded"
                style={{ height: `${(telemetry?.brake?.your || 95) / 100 * 96}px` }}
              ></div>
              <div 
                className="absolute bottom-0 left-0 w-4/5 bg-gradient-to-t from-racing-yellow/50 to-racing-yellow/20 rounded"
                style={{ height: `${(telemetry?.brake?.baseline || 88) / 100 * 96}px` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Your: {telemetry?.brake?.your || 95}%</span>
              <span>Base: {telemetry?.brake?.baseline || 88}%</span>
            </div>
          </div>

          {/* Speed */}
          <div className="bg-racing-gray rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Speed</span>
              <span className="text-xs text-gray-400">km/h</span>
            </div>
            <div className="h-24 bg-racing-black rounded relative overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-500/50 to-blue-500/20 rounded"
                style={{ height: `${Math.min((telemetry?.speed?.your || 287) / 300 * 96, 96)}px` }}
              ></div>
              <div 
                className="absolute bottom-0 left-0 w-5/6 bg-gradient-to-t from-racing-yellow/50 to-racing-yellow/20 rounded"
                style={{ height: `${Math.min((telemetry?.speed?.baseline || 294) / 300 * 96, 96)}px` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Your: {telemetry?.speed?.your || 287}</span>
              <span>Base: {telemetry?.speed?.baseline || 294}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
