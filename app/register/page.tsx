"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

const REGIONS = ["서울", "경기", "인천", "기타"];
const JOB_TYPES = ["경비", "청소", "조리", "돌봄", "기타"];

type Fields = { name: string; region: string; desired_job: string; career_years: string };
type Errors = Partial<Record<keyof Fields, string>>;

export default function RegisterPage() {
  const [form, setForm] = useState<Fields>({ name: "", region: "", desired_job: "", career_years: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function setField(field: keyof Fields, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (success) setSuccess(false);
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "이름을 입력해 주세요.";
    if (!form.region) next.region = "지역을 선택해 주세요.";
    if (!form.desired_job) next.desired_job = "희망 직종을 선택해 주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.from("seniors").insert({
      name: form.name.trim(),
      region: form.region,
      desired_job: form.desired_job,
      career_years: parseInt(form.career_years) || 0,
    });
    setLoading(false);
    if (error) {
      alert("등록 중 오류가 발생했습니다: " + error.message);
    } else {
      setSuccess(true);
      setForm({ name: "", region: "", desired_job: "", career_years: "" });
      setErrors({});
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">프로필 등록</h1>
        <p className="text-lg text-gray-600">정보를 입력하시면 맞는 일자리를 찾아 드립니다.</p>
      </div>

      {success && (
        <div className="rounded-lg border border-green-500 bg-green-50 px-5 py-4 text-lg font-semibold text-green-800">
          등록이 완료되었습니다.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">기본 정보</CardTitle>
          <CardDescription className="text-base">* 표시 항목은 필수 입력입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={onSubmit}>

            <Field label="이름 *" error={errors.name}>
              <Input
                placeholder="홍길동"
                className="text-lg h-14 px-4"
                value={form.name}
                onChange={e => setField("name", e.target.value)}
                disabled={loading}
              />
            </Field>

            <Field label="거주 지역 *" error={errors.region}>
              <Select
                value={form.region}
                onChange={e => setField("region", e.target.value)}
                disabled={loading}
              >
                <option value="">-- 선택하세요 --</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </Field>

            <Field label="희망 직종 *" error={errors.desired_job}>
              <Select
                value={form.desired_job}
                onChange={e => setField("desired_job", e.target.value)}
                disabled={loading}
              >
                <option value="">-- 선택하세요 --</option>
                {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
              </Select>
            </Field>

            <Field label="경력 (년)">
              <Input
                type="number"
                placeholder="예: 5"
                min={0}
                className="text-lg h-14 px-4"
                value={form.career_years}
                onChange={e => setField("career_years", e.target.value)}
                disabled={loading}
              />
            </Field>

            <Button
              type="submit"
              size="lg"
              className="w-full text-xl py-7 font-bold"
              disabled={loading}
            >
              {loading ? "등록 중..." : "등록하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-lg font-medium text-gray-800">{label}</label>
      {error && (
        <div className="rounded-md border border-red-400 bg-red-50 px-4 py-2 text-base font-semibold text-red-700">
          {error}
        </div>
      )}
      {children}
    </div>
  );
}
