import { ReactNode } from 'react'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger 
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  MessageSquare, 
  Code, 
  Mail, 
  Settings as SettingsIcon,
  Star,
  Instagram,
  LogOut,
  Store
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

interface AppLayoutProps {
  children: ReactNode
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home
  },
  {
    name: 'Reviews',
    href: '/reviews',
    icon: MessageSquare
  },
  {
    name: 'Instagram UGC',
    href: '/instagram-ugc',
    icon: Instagram
  },
  {
    name: 'Widgets',
    href: '/widgets',
    icon: Code
  },
  {
    name: 'Email Templates',
    href: '/email-templates',
    icon: Mail
  },
  {
    name: 'Campaigns',
    href: '/campaigns',
    icon: Mail
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: SettingsIcon
  }
]

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const { shop, user, logout } = useAuth()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar className="border-r border-gray-200 bg-white">
        <SidebarHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Star className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">TrustLoop</h1>
              <p className="text-xs text-gray-500">Reviews & UGC</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-3 py-4">
          <SidebarMenu>
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild className={cn(
                    'w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' 
                      : 'text-gray-700 hover:bg-gray-50'
                  )}>
                    <Link to={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      
      <main className="flex-1 overflow-auto">
        <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
          <SidebarTrigger className="lg:hidden" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Store className="h-4 w-4" />
              <span>Connected to <span className="font-medium text-gray-900">{shop?.shop_domain}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-700">
                {user?.email}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}