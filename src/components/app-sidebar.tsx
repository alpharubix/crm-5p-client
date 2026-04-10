import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  BookOpen,
  FolderDown,
  FolderOpenDot,
  GalleryVerticalEnd,
  Logs,
} from 'lucide-react'

const data = {
  user: {
    name: 'AlphaRubix infotech',
    email: 'alpharubixinfotech@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'AlphaRubix infotech',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
  ],
  navMain: [
    {
      title: 'Modules',
      url: '#',
      icon: BookOpen,
      items: [
        // {
        //   title: 'Leads',
        //   url: '/leads',
        // },
        {
          title: 'Accounts',
          url: '/accounts',
        },
        {
          title: 'Contacts',
          url: '/contacts',
        },
        {
          title: 'Deals',
          url: '/deals',
        },
        // {
        //   title: 'Deals',
        //   url: '/deals',
        // },
        // {
        //   title: 'Tasks',
        //   url: '#',
        // }, {
        //   title: 'Attachments',
        //   url: '#',
        // }
      ],
    },
    {
      title: 'Export',
      url: '#',
      icon: FolderDown,
      items: [
        {
          title: 'All Exports',
          url: '/exports',
        },
      ],
    },
    {
      title: 'Logs',
      url: '#',
      icon: Logs,
      items: [
        {
          title: 'Audit Log',
          url: '/audit-logs',
        },
      ],
    },
    {
      title: 'Projects',
      url: '#',
      icon: FolderOpenDot,
      items: [
        {
          title: 'All Projects',
          url: '/projects',
        },
        // {
        //   title: 'All Tasks',
        //   url: '/tasks',
        // },
      ],
    },
  ],
}

import { useAuth } from '@/context/auth-context'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const navUser = {
    name: user?.user_name || 'User',
    email: user?.email || '',
    avatar: '/avatars/shadcn.jpg',
  }

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain.filter((item) => {
            if (item.title === 'Logs') {
              return user?.role === 'super_admin'
            }
            return true
          })}
        />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
