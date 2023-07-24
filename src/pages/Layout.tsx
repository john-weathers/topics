import { useState, useEffect, ContextType } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom'
import axios from '../api/axios';
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar';

const TOPICS_URL = '/topics';

export type Topic = {
  name: string,
  id: number,
}

export type User = {
  username: string,
  rating: number,
}

export type Post = {
  id: number,
  topic: string,
  title: string,
  description: string,
  rating: number,
  created: Date,
  user: User,
}

export type Home = {
  topics: Topic[],
  feed?: Post[],
}

export const loader = async () => {
  const url = new URL(window.location.href);
  const path = Boolean(url.pathname.slice(1));
  const home = await axios.get<Home>(TOPICS_URL, {
    params: {
      index: path,
    }
  });
  return home.data;
}

const Layout = () => {
  // temporary work-around since React Router does not support generic types here
  const { topics, feed } = useLoaderData() as Home;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
      />
      <div onClick={() => setMobileOpen(false)}>
        {windowWidth > 768 && <Sidebar topics={topics} />}
        {feed ? <Outlet context={feed satisfies Post[]}/> : <Outlet />}
      </div>
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