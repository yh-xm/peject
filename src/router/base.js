const ClassManage = () => import('@/views/base/ClassManage')
const ModifyPassword = () => import('@/views/base/ModifyPassword')
const StudentManage = () => import('@/views/base/StudentManage')
const TeacherManage = () => import('@/views/base/TeacherManage')
const UserManage = () => import('@/views/base/UserManage')

export default(
    [
        {
            path: '/ClassManage',
            name: 'ClassManage',
            component: ClassManage
        },
        {
            path: '/ModifyPassword',
            name: 'ModifyPassword',
            component: ModifyPassword
        },
        {
            path: '/StudentManage',
            name: 'StudentManage',
            component: StudentManage
        },
        {
            path: '/TeacherManage',
            name: 'TeacherManage',
            component: TeacherManage
        },
          {
            path: '/UserManage',
            name: 'UserManage',
            component: UserManage
        }
    ]
)