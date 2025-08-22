import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardBottomNav from '@/components/DashboardBottomNav';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-black text-white pt-[95px]">
      {/* Desktop Sidebar */}
      <DashboardSidebar />
      
      <main className="flex-1 p-6 pb-20 md:pb-6">{children}</main>
      
      {/* Mobile Bottom Navigation */}
      <DashboardBottomNav />
    </div>
  );
}
