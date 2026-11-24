import { Suspense } from "react";
import ResultsView from "@/components/results/ResultsView";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="h-12 border-b border-stroke bg-surface" />}>
      <ResultsView />
    </Suspense>
  );
}
