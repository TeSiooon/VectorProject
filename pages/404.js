import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const NotFound = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 5000);
  }, []);
  return (
    <div>
      <h2>O nie</h2>
      <h3>Nie ma takiej strony</h3>
      <p>
        Wroc na strone glowna <Link href="/">Home</Link>
      </p>
    </div>
  );
};

export default NotFound;
