"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

type MatchData = {
  score: number;
  jobs: { title: string; region: string; job_type: string; company_name: string } | null;
};

export default function RecommendationsPage() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      const profileId = localStorage.getItem("profile_id");
      if (!profileId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('matches')
        .select(`
          score,
          jobs ( title, region, job_type, company_name )
        `)
        .eq('profile_id', profileId)
        .order('score', { ascending: false });

      if (!error && data) {
        setMatches(data as unknown as MatchData[]);
      }
      setLoading(false);
    }
    fetchMatches();
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">추천 일자리</h1>
        <p className="text-lg text-gray-600">내 프로필과 가장 잘 맞는 일자리를 점수 순으로 보여 드립니다.</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-base font-medium text-gray-700">필터:</span>
        <Badge variant="outline" className="text-base px-3 py-1 cursor-pointer">전체</Badge>
        <Badge variant="outline" className="text-base px-3 py-1 cursor-pointer">지역</Badge>
        <Badge variant="outline" className="text-base px-3 py-1 cursor-pointer">직종</Badge>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 py-8">불러오는 중...</p>
        ) : matches.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="text-xl text-gray-400 text-center py-8">
                등록된 프로필이 없거나 매칭 결과가 없습니다.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-gray-400 text-center pb-4">
                먼저 프로필을 등록해 주세요.
              </p>
            </CardContent>
          </Card>
        ) : (
          matches.map((match, i) => (
            <Card key={i}>
              <CardContent className="flex items-center justify-between py-5 px-6">
                <div className="space-y-1">
                  <p className="text-xl font-semibold text-gray-800">{match.jobs?.title}</p>
                  <p className="text-base text-gray-500">
                    {match.jobs?.company_name} · {match.jobs?.region} · {match.jobs?.job_type}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="text-base px-3 py-1 bg-green-100 text-green-800 hover:bg-green-100 border-none">
                    매칭 점수: {match.score}점
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
