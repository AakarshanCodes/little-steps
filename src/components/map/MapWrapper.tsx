"use client";

import dynamic from 'next/dynamic';

// Dynamically import the CentersMap component with SSR disabled
const DynamicCentersMap = dynamic(() => import('./CentersMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-muted">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
});

interface MapWrapperProps {
  centers: any[];
}

export default function MapWrapper({ centers }: MapWrapperProps) {
  return <DynamicCentersMap centers={centers} />;
}
