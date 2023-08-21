import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  // getDocs,
} from 'firebase/firestore';

import Sweet from 'components/Sweet';

import { dbService } from 'fbase';
import SweetFactory from 'components/SweetFactory';

const Home = ({ userObj }) => {
  const [sweets, setSweets] = useState([]);

  // const getSweets = async () => {
  //   const q = query(collection(dbService, 'sweets'));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     const sweetObj = {
  //       ...doc.data(),
  //       id: doc.id,
  //     };
  //     setSweets((prev) => [...prev, sweetObj]);
  //   });
  // };

  useEffect(() => {
    const q = query(
      collection(dbService, 'sweets'),
      orderBy('createdAt', 'desc')
    );

    onSnapshot(q, (snapshot) => {
      const sweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSweets(sweetArr);
    });
  }, []);

  return (
    <div className="container">
      <SweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {sweets.map((sweet) => (
          <Sweet
            key={sweet.id}
            sweetObj={sweet}
            isOwner={sweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
