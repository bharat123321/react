import React from 'react';
import { useParams } from 'react-router-dom';

function SubjectComponent() {
  // Access the subjectname parameter from the URL
  const { subjectname } = useParams();

  return (
    <div>
      <h1>{subjectname} Component</h1>
      {/* Render content for the specific subject */}
    </div>
  );
}

export default SubjectComponent;
