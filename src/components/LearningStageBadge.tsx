import { Badge } from "@/components/ui/badge";
import {
  STAGE_LABELS,
  type LearningStage,
} from "@/lib/learningProgress";

interface LearningStageBadgeProps {
  stage: LearningStage;
}

const STAGE_COLORS: Record<LearningStage, string> = {
  penginderaan: "bg-white/20 text-white border-white/30",
  perenungan: "bg-white/20 text-white border-white/30",
  mainake: "bg-white/20 text-white border-white/30",
};

export function LearningStageBadge({ stage }: LearningStageBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${STAGE_COLORS[stage]}`}
    >
      {STAGE_LABELS[stage]}
    </Badge>
  );
}
