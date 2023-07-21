import { NavLink } from 'react-router-dom';
import { Topic } from '../pages/Layout';
import '../css/sidebar.css';

type SidebarProps = {
  topics: Topic[],
}

const Sidebar = ({ topics }: SidebarProps) => {

  return (
    <nav className='sidebar'>
      {topics.length ? (
        <ul>
          {topics.map((topic) => (
            <li key={topic.id} className='topic'>
              <NavLink to={`topics/${topic.name}`}>
                {topic.name[0].toUpperCase() + topic.name.slice(1)}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
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
    </nav>
  )
}
export default Sidebar