import "./App.css";
import SearchBar from "./SearchBar";
import AddItem from "./AddItem";
import { useState, useEffect } from "react";
import ItemsDisplay from "./ItemsDisplay";

function App() {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState({ items: [] });

  useEffect(() => {
    fetch("http://localhost:3000/items")
      .then((response) => response.json())
      .then((data) => setData({ items: data }));
  }, []);

  const updateFilters = (param) => {
    setFilters(param);
  };
  const addItem = (item) => {
    let items = data["items"];

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    };
    fetch("http://localhost:3000/items", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        items.push(data);
        setData({ items: items });
        console.log(data);
      });
  };
  const deleteItem = (item) => {
    let items = data["items"];

    const requestOptions = {
      method: "DELETE",
    };
    fetch(`http://localhost:3000/items/${item.id}`, requestOptions).then(
      (response) => {
        if (response.ok) {
          const index = items.indexOf(item);
          items.splice(index, 1);
          setData({ items: items });
        }
      }
    );
  };

  const filterData = (data) => {
    const filteredData = [];
    if (!filters.name) {
      return data;
    }
    for (const item of data) {
      if (filters.name !== "" && item.name !== filters.name) continue;
      if (filters.price !== "" && item.price > filters.price) continue;
      if (filters.type !== "" && item.type !== filters.type) continue;
      if (filters.brand !== "" && item.brand !== filters.brand) continue;
      filteredData.push(item);
    }
    return filteredData;
  };
  return (
    <div className="container">
      <div className="row mt-3">
        <SearchBar updateSearchParams={updateFilters} />
      </div>
      <div className="row mt-4">
        <AddItem addItem={addItem} />
      </div>
      <div className="row mt-3">
        <ItemsDisplay
          items={filterData(data["items"])}
          deleteItem={deleteItem}
        />
      </div>
    </div>
  );
}

export default App;
