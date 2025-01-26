"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VideoIcon, Upload, Youtube, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface AnalysisResults {
  transcript?: string;
  summary?: string;
  keywords?: string[];
  sponsorInfo?: {
    hasSponsoredContent: boolean;
    sponsoredSegments: Array<{ start: number; end: number; content: string }>;
  };
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<AnalysisResults>({});

  const handleAnalyze = async () => {
    if (!videoUrl) {
      toast.error("Please enter a video URL");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
      toast.success("Analysis completed successfully");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze video");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <VideoIcon className="h-12 w-12 text-primary mr-2" />
            <h1 className="text-4xl font-bold">VideoInsight Pro</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your videos into actionable insights with AI-powered analysis,
            transcription, and SEO optimization.
          </p>
        </div>

        {/* Main Content */}
        <Card className="max-w-3xl mx-auto p-6">
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="url">
                <Youtube className="mr-2 h-4 w-4" />
                Video URL
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter YouTube, Vimeo, or Wistia video URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  <Button
                    onClick={handleAnalyze}
                    disabled={!videoUrl || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Analyze"
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Supported platforms: YouTube, Vimeo, Wistia
                </p>
              </div>
            </TabsContent>

            <TabsContent value="upload">
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Drag and drop your video
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Or click to select a file (MP4, MOV, AVI up to 2GB)
                </p>
                <Button variant="outline">Select File</Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Results Section */}
          {(results.transcript || results.summary || results.keywords) && (
            <div className="mt-8 space-y-6">
              <Tabs defaultValue="transcript-tab" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6">
                  <TabsTrigger value="transcript-tab">Transcription</TabsTrigger>
                  <TabsTrigger value="summary-tab">Summary & Key Points</TabsTrigger>
                  {results.keywords && results.keywords.length > 0 && (
                    <TabsTrigger value="keywords-tab">Key Topics</TabsTrigger>
                  )}
                  {results.sponsorInfo && (
                    <TabsTrigger value="sponsor-tab">Sponsor Info</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="transcript-tab">
                  {results.transcript && (
                    <Card className="p-4">
                      <h3 className="text-lg font-semibold mb-2">Transcription</h3>
                      <div className="text-muted-foreground" style={{ whiteSpace: 'pre-line' }}>{results.transcript}</div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="summary-tab">
                  {results.summary && (
                    <Card className="p-4">
                      <h3 className="text-lg font-semibold mb-2">Summary with Key Learning Points</h3>
                      <div className="text-muted-foreground" style={{ whiteSpace: 'pre-line' }}>{results.summary}</div>
                    </Card>
                  )}
                </TabsContent>

                {results.keywords && results.keywords.length > 0 && (
                  <TabsContent value="keywords-tab">
                    <Card className="p-4">
                      <h3 className="text-lg font-semibold mb-2">Key Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {results.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-secondary rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>
                )}

                {results.sponsorInfo && (
                  <TabsContent value="sponsor-tab">
                    <Card className="p-4">
                      <h3 className="text-lg font-semibold mb-2">Sponsored Content</h3>
                      {results.sponsorInfo.hasSponsoredContent ? (
                        <div className="space-y-2">
                          {results.sponsorInfo.sponsoredSegments.map((segment, index) => (
                            <div key={index} className="p-2 bg-secondary rounded">
                              <p className="text-sm">
                                {`${Math.floor(segment.start / 60)}:${(segment.start % 60).toString().padStart(2, '0')} -
                                 ${Math.floor(segment.end / 60)}:${(segment.end % 60).toString().padStart(2, '0')}`}
                              </p>
                              <p className="text-muted-foreground">{segment.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No sponsored content detected</p>
                      )}
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}
        </Card>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Transcription</h3>
            <p className="text-muted-foreground">
              99% accurate transcripts with speaker diarization and timestamps.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Smart Summaries</h3>
            <p className="text-muted-foreground">
              AI-generated summaries with key takeaways and actionable insights.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">SEO Keywords</h3>
            <p className="text-muted-foreground">
              Extract relevant keywords and get search volume estimates.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
