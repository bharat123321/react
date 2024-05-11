import React from 'react';
import { useParams } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import {useState,useEffect} from 'react'
function SubjectComponent() {
  // Access the subjectname parameter from the URL
  const { subjectname } = useParams();
   const [loading,setLoading]=useState(true);
   const [progress, setProgress] = useState(100);
    useEffect(() => {
        if (progress === 100) {
            setLoading(false); // Progress completed, set loading to false
        }
    }, [progress]);
  return (
    <div>
    <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {!loading &&
      <> 
      <h1>{subjectname} Component</h1>
      <h1>check you are</h1>
       </>
       }
       {loading && 
        <div>
        <h1>You are not login</h1>
        </div>
     }
    </div>
  );
}

export default SubjectComponent;
