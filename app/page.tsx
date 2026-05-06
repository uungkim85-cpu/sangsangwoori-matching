import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const cards = [
  {
    href: "/register",
    title: "프로필 등록",
    description: "이름, 지역, 희망 직종, 경력을 입력하고 일자리 매칭을 시작하세요.",
    label: "등록하러 가기",
  },
  {
    href: "/recommendations",
    title: "추천 일자리",
    description: "내 프로필에 맞는 일자리를 자동으로 추천해 드립니다.",
    label: "추천 보기",
  },
  {
    href: "/admin",
    title: "담당자 대시보드",
    description: "매칭 현황을 확인하고 배정을 관리합니다.",
    label: "대시보드 열기",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">상상우리 매칭 서비스</h1>
        <p className="text-xl text-gray-600">시니어와 일자리를 자동으로 연결해 드립니다.</p>
      </section>

      <div className="grid gap-6 sm:grid-cols-3">
        {cards.map(({ href, title, description, label }) => (
          <Card key={href} className="flex flex-col">
            <CardHeader className="flex-1 space-y-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription className="text-base">{description}</CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <Link href={href} className="block">
                <Button className="w-full text-lg py-6">{label}</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
