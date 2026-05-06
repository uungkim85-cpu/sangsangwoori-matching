import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">프로필 등록</h1>
        <p className="text-lg text-gray-600">정보를 입력하시면 맞는 일자리를 찾아 드립니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">기본 정보</CardTitle>
          <CardDescription className="text-base">* 표시 항목은 필수 입력입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-lg font-medium text-gray-800">
                이름 *
              </label>
              <Input
                id="name"
                name="name"
                placeholder="홍길동"
                className="text-lg h-14 px-4"
                disabled
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="region" className="text-lg font-medium text-gray-800">
                거주 지역 *
              </label>
              <Input
                id="region"
                name="region"
                placeholder="예: 서울시 강남구"
                className="text-lg h-14 px-4"
                disabled
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="desired_job" className="text-lg font-medium text-gray-800">
                희망 직종 *
              </label>
              <Input
                id="desired_job"
                name="desired_job"
                placeholder="예: 경비원, 청소원, 요양보호사"
                className="text-lg h-14 px-4"
                disabled
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="career_years" className="text-lg font-medium text-gray-800">
                경력 연수 *
              </label>
              <Input
                id="career_years"
                name="career_years"
                type="number"
                placeholder="예: 5"
                min={0}
                className="text-lg h-14 px-4"
                disabled
              />
            </div>

            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
              ※ 기능 구현 예정 — 현재는 뼈대 화면입니다.
            </p>

            <Button
              type="submit"
              size="lg"
              className="w-full text-xl py-7 font-bold"
              disabled
            >
              등록하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
