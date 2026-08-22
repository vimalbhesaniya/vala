import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SchoolDetailView } from "@/components/school/SchoolDetailView";
import { serverFetch } from "@/lib/api/server-fetch";
import type { School } from "@/lib/api/server-fetch";

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let school: School;
  try {
    school = await serverFetch<School>(`/schools/${slug}`);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Schools", href: "/schools" },
          { label: school.name },
        ]}
      />
      <div className="mt-6">
        <SchoolDetailView school={school} />
      </div>
    </div>
  );
}
