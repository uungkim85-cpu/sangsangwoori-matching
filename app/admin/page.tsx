import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    key: "unmatched",
    label: "미매칭",
    badgeVariant: "destructive" as const,
    description: "아직 매칭되지 않은 시니어 목록입니다.",
    count: 0,
  },
  {
    key: "pending",
    label: "매칭 대기",
    badgeVariant: "secondary" as const,
    description: "매칭 후 배정 확인을 기다리는 목록입니다.",
    count: 0,
  },
  {
    key: "assigned",
    label: "배정 완료",
    badgeVariant: "default" as const,
    description: "배정이 완료된 매칭 목록입니다.",
    count: 0,
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">담당자 대시보드</h1>
        <p className="text-lg text-gray-600">매칭 현황을 한눈에 확인하고 관리합니다.</p>
      </div>

      {/* 요약 카운트 행 */}
      <div className="grid grid-cols-3 gap-4">
        {sections.map(({ key, label, badgeVariant, count }) => (
          <Card key={key} className="text-center">
            <CardHeader className="pb-2">
              <Badge variant={badgeVariant} className="mx-auto text-base px-3 py-1">
                {label}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-800">{count}</p>
              <p className="text-base text-gray-500 mt-1">건</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 각 섹션 */}
      {sections.map(({ key, label, badgeVariant, description }) => (
        <section key={key} className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-800">{label}</h2>
            <Badge variant={badgeVariant} className="text-base px-3 py-1">0건</Badge>
          </div>
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="py-8 text-center space-y-2">
              <p className="text-lg text-gray-400">{description}</p>
              <p className="text-base text-gray-400">현재 항목이 없습니다.</p>
            </CardContent>
          </Card>
        </section>
      ))}

      <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
        ※ 기능 구현 예정 — 현재는 뼈대 화면입니다.
      </p>
    </div>
  );
}
