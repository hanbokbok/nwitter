import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authService } from 'fbase';
import { updateProfile } from 'firebase/auth';
// import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

const Profile = ({ userObj, refeshUser }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogoutClick = () => {
    authService.signOut();
    navigate('/', { replace: true });
  };

  // const getMySweets = async () => {
  //   const q = query(collection(dbService, 'sweets'), where('creatorId', '==', userObj.uid), orderBy('createdAt'));

  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.id, doc.data());
  //   });
  // };

  // useEffect(() => {
  //   getMySweets();
  // }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refeshUser();
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          autoFocus
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogoutClick}>
        LogOut
      </span>
    </div>
  );
};

export default Profile;
