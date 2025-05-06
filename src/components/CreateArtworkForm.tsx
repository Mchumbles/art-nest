// "use client";

// import { useState, useEffect } from "react";
// import { CreateArtworkFormProps } from "@/types/userArtworks";
// import Loading from "@/components/Loading";

// export default function CreateArtworkForm({
//   exhibitionId,
// }: CreateArtworkFormProps) {
//   const [formData, setFormData] = useState({
//     title: "",
//     artist: "",
//     date: "",
//     image: "",
//     url: "",
//   });
//   const [message, setMessage] = useState<string | null>(null);
//   const [messageType, setMessageType] = useState<"error" | "success" | null>(
//     null
//   );
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setMessage("No token found in localStorage");
//         setMessageType("error");
//         setLoading(false);
//         return;
//       }

//       const response = await fetch("/api/userArtworks", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           ...formData,
//           url: formData.url || "/",
//           exhibitionId,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) throw new Error(data.error || "Something went wrong");

//       setMessage("Artwork created successfully");
//       setMessageType("success");
//       setFormData({
//         title: "",
//         artist: "",
//         date: "",
//         image: "",
//         url: "",
//       });
//     } catch (error) {
//       setMessage("Failed to create artwork");
//       setMessageType("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         setMessage(null);
//         setMessageType(null);
//       }, 5000);

//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 border-2">
//       <h3 className="text-2xl font-bold text-center mb-4">Add New Artwork</h3>

//       {message && (
//         <p
//           className={`text-sm font-medium ${
//             messageType === "error" ? "text-red-600" : "text-green-600"
//           }`}
//           aria-live="polite"
//         >
//           {message}
//         </p>
//       )}

//       <div className="flex flex-col">
//         <label htmlFor="title" className="text-sm font-medium mb-1">
//           Artwork Title
//         </label>
//         <input
//           type="text"
//           id="title"
//           name="title"
//           placeholder="Artwork Title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//           className="border p-2"
//           aria-required="true"
//         />
//       </div>

//       <div className="flex flex-col">
//         <label htmlFor="artist" className="text-sm font-medium mb-1">
//           Artist
//         </label>
//         <input
//           type="text"
//           id="artist"
//           name="artist"
//           placeholder="Artist Name"
//           value={formData.artist}
//           onChange={handleChange}
//           required
//           className="border p-2"
//           aria-required="true"
//         />
//       </div>

//       <div className="flex flex-col">
//         <label htmlFor="date" className="text-sm font-medium mb-1">
//           Date
//         </label>
//         <input
//           type="date"
//           id="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           required
//           className="border p-2"
//           aria-required="true"
//         />
//       </div>

//       <div className="flex flex-col">
//         <label htmlFor="image" className="text-sm font-medium mb-1">
//           Image URL
//         </label>
//         <input
//           type="text"
//           id="image"
//           name="image"
//           placeholder="Image URL (optional)"
//           value={formData.image}
//           onChange={handleChange}
//           required
//           className="border p-2"
//           aria-required="false"
//         />
//       </div>

//       <button type="submit" className="border-2 py-2 px-4" disabled={loading} aria-label="Create new artwork">
//         {loading ? "Creating..." : "Create Artwork"}
//       </button>
//     </form>
//   );
// }
