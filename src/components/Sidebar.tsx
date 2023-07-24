import { NavLink } from 'react-router-dom';
import { Topic } from '../pages/Layout';
import '../css/sidebar.css';

type SidebarProps = {
  topics: Topic[],
}

const Sidebar = ({ topics }: SidebarProps) => {

  return (
    <nav className='sidebar'>
        <ul className='current'>
          {topics.map((topic) => (
            <li key={topic.id} className='topic'>
              <NavLink to={`topics/${topic.name}`}>
                {topic.name[0].toUpperCase() + topic.name.slice(1)}
              </NavLink>
            </li>
          ))}
        </ul>
        <ul className='create'>
          <li>
            <NavLink
              to={'topics/create'}
            >
              Create New 🔥 Topic
            </NavLink>
          </li>
        </ul>
    </nav>
  )
}
export default Sidebar