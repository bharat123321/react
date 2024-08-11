import React from 'react';

const SearchBox = ({ searchTerm, handleSearchChange, searchResults }) => {
  return (
    <div className="search-box">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
