"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

const REGIONS = ["서울", "경기", "인천", "기타"];
const JOB_TYPES = ["경비", "청소", "조리", "돌봄", "기타"];

type MatchData = {
  id: string;
  status: string;
  score: number;
  profiles: { name: string; region: string; desired_job: string } | null;
  jobs: { title: string; company_name: string; region: string } | null;
};

type JobData = {
  id: string;
  title: string;
  region: string;
  job_type: string;
  required_career_years: number;
};

type JobForm = { title: string; region: string; job_type: string; required_career_years: string };
type JobErrors = Partial<Record<"title" | "region" | "job_type", string>>;

const STATUS_NEXT: Record<string, { label: string; next: string }> = {
  unmatched: { label: "매칭 확정", next: "pending" },
  pending: { label: "배정 완료", next: "assigned" },
  assigned: { label: "배정 취소", next: "unmatched" },
};

export default function AdminPage() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [matchLoading, setMatchLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const [jobs, setJobs] = useState<JobData[]>([]);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobForm, setJobForm] = useState<JobForm>({ title: "", region: "", job_type: "", required_career_years: "" });
  const [jobErrors, setJobErrors] = useState<JobErrors>({});
  const [jobSaving, setJobSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select(`id, status, score, profiles ( name, region, desired_job ), jobs ( title, company_name, region )`)
      .order("score", { ascending: false });
    if (!error && data) setMatches(data as unknown as MatchData[]);
    setMatchLoading(false);
  }

  async function fetchJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select("id, title, region, job_type, required_career_years")
      .order("created_at", { ascending: false });
    if (!error && data) setJobs(data as JobData[]);
    setJobLoading(false);
  }

  useEffect(() => { fetchMatches(); fetchJobs(); }, []);

  async function updateMatchStatus(id: string, nextStatus: string) {
    setUpdating(id);
    await supabase.from("matches").update({ status: nextStatus }).eq("id", id);
    await fetchMatches();
    setUpdating(null);
  }

  function setJobField(field: keyof JobForm, value: string) {
    setJobForm(prev => ({ ...prev, [field]: value }));
    if (jobErrors[field as keyof JobErrors]) setJobErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function validateJob(): boolean {
    const next: JobErrors = {};
    if (!jobForm.title.trim()) next.title = "공고명을 입력해 주세요.";
    if (!jobForm.region) next.region = "지역을 선택해 주세요.";
    if (!jobForm.job_type) next.job_type = "직종을 선택해 주세요.";
    setJobErrors(next);
    return Object.keys(next).length === 0;
  }

  async function addJob(e: React.FormEvent) {
    e.preventDefault();
    if (!validateJob()) return;
    setJobSaving(true);
    const { error } = await supabase.from("jobs").insert({
      title: jobForm.title.trim(),
      region: jobForm.region,
      job_type: jobForm.job_type,
      required_career_years: parseInt(jobForm.required_career_years) || 0,
    });
    if (error) {
      alert("저장 중 오류가 발생했습니다: " + error.message);
    } else {
      setJobForm({ title: "", region: "", job_type: "", required_career_years: "" });
      setJobErrors({});
      await fetchJobs();
    }
    setJobSaving(false);
  }

  async function deleteJob(id: string) {
    if (!confirm("이 일자리를 삭제하시겠습니까?")) return;
    setDeletingId(id);
    await supabase.from("jobs").delete().eq("id", id);
    await fetchJobs();
    setDeletingId(null);
  }

  const getCount = (status: string) => matches.filter(m => m.status === status).length;

  const sections = [
    { key: "unmatched", label: "미매칭", badgeVariant: "destructive" as const, count: getCount("unmatched") },
    { key: "pending", label: "매칭 대기", badgeVariant: "secondary" as const, count: getCount("pending") },
    { key: "assigned", label: "배정 완료", badgeVariant: "default" as const, count: getCount("assigned") },
  ];

  return (
    <div className="space-y-10">

      {/* ── 매칭 현황 ── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">담당자 대시보드</h1>
          <p className="text-lg text-gray-600">매칭 현황을 한눈에 확인하고 관리합니다.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {sections.map(({ key, label, badgeVariant, count }) => (
            <Card key={key} className="text-center">
              <CardHeader className="pb-2">
                <Badge variant={badgeVariant} className="mx-auto text-base px-3 py-1">{label}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-gray-800">{matchLoading ? "-" : count}</p>
                <p className="text-base text-gray-500 mt-1">건</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {sections.map(({ key, label, badgeVariant }) => {
          const list = matches.filter(m => m.status === key);
          return (
            <section key={key} className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">{label}</h2>
                <Badge variant={badgeVariant} className="text-base px-3 py-1">{list.length}건</Badge>
              </div>
              {list.length === 0 ? (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="py-8 text-center text-lg text-gray-400">현재 항목이 없습니다.</CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {list.map(match => (
                    <Card key={match.id}>
                      <CardContent className="flex items-center justify-between py-4 px-6">
                        <div className="space-y-1">
                          <p className="text-lg font-semibold">{match.profiles?.name} ({match.profiles?.region})</p>
                          <p className="text-sm text-gray-500">희망: {match.profiles?.desired_job}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-base font-medium text-blue-700">{match.jobs?.title}</p>
                          <p className="text-sm text-gray-500">{match.jobs?.region}</p>
                          <p className="text-xs text-gray-400">매칭 점수: {match.score}점</p>
                        </div>
                        <Button
                          size="sm"
                          variant={match.status === "assigned" ? "outline" : "default"}
                          className="ml-4 shrink-0"
                          disabled={updating === match.id}
                          onClick={() => updateMatchStatus(match.id, STATUS_NEXT[match.status]?.next ?? "unmatched")}
                        >
                          {updating === match.id ? "처리 중..." : STATUS_NEXT[match.status]?.label}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </section>

      {/* ── 일자리 관리 ── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-gray-900">일자리 관리</h2>
          <p className="text-lg text-gray-600">일자리를 등록하고 관리합니다.</p>
        </div>

        {/* 일자리 추가 폼 */}
        <Card>
          <CardContent className="pt-6">
            <form className="space-y-5" onSubmit={addJob}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <JobField label="공고명 *" error={jobErrors.title}>
                  <Input
                    placeholder="예: 아파트 경비원"
                    className="text-lg h-14 px-4"
                    value={jobForm.title}
                    onChange={e => setJobField("title", e.target.value)}
                    disabled={jobSaving}
                  />
                </JobField>

                <JobField label="지역 *" error={jobErrors.region}>
                  <Select
                    value={jobForm.region}
                    onChange={e => setJobField("region", e.target.value)}
                    disabled={jobSaving}
                  >
                    <option value="">-- 선택하세요 --</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </Select>
                </JobField>

                <JobField label="직종 *" error={jobErrors.job_type}>
                  <Select
                    value={jobForm.job_type}
                    onChange={e => setJobField("job_type", e.target.value)}
                    disabled={jobSaving}
                  >
                    <option value="">-- 선택하세요 --</option>
                    {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
                  </Select>
                </JobField>

                <JobField label="요구 경력 (년)">
                  <Input
                    type="number"
                    placeholder="예: 2"
                    min={0}
                    className="text-lg h-14 px-4"
                    value={jobForm.required_career_years}
                    onChange={e => setJobField("required_career_years", e.target.value)}
                    disabled={jobSaving}
                  />
                </JobField>
              </div>

              <Button type="submit" className="text-lg px-8 py-6 font-bold" disabled={jobSaving}>
                {jobSaving ? "저장 중..." : "일자리 추가"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 일자리 목록 */}
        <Card>
          <CardContent className="pt-6">
            {jobLoading ? (
              <p className="text-center text-gray-500 py-8 text-lg">불러오는 중...</p>
            ) : jobs.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-lg">등록된 일자리가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-base font-semibold text-gray-600">
                      <th className="pb-3 pr-6">공고명</th>
                      <th className="pb-3 pr-6">지역</th>
                      <th className="pb-3 pr-6">직종</th>
                      <th className="pb-3 pr-6">요구 경력</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job.id} className="border-b last:border-0 text-base">
                        <td className="py-4 pr-6 font-medium text-gray-800">{job.title}</td>
                        <td className="py-4 pr-6 text-gray-600">{job.region}</td>
                        <td className="py-4 pr-6 text-gray-600">{job.job_type}</td>
                        <td className="py-4 pr-6 text-gray-600">{job.required_career_years}년 이상</td>
                        <td className="py-4">
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === job.id}
                            onClick={() => deleteJob(job.id)}
                          >
                            {deletingId === job.id ? "삭제 중..." : "삭제"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

    </div>
  );
}

function JobField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-base font-semibold text-gray-800">{label}</label>
      {error && (
        <div className="rounded-md border border-red-400 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
      {children}
    </div>
  );
}
