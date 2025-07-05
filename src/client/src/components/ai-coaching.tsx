import { Bot, AlertTriangle, ThumbsUp, Lightbulb, Headphones, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LapAnalysis } from "RacerIQ/src/shared/schema";

interface AICoachingProps {
  analysis: LapAnalysis;
}

export default function AICoaching({ analysis }: AICoachingProps) {
  const suggestions = analysis.aiSuggestions as any[];
  
  const strengths = [
    "Excellent speed maintenance through Sector 1 fast corners",
    "Consistent braking points in the final sector",
    "Good car control under heavy braking zones"
  ];

  const quickTips = [
    "Practice trail braking in Turn 4 during warmup laps",
    "Focus on smooth throttle application in Sector 2",
    "Use racing line markers to improve chicane approach",
    "Review telemetry data before your next session"
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">AI Coaching Feedback</h3>
            <p className="text-gray-400">Personalized recommendations to improve your lap times</p>
          </div>

          <Card className="racing-card">
            <CardContent className="p-8">
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-racing-green rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Bot className="text-racing-black" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-racing-green mb-2">RacerIQ Coach Analysis</h4>
                  <p className="text-gray-400">Based on your Austrian GP lap performance</p>
                </div>
              </div>

              {/* Priority Areas for Improvement */}
              <div className="mb-8">
                <h5 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertTriangle className="text-racing-yellow mr-2" size={20} />
                  Priority Areas for Improvement
                </h5>
                
                <div className="space-y-4">
                  {suggestions?.map((suggestion, index) => (
                    <div key={index} className="bg-racing-gray rounded-lg p-4 flex items-start">
                      <div className="w-8 h-8 bg-racing-yellow rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-racing-black font-bold text-sm">
                        {suggestion.priority}
                      </div>
                      <div>
                        <h6 className="font-medium mb-1">{suggestion.title}</h6>
                        <p className="text-sm text-gray-400">{suggestion.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div className="mb-8">
                <h5 className="text-lg font-semibold mb-4 flex items-center">
                  <ThumbsUp className="text-racing-green mr-2" size={20} />
                  Your Strengths
                </h5>
                
                <div className="space-y-3">
                  {strengths.map((strength, index) => (
                    <div key={index} className="bg-racing-gray rounded-lg p-4 flex items-center">
                      <div className="w-6 h-6 bg-racing-green rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-4 h-4 text-racing-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-racing-gray rounded-lg p-6">
                <h5 className="text-lg font-semibold mb-4 flex items-center">
                  <Lightbulb className="text-racing-green mr-2" size={20} />
                  Quick Tips for Next Session
                </h5>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {quickTips.map((tip, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-racing-green mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audio Coaching Feature */}
          <Card className="racing-card mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold flex items-center">
                  <Headphones className="text-racing-green mr-3" size={20} />
                  Audio Coaching
                </h4>
                <Button className="racing-button-primary">
                  <Play className="mr-2" size={16} />
                  Listen to Feedback
                </Button>
              </div>
              <p className="text-gray-400 text-sm">
                Get your personalized coaching feedback delivered through text-to-speech synthesis. Perfect for reviewing while practicing in the simulator.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
