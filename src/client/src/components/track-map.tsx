import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Track } from "RacerIQ/src/shared/schema";

interface TrackMapProps {
  trackId: number;
  sectorTimes: any[];
}

export default function TrackMap({ trackId, sectorTimes }: TrackMapProps) {
  const [selectedSector, setSelectedSector] = useState<number | null>(null);

  const { data: track } = useQuery<Track>({
    queryKey: [`/api/tracks/${trackId}`],
  });

  const getSectorColor = (sectorId: number) => {
    const sector = sectorTimes?.find(s => s.sector === sectorId);
    return sector?.status === 'faster' ? '#00FF88' : '#FFD700';
  };

  const handleSectorClick = (sectorId: number) => {
    setSelectedSector(selectedSector === sectorId ? null : sectorId);
  };

  if (!track?.mapData) {
    return (
      <div className="bg-racing-black rounded-lg p-8 h-80 flex items-center justify-center">
        <p className="text-gray-400">Track map not available</p>
      </div>
    );
  }

  const mapData = track.mapData as any;

  return (
    <div className="relative bg-racing-black rounded-lg p-8 h-80">
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Track outline */}
        <path 
          d="M50,150 Q100,50 200,80 Q300,100 350,150 Q320,200 250,220 Q150,240 100,200 Q70,180 50,150 Z" 
          fill="none" 
          stroke="var(--racing-light)" 
          strokeWidth="12" 
        />
        
        {/* Sector paths */}
        {mapData.sectors?.map((sector: any) => (
          <path
            key={sector.id}
            d={sector.path}
            fill="none"
            stroke={getSectorColor(sector.id)}
            strokeWidth="8"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleSectorClick(sector.id)}
          />
        ))}
        
        {/* Start/Finish Line */}
        <line x1="50" y1="140" x2="50" y2="160" stroke="white" strokeWidth="3"/>
        <text x="55" y="155" fill="white" fontSize="10" fontFamily="Inter">S/F</text>
        
        {/* Sector markers */}
        <circle cx="200" cy="80" r="4" fill={getSectorColor(1)}/>
        <text x="190" y="75" fill={getSectorColor(1)} fontSize="10" fontFamily="Inter">S1</text>
        
        <circle cx="250" cy="220" r="4" fill={getSectorColor(2)}/>
        <text x="240" y="235" fill={getSectorColor(2)} fontSize="10" fontFamily="Inter">S2</text>
        
        <circle cx="100" cy="200" r="4" fill={getSectorColor(3)}/>
        <text x="85" y="215" fill={getSectorColor(3)} fontSize="10" fontFamily="Inter">S3</text>
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-racing-dark/90 rounded-lg p-3">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-racing-green rounded-full mr-2"></div>
            <span>Faster</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-racing-yellow rounded-full mr-2"></div>
            <span>Slower</span>
          </div>
        </div>
      </div>

      {/* Sector details popup */}
      {selectedSector && (
        <div className="absolute top-4 right-4 bg-racing-dark/95 rounded-lg p-4 border border-racing-light">
          <h5 className="font-semibold mb-2">Sector {selectedSector}</h5>
          {sectorTimes?.find(s => s.sector === selectedSector) && (
            <div className="text-sm space-y-1">
              <div>Time: {sectorTimes.find(s => s.sector === selectedSector)?.time}s</div>
              <div>Baseline: {sectorTimes.find(s => s.sector === selectedSector)?.baseline}s</div>
              <div className={`font-mono ${
                sectorTimes.find(s => s.sector === selectedSector)?.status === 'faster' 
                  ? 'text-racing-green' 
                  : 'text-racing-yellow'
              }`}>
                {sectorTimes.find(s => s.sector === selectedSector)?.delta > 0 ? '+' : ''}
                {sectorTimes.find(s => s.sector === selectedSector)?.delta.toFixed(3)}s
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
