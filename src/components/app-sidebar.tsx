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
import { BookOpen, GalleryVerticalEnd } from 'lucide-react'

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
    // {
    //   title: 'Tickets',
    //   url: '#',
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: 'Desk',
    //       url: '/desk',
    //     },
    //   ],
    // },
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
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
