import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FormEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import { SetErrMsg } from '../types';

type TopicFormProps = {
  prevTopicName?: string,
  topicName: string,
  setTopicName: Dispatch<SetStateAction<string>>,
  setAddTopic: Dispatch<SetStateAction<boolean>>,
  setErrMsg: SetErrMsg,
  handleSubmit: (e: FormEvent) => Promise<void>,
}

const TOPIC_REGEX = /^[A-Za-z0-9]{3,25}$/;

const TopicForm = ({ setAddTopic, prevTopicName = '', topicName, setTopicName, handleSubmit, setErrMsg }: TopicFormProps) => {
  const [validTopic, setValidTopic] = useState(false);
  const [topicFocus, setTopicFocus] = useState(false);

  useEffect(() => {
    setValidTopic(TOPIC_REGEX.test(topicName));
  }, [topicName])
  
  return (
    <form onSubmit={handleSubmit}>
      {!prevTopicName ? (
        <h2>Add New Topic</h2>
      ) : (
        <h2>Replace {prevTopicName}</h2>
      )}
      <label htmlFor='topic-name' className='text-label'>{!prevTopicName ? 'Topic Name' : 'New Topic Name'}</label>
      <input 
        id='topic-name'
        type='text'
        value={topicName}
        onChange={(e) => {
          if (topicName.length > 25) {
            setErrMsg(`Topics must be 25 characters or less. Trim ${topicName.length - 25} ${topicName.length - 25 === 1 ? 'character' : 'characters'}`);
          }
          setTopicName(e.target.value);
        }}
        aria-invalid={validTopic ? 'false' : 'true'}
        aria-describedby='topicnote'
        onFocus={() => setTopicFocus(true)}
        onBlur={() => setTopicFocus(false)}
        required
        className='text-field'
      />
      <p id='topicnote' className={topicFocus && !validTopic ? 'instructions' : 'offscreen'}>
        <FontAwesomeIcon icon={faInfoCircle} />{' '}
        3 to 25 characters, letters and numbers only.
      </p>
      <div>
        <button type='button' onClick={() => {
          setTopicName('');
          setAddTopic(false);
        }}>Cancel</button>
        <button disabled={!validTopic ? true : false}>Submit</button>
      </div>
    </form>
  )
}
export default TopicForm