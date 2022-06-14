import React, { useState } from 'react';
import styles from './Search.module.scss';

function Search() {
  const [search, setSearch] = useState(Array<{ entityId: string; name: string }>());
  let timer: ReturnType<typeof setTimeout>;

  const handleChange = (value: string) => {
    console.log(value);
    return value;
  };
  const debounce = (value: string) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      handleChange(value);
      clearTimeout(timer);
    }, 2000);
  };

  const optimizedFn = (value: string) => {
    debounce(value);
  };
  return (
    <div className={styles.SearchBar}>
      <input
        type="text"
        name="Search"
        placeholder="Search"
        onChange={(e) => optimizedFn(e.target.value)}
      />
      {setSearch.length > 0 && (
        <div className={styles.autocomplete}>
          {search.map((notice) => (
            <div key={notice.entityId} className={styles.autocompleteItems}>
              <span>{notice.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
