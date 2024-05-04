import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Redirects to category All
const Page = () => {
  const router = useRouter();
  useEffect(() => {
    (async () => router.replace('/listings/All'))().catch((err) => console.log(err));
  }, [router]);
  return <></>;
};

export default Page;
