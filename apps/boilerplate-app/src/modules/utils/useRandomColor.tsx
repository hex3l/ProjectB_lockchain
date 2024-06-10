import { useEffect, useState } from 'react';

export const useRandomColor = () => {
  const [avatarColor, setAvatarColor] = useState<string>('#000');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setAvatarColor(randomColor);
      }, 50);
    }
  }, []);
  return avatarColor;
};
