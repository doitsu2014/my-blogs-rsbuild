import LeftMenu from './components/left-menu';
import { LayoutProvider } from './layoutContext';
import { MainLayout } from './layoutMain';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <LeftMenu />
        <MainLayout>{children}</MainLayout>
      </div>
    </LayoutProvider>
  );
}
