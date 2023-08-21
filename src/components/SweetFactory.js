import React, { useState } from 'react';

import { storageService, dbService } from 'fbase';
import {
  collection,
  addDoc,
  // getDocs,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const SweetFactory = ({ userObj }) => {
  const [sweet, setSweet] = useState('');
  const [attachment, setAttachment] = useState('');

  const onSubmit = async (evnet) => {
    evnet.preventDefault();
    let attachmentUrl = '';

    if (attachment !== '') {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attachment, 'data_url');

      attachmentUrl = await getDownloadURL(response.ref);
    }

    const sweetObj = {
      text: sweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbService, 'sweets'), sweetObj);
    setSweet('');
    setAttachment('');
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };

  const onClearAttachment = () => setAttachment('');

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={sweet}
          onChange={(event) => setSweet(event.target.value)}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input
          type="submit"
          value="&rarr;"
          className="factoryInput__arrow"
          style={{ cursor: 'pointer' }}
        />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ opacity: 0 }}
      />

      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factory__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default SweetFactory;
