import { useEffect, useRef } from "react";
import { toast } from "sonner";

const names = [
  { name: "Rahul", city: "Mumbai" },
  { name: "Ananya", city: "Hyderabad" },
  { name: "James", city: "New York" },
  { name: "Priya", city: "Bangalore" },
  { name: "Alex", city: "London" },
  { name: "Sophie", city: "Paris" },
  { name: "Yuki", city: "Tokyo" },
  { name: "Carlos", city: "Mexico City" },
  { name: "Fatima", city: "Dubai" },
  { name: "Liam", city: "Sydney" },
  { name: "Meera", city: "Delhi" },
  { name: "Chen", city: "Shanghai" },
  { name: "Emma", city: "Berlin" },
  { name: "Arjun", city: "Chennai" },
  { name: "Olivia", city: "Toronto" },
];

const timeAgo = () => {
  const secs = Math.floor(Math.random() * 55) + 5;
  return secs < 60 ? `${secs} seconds ago` : "just now";
};

const FakeActivityToast = () => {
  const indexRef = useRef(Math.floor(Math.random() * names.length));

  useEffect(() => {
    const show = () => {
      const person = names[indexRef.current % names.length];
      indexRef.current++;
      toast(`${person.name} from ${person.city} just joined`, {
        description: `Entered ${timeAgo()}`,
        position: "bottom-left",
        duration: 4000,
        icon: "🎉",
      });
    };

    const initialDelay = setTimeout(show, 3000);
    const interval = setInterval(show, 8000 + Math.random() * 7000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return null;
};

export default FakeActivityToast;
