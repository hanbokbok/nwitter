import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

const Sweet = ({ sweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newSweet, setNewSweet] = useState(sweetObj.text);

  const textRef = doc(dbService, 'sweets', `${sweetObj.id}`);

  const onDeleteClick = async () => {
    const urlRef = ref(storageService, sweetObj.attachmentUrl);
    const ok = window.confirm('Are you sure you want to delete this sweet?');
    if (ok) {
      await deleteDoc(textRef);
      if (sweetObj.attachmentUrl) {
        await deleteObject(urlRef);
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(textRef, {
      text: newSweet,
    });
    setEditing(false);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              onChange={(e) => setNewSweet(e.target.value)}
              type="text"
              placeholder="Edit your sweet"
              value={newSweet}
              required
              autoFocus
              className="formInput"
            />
            <input type="submit" value={'Update Sweet'} className="formBtn" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            Cancle
          </button>
        </>
      ) : (
        <>
          <h4>{sweetObj.text}</h4>
          {sweetObj.attachmentUrl && <img src={sweetObj.attachmentUrl} />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sweet;
