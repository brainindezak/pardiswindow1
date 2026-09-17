import type { Metadata } from "next";
import { WindowThreshold } from "@/components/home/WindowThreshold";
import { ProductStudio } from "@/components/products/ProductStudio";
import { MaterialObservatory } from "@/components/home/MaterialObservatory";
import { ProductionPulse } from "@/components/home/ProductionPulse";
import { QualityScanner } from "@/components/home/QualityScanner";
import { ProjectLightArchive } from "@/components/home/ProjectLightArchive";
import { ConsultationPortal } from "@/components/home/ConsultationPortal";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <WindowThreshold />
      <ProductStudio />
      <MaterialObservatory />
      <ProductionPulse />
      <QualityScanner />
      <ProjectLightArchive />
      <ConsultationPortal />
    </>
  );
}
