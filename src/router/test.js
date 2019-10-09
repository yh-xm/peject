const MakeTestPaper = () => import('@/views/test/MakeTestPaper')
const TestPaperManage = () => import('@/views/test/TestPaperManage')
const TestResult = () => import('@/views/test/TestResult')
const TestSetter = () => import('@/views/test/TestSetter')
const ViewTestPaper = () => import('@/views/test/ViewTestPaper')
const TestpageDetails = () => import('@/components/TestpageDetails')
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
            component: TestPaperManage,
            meta: [
                { name: '首页', url: '/' },
                { name: '在线测试' , url: '/'},
                { name: '试卷管理' }
            ]        
        },
        {
            path: '/testPageInfo/:id',
            name: 'TestpageDetails',
            component: TestpageDetails,
            meta: [
                { name: '首页', url: '/' },
                { name: '在线测试', url: '/' },
                { name: '试卷管理',url:'/TestPaperManage'},
                { name: '试卷详情'}
            ],
        
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
        },
        
    ]
)