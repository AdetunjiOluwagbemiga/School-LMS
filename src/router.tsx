import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { StudentDashboard } from '@/pages/student/StudentDashboard'
import { MyCoursesPage } from '@/pages/student/MyCoursesPage'
import { CourseDetailPage } from '@/pages/student/CourseDetailPage'
import { LessonPage } from '@/pages/student/LessonPage'
import { BadgesPage } from '@/pages/student/BadgesPage'
import { ProgressPage } from '@/pages/student/ProgressPage'
import { ForumsPage } from '@/pages/student/ForumsPage'
import { LearningPathPage } from '@/pages/student/LearningPathPage'
import { TeacherDashboard } from '@/pages/teacher/TeacherDashboard'
import { GradebookPage } from '@/pages/teacher/GradebookPage'
import { AnalyticsPage } from '@/pages/teacher/AnalyticsPage'
import { SchoolDashboard } from '@/pages/admin/SchoolDashboard'
import { UsersPage } from '@/pages/admin/UsersPage'
import { ParentDashboard } from '@/pages/parent/ParentDashboard'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SettingsPage } from '@/pages/SettingsPage'

// Root
const rootRoute = createRootRoute({ component: () => <Outlet /> })

// Auth routes
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage })
const registerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/register', component: RegisterPage })

// Root redirect
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/login' }) }
})

// App shell
const appRoute = createRoute({ getParentRoute: () => rootRoute, path: '/app', component: AppShell })

// Student routes
const learnRoute = createRoute({ getParentRoute: () => appRoute, path: '/learn' })
const studentDashboardRoute = createRoute({ getParentRoute: () => learnRoute, path: '/dashboard', component: StudentDashboard })
const studentCoursesRoute = createRoute({ getParentRoute: () => learnRoute, path: '/courses', component: MyCoursesPage })
const courseDetailRoute = createRoute({ getParentRoute: () => learnRoute, path: '/courses/$courseId', component: CourseDetailPage })
const lessonRoute = createRoute({ getParentRoute: () => learnRoute, path: '/courses/$courseId/lesson/$itemId', component: LessonPage })
const badgesRoute = createRoute({ getParentRoute: () => learnRoute, path: '/badges', component: BadgesPage })
const progressRoute = createRoute({ getParentRoute: () => learnRoute, path: '/progress', component: ProgressPage })
const forumsRoute = createRoute({ getParentRoute: () => learnRoute, path: '/forums', component: ForumsPage })
const pathRoute = createRoute({ getParentRoute: () => learnRoute, path: '/path', component: LearningPathPage })

// Teacher routes
const teachRoute = createRoute({ getParentRoute: () => appRoute, path: '/teach' })
const teacherDashboardRoute = createRoute({ getParentRoute: () => teachRoute, path: '/dashboard', component: TeacherDashboard })
const teacherCoursesRoute = createRoute({ getParentRoute: () => teachRoute, path: '/courses', component: MyCoursesPage })
const gradebookRoute = createRoute({ getParentRoute: () => teachRoute, path: '/gradebook', component: GradebookPage })
const teacherAnalyticsRoute = createRoute({ getParentRoute: () => teachRoute, path: '/analytics', component: AnalyticsPage })

// Admin routes
const adminRoute = createRoute({ getParentRoute: () => appRoute, path: '/admin' })
const adminDashboardRoute = createRoute({ getParentRoute: () => adminRoute, path: '/dashboard', component: SchoolDashboard })
const adminUsersRoute = createRoute({ getParentRoute: () => adminRoute, path: '/users', component: UsersPage })

// Parent routes
const parentRoute = createRoute({ getParentRoute: () => appRoute, path: '/parent' })
const parentDashboardRoute = createRoute({ getParentRoute: () => parentRoute, path: '/dashboard', component: ParentDashboard })

// Shared
const notificationsRoute = createRoute({ getParentRoute: () => appRoute, path: '/notifications', component: NotificationsPage })
const profileRoute = createRoute({ getParentRoute: () => appRoute, path: '/profile', component: ProfilePage })
const settingsRoute = createRoute({ getParentRoute: () => appRoute, path: '/settings', component: SettingsPage })

// App redirect
const appIndexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/app/learn/dashboard' }) }
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  appRoute.addChildren([
    appIndexRoute,
    learnRoute.addChildren([
      studentDashboardRoute,
      studentCoursesRoute,
      courseDetailRoute,
      lessonRoute,
      badgesRoute,
      progressRoute,
      forumsRoute,
      pathRoute,
    ]),
    teachRoute.addChildren([
      teacherDashboardRoute,
      teacherCoursesRoute,
      gradebookRoute,
      teacherAnalyticsRoute,
    ]),
    adminRoute.addChildren([
      adminDashboardRoute,
      adminUsersRoute,
    ]),
    parentRoute.addChildren([
      parentDashboardRoute,
    ]),
    notificationsRoute,
    profileRoute,
    settingsRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
