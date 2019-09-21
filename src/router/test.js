const MakeTestPaper = () => import('@/views/test/MakeTestPaper')
const TestPaperManage = () => import('@/views/test/TestPaperManage')
const TestResult = () => import('@/views/test/TestResult')
const TestSetter = () => import('@/views/test/TestSetter')
const ViewTestPaper = () => import('@/views/test/ViewTestPaper')

export default(
    [
        {
            path: '/MakeTestPaper',
            name: 'MakeTestPaper',
            component: MakeTestPaper
        },
        {
            path: '/TestPaperManage',
            name: 'TestPaperManage',
            component: TestPaperManage
        },
        {
            path: '/TestResult',
            name: 'TestResult',
            component: TestResult
        },
        {
            path: '/TestSetter',
            name: 'TestSetter',
            component: TestSetter
        },
        {
            path: '/ViewTestPaper',
            name: 'ViewTestPaper',
            component: ViewTestPaper
        }
    ]
)