const MakeTestPaper = () => import('@/views/test/MakeTestPaper')
const TestPaperManage = () => import('@/views/test/TestPaperManage')
const TestResult = () => import('@/views/test/TestResult')
const TestSetter = () => import('@/views/test/TestSetter')
const ViewTestPaper = () => import('@/views/test/ViewTestPaper')
const piYueTestPaper = () => import('@/views/test/piYueTestPaper')
const TestpageDetails = () => import("@/components/TestpageDetails") 
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
                { name: 'message.home', url: '/' },
                { name: 'test.title' , url: '/'},
                { name: 'test.r2' }
            ]        
        },
        {
            path: '/testPageInfo/:id',
            name: 'TestpageDetails',
            component: TestpageDetails,
            meta: [
                { name: 'message.home', url: '/' },
                { name: 'test.title', url: '/' },
                { name: 'test.r2',url:'/TestPaperManage'},
                { name: 'test.r7'}
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
        
        {
            path: '/piYueTestPaper',
            name: 'piYueTestPaper',
            component: piYueTestPaper
        }
    ]
)