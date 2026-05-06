import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">추천 일자리</h1>
        <p className="text-lg text-gray-600">내 프로필과 가장 잘 맞는 일자리를 점수 순으로 보여 드립니다.</p>
      </div>

      {/* 필터 영역 (추후 구현) */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-base font-medium text-gray-700">필터:</span>
        <Badge variant="outline" className="text-base px-3 py-1 cursor-pointer">전체</Badge>
        <Badge variant="outline" className="text-base px-3 py-1 cursor-pointer">지역</Badge>
        <Badge variant="outline" className="text-base px-3 py-1 cursor-pointer">직종</Badge>
      </div>

      {/* 추천 목록 자리 */}
      <div className="space-y-4">
        <Card className="border-dashed border-2 border-gray-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-400 text-center py-8">
              매칭 결과가 여기에 표시됩니다.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-400 text-center pb-4">
              프로필을 등록하면 자동으로 일자리가 추천됩니다.
            </p>
          </CardContent>
        </Card>

        {/* 목록 아이템 예시 자리 (점수 내림차순) */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="opacity-30 pointer-events-none">
            <CardContent className="flex items-center justify-between py-5 px-6">
              <div className="space-y-1">
                <p className="text-xl font-semibold text-gray-800">일자리 제목 {i}</p>
                <p className="text-base text-gray-500">지역 · 직종</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="text-base px-3 py-1">점수: —</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
        ※ 기능 구현 예정 — 현재는 뼈대 화면입니다.
      </p>
    </div>
  );
}
