import React, { useEffect } from "react";

const StatsPage = () => {
  useEffect(() => {
    fetch(`https://wank.wavu.wiki/player/56qLry2hNqEE`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error("Error fetching characters:", error));
  }, []);
  return <div>StatsPage</div>;
};

export default StatsPage;
