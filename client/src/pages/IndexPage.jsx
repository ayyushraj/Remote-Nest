import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('/api/places');
        setPlaces(response.data);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };
  
    fetchPlaces();
  }, []);
  

  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {places.length > 0 && places.map(place => (
        <Link to={`/place/${place._id}`} key={place._id}>
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
            {place.photos?.[0] && (
              <Image className="rounded-2xl object-cover aspect-square" src={place.photos[0]} alt={place.title || "Place image"} />
            )}
          </div>
          <h2 className="font-bold">{place.address}</h2>
          <h3 className="text-sm text-gray-500">{place.title}</h3>
          <div className="mt-1">
            <span className="font-bold">Rs.{place.price}</span> per night
          </div>
        </Link>
      ))}
    </div>
  );
}
