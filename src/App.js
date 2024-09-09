import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from './dataSlice'; // dataSlice.js dosyanızın doğru yolu
import MapComponent from './MapComponent';

const App = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.data);
  const loading = useSelector((state) => state.data.loading);
  const error = useSelector((state) => state.data.error);
  console.log('data', data)

  useEffect(() => {
    // Veri yoksa veri çek
    if (!data || (Array.isArray(data) && data.length === 0)) {
      if (!loading && !error) { // Yüklenme durumu ve hata kontrolü
        dispatch(fetchData());
      }
    }
  }, [dispatch, data, loading, error]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <MapComponent data={data} />
    </div>
  );
};

export default App;
