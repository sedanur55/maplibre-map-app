import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from './dataSlice';
import MapComponent from './components/MapComponent';

const App = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.data);
  const loading = useSelector((state) => state.data.loading);
  const error = useSelector((state) => state.data.error);

  useEffect(() => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      if (!loading && !error) {
        dispatch(fetchData());
      }
    }
  }, [dispatch, data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <MapComponent />
    </div>
  );
};

export default App;
