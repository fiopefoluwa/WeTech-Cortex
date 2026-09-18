import Sidebar from "@/app/components/Sidebar";
import TopNavbar from "@/app/components/TopNavbar";
import AuthGuard from "@/app/components/AuthGuard";
import { demoDeal, demoBrand, demoCreator } from "@/app/lib/demo-data";

export default async function DealRoomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;

  return (
    <AuthGuard>
      <div className="flex h-screen max-h-screen overflow-hidden bg-brand-cream">
        <Sidebar
          dealId={dealId}
          dealName={demoDeal.name}
          brandName={demoBrand.name}
          creatorName={demoCreator.name}
        />
        <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">
          <TopNavbar />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 py-5 md:py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
