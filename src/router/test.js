const MakeTestPaper = () => import('@/views/test/MakeTestPaper')
const TestPaperManage = () => import('@/views/test/TestPaperManage')
const TestResult = () => import('@/views/test/TestResult')
const TestSetter = () => import('@/views/test/TestSetter')
const ViewTestPaper = () => import('@/views/test/ViewTestPaper')


//二级路由
const paperInfo = () => import('@/components/MakeTestPaper/PaperInfo')
const MakeOver = () => import('@/components/MakeTestPaper/MakeOver')
const TestInfo = () => import('@/components/MakeTestPaper/TestInfo/TestInfo')

//三级路由
const MultipleChoice = () => import('@/components/MakeTestPaper/TestInfo/MultipleChoice')
const EssayQuestion = () => import('@/components/MakeTestPaper/TestInfo/EssayQuestion')
const GapFilling  = () => import('@/components/MakeTestPaper/TestInfo/GapFilling ')

export default(
    [
        {
            path: '/MakeTestPaper',
            name: 'MakeTestPaper',
            component: MakeTestPaper,
            redirect: '/paperInfo',
            children: [{
                path: '/paperInfo',
                name: 'paperInfo',
                component: paperInfo
              },
              {
                path: '/TestInfo',
                name: 'TestInfo',
                component: TestInfo,
                children: [{
                    path: '/MultipleChoice',
                    name: 'MultipleChoice',
                    component: MultipleChoice
                  },
                  {
                    path: '/EssayQuestion',
                    name: 'EssayQuestion',
                    component: EssayQuestion
                  },
                  {
                    path: '/GapFilling',
                    name: 'GapFilling',
                    component: GapFilling
                  },
                ]
              },
              {
                path: '/MakeOver',
                name: 'MakeOver',
                component: MakeOver
              }
            ]
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