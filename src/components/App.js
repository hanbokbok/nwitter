import { useEffect, useState } from 'react';
import { authService } from '../fbase';
import { onAuthStateChanged, updateCurrentUser } from 'firebase/auth';

import AppRouter from 'components/Router';

function App() {
  const [initialized, setInitialized] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInitialized(true);
    });
  }, []);

  const refeshUser = () => {
    const user = authService.currentUser;
    // await updateCurrentUser(authService, authService.currentUser);
    setUserObj(Object.assign({}, user));
  };

  return (
    <>
      {initialized ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refeshUser={refeshUser} /> : 'Initializing...'}
      {/* <footer>&copy; {new Date().getFullYear()} Sweeter</footer> */}
    </>
  );
}

export default App;
