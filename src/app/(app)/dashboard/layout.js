import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-black text-white pt-[95px]">
      <DashboardSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}