"use client";

import { useState } from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  iconColor: string;
}

interface InteractiveFeaturesProps {
  features: Feature[];
}

export default function InteractiveFeatures({
  features,
}: InteractiveFeaturesProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="card p-8 cursor-pointer group"
          onMouseEnter={() => setHoveredFeature(index)}
          onMouseLeave={() => setHoveredFeature(null)}
        >
          <div
            className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.iconColor}`}
          >
            {feature.icon}
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary-600 transition-colors">
            {feature.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {feature.description}
          </p>
          <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform">
            Learn More
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
