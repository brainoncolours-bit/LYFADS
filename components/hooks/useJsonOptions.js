"use client"
import { useEffect, useState } from 'react';

export function useJsonOptions(path) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!path) return;
    fetch(path)
      .then((res) => res.json())
      .then((data) => setOptions(data))
      .catch((err) => console.error(`Failed to load ${path}`, err));
  }, [path]);

  return options;
}
