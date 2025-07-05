import { FlagIcon, PlayIcon, RocketIcon } from "lucide-react";
import UploadSection from "@/components/upload-section";
import VideoComparison from "@/components/video-comparison";
import TrackAnalysis from "@/components/track-analysis";
import TrackLearning from "@/components/track-learning";
import AICoaching from "@/components/ai-coaching";
import { useState } from "react";
import type { LapAnalysis } from "RacerIQ/src/shared/schema";

export default function Home() {
  const [currentAnalysis, setCurrentAnalysis] = useState<LapAnalysis | null>(null);

  return (
    <div className="min-h-screen bg-racing-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-racing-dark border-b border-racing-gray">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-racing-green rounded-lg flex items-center justify-center">
                <FlagIcon className="text-racing-black" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-racing-green">RacerIQ</h1>
                <p className="text-xs text-gray-400">AI Racing Coach</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#upload" className="text-gray-300 hover:text-racing-green transition-colors">Upload</a>
              <a href="#analysis" className="text-gray-300 hover:text-racing-green transition-colors">Analysis</a>
              <a href="#tracks" className="text-gray-300 hover:text-racing-green transition-colors">Tracks</a>
              <button className="racing-button-primary">
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Professional racing scene" 
            className="w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-racing-black via-racing-dark/90 to-racing-black"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Your Personal <span className="text-racing-green">AI Racing Coach</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              RacerIQ analyzes your sim racing performance against professional baselines, providing AI-powered feedback to help you achieve faster lap times on challenging circuits.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button 
                className="bg-racing-dark border-racing-gray hover:bg-racing-light hover:border-racing-green cursor-pointer rounded-lg px-6 py-3 border transition-colors"
                onClick={() => {
                  const uploadElement = document.getElementById('upload');
                  uploadElement?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <PlayIcon className="mr-2 inline text-racing-green" size={16} />
                <span className="text-sm">Video Analysis</span>
              </button>
              <button 
                className="bg-racing-dark border-racing-gray hover:bg-racing-light hover:border-racing-green cursor-pointer rounded-lg px-6 py-3 border transition-colors"
                onClick={() => {
                  const uploadElement = document.getElementById('upload');
                  uploadElement?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <svg className="w-4 h-4 mr-2 inline text-racing-green" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span className="text-sm">Telemetry Data</span>
              </button>
              <button 
                className="bg-racing-dark border-racing-gray hover:bg-racing-light hover:border-racing-green cursor-pointer rounded-lg px-6 py-3 border transition-colors"
                onClick={() => {
                  const trackElement = document.getElementById('track-analysis');
                  trackElement?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <svg className="w-4 h-4 mr-2 inline text-racing-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Track Analysis</span>
              </button>
              <button 
                className={`rounded-lg px-6 py-3 border transition-colors ${
                  currentAnalysis 
                    ? "bg-racing-dark border-racing-gray hover:bg-racing-light hover:border-racing-green cursor-pointer" 
                    : "bg-racing-gray border-racing-gray opacity-50 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (!currentAnalysis) return;
                  const coachingElement = document.querySelector('section') as HTMLElement;
                  if (coachingElement && coachingElement.textContent?.includes('Coaching')) {
                    coachingElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                disabled={!currentAnalysis}
              >
                <RocketIcon className={`mr-2 inline ${currentAnalysis ? "text-racing-green" : "text-gray-500"}`} size={16} />
                <span className="text-sm">AI Coaching</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <UploadSection onAnalysisComplete={setCurrentAnalysis} />

      {/* Track Learning Section */}
      <TrackLearning />

      {/* Analysis Sections - only show if analysis exists */}
      {currentAnalysis && (
        <>
          <VideoComparison analysis={currentAnalysis} />
          <TrackAnalysis analysis={currentAnalysis} />
          <AICoaching analysis={currentAnalysis} />
        </>
      )}

      {/* Footer */}
      <footer className="bg-racing-dark border-t border-racing-gray py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-racing-green rounded-lg flex items-center justify-center">
                    <FlagIcon className="text-racing-black" size={16} />
                  </div>
                  <span className="text-xl font-bold text-racing-green">RacerIQ</span>
                </div>
                <p className="text-gray-400 text-sm">
                  AI-powered racing coach helping sim racers achieve their best lap times through professional analysis and personalized feedback.
                </p>
              </div>
              
              <div>
                <h5 className="font-semibold mb-4">Supported Tracks</h5>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Austrian GP - Red Bull Ring</li>
                  <li>• Nürburgring - Nordschleife</li>
                  <li>• Monza - Italy</li>
                  <li>• Spa-Francorchamps - Belgium</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold mb-4">Features</h5>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Video Comparison Analysis</li>
                  <li>• Telemetry Data Overlay</li>
                  <li>• Interactive Track Maps</li>
                  <li>• AI Coaching Feedback</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold mb-4">Get Started</h5>
                <p className="text-gray-400 text-sm mb-4">
                  Upload your first lap video and start improving your racing performance today.
                </p>
                <button className="racing-button-primary w-full">
                  Start Analysis
                </button>
              </div>
            </div>
            
            <div className="border-t border-racing-gray mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 RacerIQ. Designed for sim racing enthusiasts worldwide.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
