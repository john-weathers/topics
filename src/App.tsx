import {
  Route,
  createBrowserRouter,
  createRoutesFromElements, 
} from 'react-router-dom';
import Layout from './pages/Layout';
import ErrorPage from './pages/ErrorPage';



export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} errorElement={<ErrorPage />}>

    </Route>
  )
)
