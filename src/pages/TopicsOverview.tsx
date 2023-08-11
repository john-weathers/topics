import { useState, FormEvent } from 'react';
import { useOutletContext, NavLink } from 'react-router-dom';
import { TopicProps, SetErrMsg } from '../types';
import useAuth from '../hooks/useAuth';
import TopicForm from '../components/TopicForm';
import RatingPanel from '../components/RatingPanel';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from 'axios';

const hotnessStyling: { [rank: string]: [string, string] } = {
  '1': ['Hottest!', '#fa0202'],
  '2': ['Hot hot hot!', '#fa3802'],
  '3': ['Hot!', '#fa6a02'],
  '4': ['Hot!', '#fa6a02'],
  '5': ['Still warm.', '#fa9b02'],
  '6': ['Luke warm.', '#fabc02'],
  '7': ['Room temp.', '#fafa02'],
  '8': ['Cold.', '#02e5fa'],
  '9': ['Colder.', '#02b0fa'],
  '10': ['Coldest.', '#024dfa'],
}

const NEW_TOPIC_URL = '/topics';

const TopicsOverview = () => {
  const { auth } = useAuth();
  const { topics: topicContext, setErrMsg }: { topics: TopicProps[], setErrMsg: SetErrMsg }  = useOutletContext();
  const [topics, setTopics] = useState(topicContext ? topicContext : []);
  const [addTopic, setAddTopic] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [relVotes, setRelVotes] = useState(() => {
    const tracker: { [name: string]: '+' | '-' | '' } = {};
    topics.forEach((topic) => {
      const relStatus = topic?.relStatus;
      if (relStatus) {
        tracker[topic.name] = relStatus?.voted;
      }
    })
    return tracker;
  });
  const [ratingVotes, setRatingVotes] = useState(() => {
    const tracker: { [name: string]: number } = {};
    topics.forEach((topic) => {
      const relStatus = topic?.relStatus;
      if (relStatus) {
        tracker[topic.name] = relStatus.keep - relStatus.replace;
      }
    })
    return tracker;
  });
  const axiosPrivate = useAxiosPrivate();

  const handleNewTopic = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!auth?.accessToken) {
      setErrMsg(['auth required', 'You must be logged in to add a new topic']);
      return;
    }

    if (topicName.length < 3 || topicName.length > 25) {
      setErrMsg('Topic name must be 3 to 25 characters');
      return;
    }

    try {
      const response = await axiosPrivate.post<TopicProps[]>(NEW_TOPIC_URL, {
        topicName,
      });
      setTopics(response.data);
      setAddTopic(false);
      setTopicName('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setErrMsg('Username Taken');
        } else if (err.response?.status === 400) {
          setErrMsg('Complete all fields as instructed');
        } else {
          setErrMsg('Registration Failed');
        }
      } else {
        setErrMsg('No Server Response');
      }
    }

  }

  const replaceTopicWrapper = (replaceName: string) => {
    return async (e: FormEvent) => {
      e.preventDefault();

      if (!auth?.accessToken) {
        setErrMsg(['auth required', 'You must be logged in to propose a new topic']);
        return;
      }

      if (topicName.length < 3 || topicName.length > 25) {
        setErrMsg('Topic name must be 3 to 25 characters');
        return;
      }

      const URL = `/topics/${replaceName}/relegation/start`;

      try {
        const response = await axiosPrivate.post<TopicProps[]>(URL, {
          topicName,
        });
        setTopics(response.data);
        setAddTopic(false);
        setTopicName('');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 409) {
            setErrMsg('Username Taken');
          } else if (err.response?.status === 400) {
            setErrMsg('Complete all fields as instructed');
          } else {
            setErrMsg('Registration Failed');
          }
        } else {
          setErrMsg('No Server Response');
        }
      }
    }
  }

  const handleVote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!auth?.accessToken) {
      setErrMsg(['auth required', 'You must be logged in to vote']);
      return;
    }

    const voteStr = e.currentTarget?.relvoteoverview?.value;
    if (!voteStr) {
      setErrMsg('Invalid value provided');
      return;
    }

    const voteArr = voteStr.split(',');
    const vote = voteArr[0];
    const topic = voteArr[1];
    if (vote !== '+' || vote !== '-' || !topic) {
      setErrMsg('Invalid value provided');
      return;
    }
    
    const prevVote = relVotes[topic];
    const prevRating = ratingVotes[topic];
    setRelVotes(prev => {
      const updated: { [name: string]: '+' | '-' | '' } = {};
      updated[topic] = vote;
      return {
        ...prev,
        ...updated,
      }
    });
    setRatingVotes(prev => {
      const updated: { [name: string]: number } = {};
      let updatedRating = prevRating;
      if (prevVote === '' && vote === '+') {
        updatedRating += 1;
      } else if (prevVote === '' && vote === '-') {
        updatedRating -= 1;
      } else if (prevVote === '+' && vote === '+') {
        updatedRating -= 1;
      } else if (prevVote === '-' && vote === '-') {
        updatedRating += 1;
      } else if (prevVote === '-' && vote === '+') {
        updatedRating += 2;
      } else {
        updatedRating -= 2;
      }
      updated[topic] = updatedRating;
      return {
        ...prev,
        ...updated,
      }
    })

    const URL = `/topics/${topic}/relegation/vote`;

    try {
      await axiosPrivate.patch(URL, {
        vote,
      });
    } catch (err) {
      setRelVotes((prev) => {
        const reverted: { [name: string]: '+' | '-' | '' } = {};
        reverted[topic] = prevVote;
        return {
          ...prev,
          ...reverted,
        }
      });
      setRatingVotes((prev) => {
        const reverted: { [name: string]: number } = {};
        reverted[topic] = prevRating;
        return {
          ...prev,
          ...reverted,
        }
      });
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setErrMsg('Username Taken');
        } else if (err.response?.status === 400) {
          setErrMsg('Complete all fields as instructed');
        } else {
          setErrMsg('Registration Failed');
        }
      } else {
        setErrMsg('No Server Response');
      }
    }
  }

  return (
    <div className='expanded-overview'>
        {topics.length < 10 ? (
          <div className='topics'>
            <ol>
              {topics.map((topic) => (
                <li key={topic.id} className='topic' style={{ backgroundColor: hotnessStyling[topic.ranking][1]}}>
                  <NavLink to={`t/${topic.name}`}>
                    {topic.name[0].toUpperCase() + topic.name.slice(1)}
                  </NavLink>
                </li>
              ))}
            </ol>
            {!addTopic ? (
              <button type='button' onClick={() => setAddTopic(true)}>+ 🔥 Topic</button>
            ) : (
              <TopicForm setAddTopic={setAddTopic} topicName={topicName} setTopicName={setTopicName} setErrMsg={setErrMsg} handleSubmit={handleNewTopic}/>
            )}
          </div>
        ) : (
          <div className='topics full'>
            <ol>
              {topics.slice(0, 7).map((topic) => (
                <li key={topic.id} className='topic' style={{ backgroundColor: hotnessStyling[topic.ranking][1]}}>
                  <NavLink to={`t/${topic.name}`}>
                    {topic.name[0].toUpperCase() + topic.name.slice(1)}
                  </NavLink>
                </li>
              ))}
            </ol>
            <ol start={8}>
              {topics.slice(-3).map((topic) => (
                <li key={topic.id} className='topic danger-zone' style={{ backgroundColor: hotnessStyling[topic.ranking][1]}}>
                  <NavLink to={`t/${topic.name}`}>
                    {topic.name[0].toUpperCase() + topic.name.slice(1)}
                  </NavLink>
                  {topic?.relStatus ? (
                    <div>
                      <span>🚨Relegation Vote🚨</span>
                      <RatingPanel 
                        rating={ratingVotes[topic.name]} 
                        handleVote={handleVote} 
                        voteStatus={relVotes[topic.name]} 
                        voteType='relvoteoverview'
                        topic={topic.name}
                      />
                    </div>
                  ) : (
                    <>
                      {!addTopic ? (
                        <button onClick={() => setAddTopic(true)}>Relegate Topic</button>
                      ) : (
                        <TopicForm 
                          setAddTopic={setAddTopic} 
                          topicName={topicName} 
                          prevTopicName={topic.name} 
                          setTopicName={setTopicName} 
                          setErrMsg={setErrMsg} 
                          handleSubmit={replaceTopicWrapper(topic.name)}
                        />
                      )}
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
    </div>
  )
}
export default TopicsOverview