import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { translations, navigationItems } from '@/lib/data';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { auth } = usePage().props as any;
  const common = translations.common;

  const getUserRole = () => {
    if (auth?.user?.roles?.includes('super-admin')) return 'superAdmin';
    if (auth?.user?.roles?.includes('school-admin')) return 'schoolAdmin';
    return 'parent';
  };

  const currentNavItems =
    navigationItems[getUserRole() as keyof typeof navigationItems] || [];

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/dashboard" className="block">
            <div className="text-2xl font-bold text-cyan-600">
              {sidebarOpen ? 'Feeyangu' : 'F'}
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {currentNavItems.map((item) => {
            const isActive = window.location.pathname === item.href;
            const isLogout = item.href === '/logout';

            return isLogout ? null : (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-cyan-50 text-cyan-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-cyan-600'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && (
                  <span className="text-sm">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-gray-200 text-gray-600 hover:text-cyan-600 transition-colors"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            )}
          </div>
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <Link href="/notifications">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                🔔
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {auth?.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">
                    {auth?.user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {auth?.user?.email}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-800">
                      {auth?.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {auth?.user?.email}
                    </p>
                  </div>
                  <div className="p-2 space-y-2">
                    <Link href="/settings">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                        ⚙️ Settings
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      🚪 {common.buttons.logout || 'Logout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};