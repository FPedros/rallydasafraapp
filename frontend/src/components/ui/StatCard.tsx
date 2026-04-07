import { Badge } from "./Badge";
import { Card } from "./Card";

export const StatCard = ({
  label,
  value,
  status,
  detail
}: {
  label: string;
  value: string;
  status?: "normal" | "warning" | "critical";
  detail?: string;
}) => (
  <Card className="space-y-3">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-text/70">{label}</p>
      {status ? <Badge variant={status}>{status}</Badge> : null}
    </div>
    <p className="text-2xl font-bold text-dark">{value}</p>
    {detail ? <p className="text-sm text-text/70">{detail}</p> : null}
  </Card>
);
