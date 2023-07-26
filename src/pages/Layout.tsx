import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { TopicProps, PostProps, Home } from '../types';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar';
import Error from '../components/Error';

const TOPICS_URL = '/topics';

const Layout = () => {
  // temporary work-around since React Router does not support generic types here
  // const { topics, feed } = useLoaderData() as Home;
  const [topics, setTopics] = useState<TopicProps[]>([]);
  const [feed, setFeed] = useState<PostProps[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const errRef = useRef<HTMLInputElement>(null);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const url = new URL(window.location.href);
    const path = Boolean(url.pathname.slice(1));
    const axiosInstance = auth?.accessToken ? axiosPrivate : axios;

    const fetchHome = async () => {
      const home = await axiosInstance.get<Home>(TOPICS_URL, {
        params: {
          index: path,
        }
      });
      setTopics(home.data.topics);
      setFeed(home.data.feed);
      setLoaded(true);
    }

    fetchHome().catch((error) => {
      setErrMsg(error.message);
      if (errRef.current) {
        errRef.current.focus();
      }
      
    })
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div>
      <Navbar
        topics={topics}
        windowWidth={windowWidth}
        mobileOpen={{ mobileOpen, setMobileOpen }}
        loaded={loaded}
      />
      <div onClick={() => setMobileOpen(false)} className='main'>
        {windowWidth > 768 && <Sidebar topics={topics} loaded={loaded} />}
        {loaded && feed.length 
          ? <Outlet context={{ feed, windowWidth, setErrMsg }}/> 
          : loaded && !feed.length
          ? <Outlet context={{ windowWidth, setErrMsg }} />
          : (
            <div className='loading'>
              <FontAwesomeIcon icon={faSpinner} spin size='3x'/>
            </div>
          )}
      </div>
      <Error errRef={errRef} errMsg={errMsg} setErrMsg={setErrMsg}/>
    </div>
  )
}
export default Layout

/*// temporary work-around since React Router does not support generic types here
const topics = useLoaderData() as Topic[];
// const [scrollHeightCheck, setScrollHeightCheck] = useState(false);
/*const [pageHeight, setPageHeight] = useState(() => {
  if (document.body.scrollHeight === 0) {
    setTimeout(() => {
      setScrollHeightCheck(true);
    }, 200)
  } else {
    if (window.innerHeight >= document.body.scrollHeight) {
      return 'calc(100vh - 50px)';
    } else {
      return '100%';
    }
  }
});
const [mobileOpen, setMobileOpen] = useState(false);
const [mobileHeight, setMobileHeight] = useState(
  window.innerHeight >= document.body.scrollHeight 
    ? window.innerHeight 
    : document.body.scrollHeight
);
const [windowWidth, setWindowWidth] = useState(window.innerWidth);

useEffect(() => {
  const scrollHeight = document.body.scrollHeight;
  if (window.innerHeight >= scrollHeight) {
      setMobileHeight(window.innerHeight)
  } else {
      setMobileHeight(scrollHeight);
  }
}, [mobileOpen]);

useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    if (window.innerHeight >= document.body.scrollHeight) {
      setPageHeight('calc(100vh - 50px)');
    } else {
      setPageHeight('100%');
    }
  }

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  }
}, []);

useEffect(() => {
  if (window.innerHeight >= document.body.scrollHeight) {
    setPageHeight('calc(100vh - 50px)');
  } else {
    setPageHeight('100%');
  }
}, [scrollHeightCheck])*/