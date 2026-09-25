import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center max-w-[1200px] mx-auto">
      <Sidebar />
      <main className="flex-1 max-w-[600px] w-full min-h-screen">
        {children}
      </main>
      <RightSidebar />
    </div>
  );
}
