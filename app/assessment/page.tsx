import type { Metadata } from "next";

import { AssessmentStudio } from "@/components/assessment-studio";

export const metadata: Metadata = {
  title: "Assessment",
  description:
    "Practice investment banking interviews with an AI voice coach. Run live mocks, get transcript-backed feedback, and see your readiness score.",
};

export default function AssessmentPage() {
  return <AssessmentStudio />;
}
