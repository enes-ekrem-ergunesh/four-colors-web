import {Routes} from '@angular/router';
import {adminAuthGuard} from "./admin/guards/admin-auth-guard/admin-auth.guard";
import {adminNoAuthGuard} from "./admin/guards/admin-no-auth-guard/admin-no-auth.guard";
import {userAuthGuard} from "./guards/user-auth-guard/user-auth.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.page').then( m => m.ContactPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then( m => m.AboutPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'admin',
    redirectTo: 'admin-home',
    pathMatch: 'full',
  },
  {
    path: 'admin-home',
    loadComponent: () => import('./admin/pages/admin-home/admin-home.page').then(m => m.AdminHomePage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin-login',
    loadComponent: () => import('./admin/pages/admin-login/admin-login.page').then(m => m.AdminLoginPage),
    canActivate: [adminNoAuthGuard]
  },
  {
    path: 'admin-students',
    loadComponent: () => import('./admin/pages/admin-students/admin-students.page').then( m => m.AdminStudentsPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'new-student',
    loadComponent: () => import('./admin/pages/admin-students/new-student/new-student.page').then( m => m.NewStudentPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin-teachers',
    loadComponent: () => import('./admin/pages/admin-teachers/admin-teachers.page').then( m => m.AdminTeachersPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'new-teacher',
    loadComponent: () => import('./admin/pages/admin-teachers/new-teacher/new-teacher.page').then( m => m.NewTeacherPage)
  },
  {
    path: 'admin-user-details/:userId',
    loadComponent: () => import('./admin/pages/admin-user-details/admin-user-details.page').then( m => m.AdminUserDetailsPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin-courses',
    loadComponent: () => import('./admin/pages/admin-courses/admin-courses.page').then( m => m.AdminCoursesPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin-course-details/:courseId',
    loadComponent: () => import('./admin/pages/admin-courses/admin-course-details/admin-course-details.page').then( m => m.AdminCourseDetailsPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'new-course',
    loadComponent: () => import('./admin/pages/admin-courses/new-course/new-course.page').then( m => m.NewCoursePage)
  },
  {
    path: 'admin-classrooms',
    loadComponent: () => import('./admin/pages/admin-classrooms/admin-classrooms.page').then( m => m.AdminClassroomsPage)
  },
  {
    path: 'admin-classroom-details/:classroomId',
    loadComponent: () => import('./admin/pages/admin-classrooms/admin-classroom-details/admin-classroom-details.page').then( m => m.AdminClassroomDetailsPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'new-classroom',
    loadComponent: () => import('./admin/pages/admin-classrooms/new-classroom/new-classroom.page').then( m => m.NewClassroomPage)
  },
  {
    path: 'my-courses',
    loadComponent: () => import('./pages/my/my-courses/my-courses.page').then( m => m.MyCoursesPage)
  },
  {
    path: 'my-home',
    loadComponent: () => import('./pages/my/my-home/my-home.page').then( m => m.MyHomePage)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/page-not-found/page-not-found.page').then(m => m.PageNotFoundPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
];
