import { NavLink } from 'react-router-dom';
import { TopicProps } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../css/sidebar.css';

type SidebarProps = {
  topics: TopicProps[],
  loaded: boolean,
}

const Sidebar = ({ topics, loaded }: SidebarProps) => {

  return (
    <nav className='sidebar'>
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
    </nav>
  )
}
export default Sidebar