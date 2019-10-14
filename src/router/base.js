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
            meta:{btnPermissions:[1]},
            component: ClassManage
        },
        {
            path: '/ModifyPassword',
            name: 'ModifyPassword',
            meta:{btnPermissions:[1,2]},
            component: ModifyPassword
        },
        {
            path: '/StudentManage',
            name: 'StudentManage',
            meta:{btnPermissions:[1]},
            component: StudentManage
        },
        {
            path: '/TeacherManage',
            name: 'TeacherManage',
            meta:{btnPermissions:[1]},
            component: TeacherManage
        },
          {
            path: '/UserManage',
            name: 'UserManage',
            meta:{btnPermissions:[1]},
            component: UserManage
        }
    ]
)