import type { Metadata } from "next";

import { MockInterviewStudio } from "@/components/mock-interview-studio";

export const metadata: Metadata = {
  title: "Mock Interview",
  description:
    "Practice investment banking interviews with an AI interviewer. Run live mock interviews and get concise coach notes plus your next rep.",
};

export default function MockInterviewPage() {
  return <MockInterviewStudio />;
}
