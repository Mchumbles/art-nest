// "use client";

// import React, { useState, useEffect } from "react";

// interface EditArtworkFormProps {
//   artworkId: string;
// }

// const EditArtworkForm: React.FC<EditArtworkFormProps> = ({ artworkId }) => {
//   const [title, setTitle] = useState("");
//   const [date, setDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const fetchArtwork = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`/api/artworks/${artworkId}`, {
//           method: "GET",
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           setMessage(errorData.error || "Failed to fetch artwork data.");
//           return;
//         }
//         const artworkData = await response.json();

//         setTitle(artworkData.title);
//         setDate(artworkData.date || "");
//       } catch (error) {
//         setMessage("Error fetching artwork data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchArtwork();
//   }, [artworkId]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await fetch(`/api/artworks/${artworkId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ title, date }),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         setMessage(errorData.error || "Failed to update artwork.");
//         return;
//       }
//       setMessage("Artwork updated successfully!");
//     } catch (error) {
//       setMessage("Error updating artwork.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label
//           htmlFor="title"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Title
//         </label>
//         <input
//           id="title"
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           aria-label="Artwork title"
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="date"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Date
//         </label>
//         <input
//           id="date"
//           type="text"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           aria-label="Artwork date"
//         />
//       </div>

//       <button
//         type="submit"
//         className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//         disabled={loading}
//         aria-label="Update Artwork"
//       >
//         {loading ? "Updating..." : "Update Artwork"}
//       </button>
//       {message && <p className="text-sm text-gray-500">{message}</p>}
//     </form>
//   );
// };

// export default EditArtworkForm;
