"use client";

import { useEffect, useState } from "react";
import CreateExhibitionForm from "@/components/CreateExhibitionForm";
import ExhibitionGallery from "@/components/ExhibitionGallery";

export default function ExhibitionsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl text-center mt-6">Exhibitions</h1>

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
