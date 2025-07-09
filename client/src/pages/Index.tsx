
import { useEffect } from 'react';
import { useLocation } from 'wouter';

const Index = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation('/');
  }, [setLocation]);

  return null;
};

export default Index;
