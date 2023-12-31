import { Dispatch, SetStateAction } from "react";
import { NavLink } from "react-router-dom"
import { TopicProps } from '../types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faSpinner } from "@fortawesome/free-solid-svg-icons";
import useLogout from '../hooks/useLogout';
import '../css/nav.css';

type NavbarProps = {
  topics: TopicProps[],
  windowWidth: number,
  mobileOpen: {
    mobileOpen: boolean,
    setMobileOpen: Dispatch<SetStateAction<boolean>>,
  },
  loaded: boolean,
}

const Navbar = ({ topics, loaded, windowWidth, mobileOpen: { mobileOpen, setMobileOpen } }: NavbarProps) => {
  const logout = useLogout();
  
  return (
    <nav className='header'>
      {mobileOpen && (
        <div className='nav-overlay' onClick={() => setMobileOpen(false)}></div>
      )}
      <ul className='nav-container'>
        <li className='home-nav' onClick={() => setMobileOpen(false)}>
          <NavLink to='/'>
            HotTopics
          </NavLink>
        </li>
        {windowWidth <= 768 && (
          <li className='mobile-menu'>
            <button type='button' onClick={() => setMobileOpen(prev => !prev)}>
              <span>🔥 Topics</span><FontAwesomeIcon icon={!mobileOpen ? faChevronDown : faChevronUp}/>
              {mobileOpen && (
                <div className='container'>
                  {loaded ? (
                    <>
                      <ul className='current'>
                      {topics.map((topic) => (
                        <li key={topic.id} className='topic'>
                          <NavLink to={`t/${topic.name}`}>
                            {topic.name[0].toUpperCase() + topic.name.slice(1)}
                          </NavLink>
                        </li>
                      ))}
                      </ul>
                      <ul className='topics-overview'>
                        <li>
                          <NavLink to={'t/overview/status'}>
                            {topics.length < 10 
                              ? 'Create New 🔥 Topic' 
                              : topics.some((topic) => Boolean(topic?.relStatus))
                              ? 'Relegation Battle in Progress'
                              : 'Start Relegation Battle'
                            }
                          </NavLink>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <div className='loading'>
                      <FontAwesomeIcon icon={faSpinner} spin size='3x'/>
                    </div>
                  )}
                </div>
              )}
            </button>
          </li>
        )}
        <li onClick={async () => await logout()} className='logout'>Logout</li>
      </ul>
    </nav>
  )
}
export default Navbar