import {
  Route,
  createBrowserRouter,
  createRoutesFromElements, 
} from 'react-router-dom';
import Layout from './pages/Layout';
import Index from './pages/Index';
import TopicsOverview from './pages/TopicsOverview';
import TopicFeed, { loader as topicFeedLoader } from './pages/TopicFeed';
import PostView from './pages/PostView';
import PersistLogin from './pages/PersistLogin';
import ErrorPage from './pages/ErrorPage';



export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PersistLogin />}>
      <Route path='/' element={<Layout />} errorElement={<ErrorPage />}>
        <Route index element={<Index />}/>
        <Route path='t/overview/status' element={<TopicsOverview />}/>
        <Route path='t/:topicName' element={<TopicFeed />} loader={topicFeedLoader}/>
        <Route path='t/:topicName/comments/:postId' element={<PostView />}/>
      </Route>
    </Route>
    
  )
)
