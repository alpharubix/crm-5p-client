import { AppSidebar } from '@/components/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function SidebarComponent() {
  const navigate = useNavigate()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4 bg-white/80 backdrop-blur-sm'>
          <div className='flex items-center gap-2'>
            <SidebarTrigger className='-ml-1' />
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => navigate('/support-tickets')}
              className='h-9 w-9 rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors'
              title='Software Support & Bug Tickets'
            >
              <HelpCircle className='h-5 w-5' />
            </Button>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
