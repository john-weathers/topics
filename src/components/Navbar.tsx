import { Dispatch, SetStateAction } from "react";
import { NavLink } from "react-router-dom"
import { Topic } from "../pages/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import '../css/nav.css';

type NavbarProps = {
  topics: Topic[],
  windowWidth: number,
  mobileOpen: {
    mobileOpen: boolean,
    setMobileOpen: Dispatch<SetStateAction<boolean>>,
  }
}

const Navbar = ({ topics, windowWidth, mobileOpen: { mobileOpen, setMobileOpen } }: NavbarProps) => {
  
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
                  {topics.length ? (
                    <ul className='topics'>
                      {topics.map((topic) => (
                        <li key={topic.id} className='topic'>
                          <NavLink to={`topics/${topic.name}`}>
                            {topic.name[0].toUpperCase() + topic.name.slice(1)}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className='topics empty'>
                      <li>No 🔥 Topics 😱</li>
                      <li>
                        <NavLink
                          to={`create-topic`}
                        >
                          Create 🔥 Topic
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}
export default Navbar