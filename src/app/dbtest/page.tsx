import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";

const getItems = async () => {
    const res = await fetch("http://localhost:3000/api/items", { cache: "no-store" }); 
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  };
  
  export default async function Home() {
    const items = await getItems();
  
    return (
      <div>
        <h1>Patient Records</h1>
        <ul>
          {items.map((item: any) => (
           <li key={item._id}>
           <h2>{item.fullName} (ID: {item.patientId})</h2>
           <p>Location: {item.location}</p>
           <p>Date of Birth: {item.dateOfBirth}</p>
           <p>Ward No: {item.wardNo}</p>
         
           <h3>Diagnosis</h3>
           <ul>
             {item.diagnosis.map((diag:string, index:Key) => (
               <li key={index}>{diag}</li>
             ))}
           </ul>
         
           <h3>Investigations</h3>
           <ul>
             {item.investigations.map((invest:string, index:Key) => (
               <li key={index}>{invest}</li>
             ))}
           </ul>
         
           <h3>Treatments</h3>
           <ul>
             {item.treatments.map((treatment:string, index:Key) => (
               <li key={index}>{treatment}</li>
             ))}
           </ul>
         
           <h3>Complications</h3>
           <ul>
             {item.complications.map((complication:string, index:Key) => (
               <li key={index}>{complication}</li>
             ))}
           </ul>
         
           <h3>Post Observations</h3>
           <ul>
             {item.postObservations.map((obs: string , index: Key) => (
               <li key={index}>{obs}</li>
             ))}
           </ul>
         </li>
         
          ))}
        </ul>
      </div>
    );
  }
  