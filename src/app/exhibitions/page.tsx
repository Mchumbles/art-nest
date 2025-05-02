"use client";

import { useEffect, useState } from "react";
import CreateExhibitionForm from "@/components/CreateExhibitionForm";
import ExhibitionGallery from "@/components/ExhibitionGallery";
import Loading from "@/components/Loading";

export default function ExhibitionsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="text-2xl text-center mt-10">Exhibitions</h1>

      {isLoggedIn ? (
        <>
          <CreateExhibitionForm />
          <ExhibitionGallery />
        </>
      ) : (
        <p className="text-center text-lg mt-4">
          Please log in to create or see your exhibitions.
        </p>
      )}
    </div>
  );
}
