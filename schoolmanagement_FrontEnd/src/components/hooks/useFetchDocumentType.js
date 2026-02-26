import { useState,useEffect } from "react"
import { ApiUrl } from "../../ApiUrl"

const useFetchDocumentType =()=>{
const [document,setDocument] =useState([])
const [loading,setLoading]=useState(true)
const [error,setError] =useState(null)

const url =`${ApiUrl.apiurl}DOCUMENT/GetAllDocumentList/`

useEffect(() =>{
    const fetchDocument =async () =>{
        try{
            const response=await fetch (url);
            const data=await response.json();
            if (response.ok) {
                setDocument(data.data)
            } else {
                setError('Error fetching house data')
            }
        } catch (error) {
            setError(error.message || 'Error fetching document data');
        } finally {
            setLoading(false)
        }
    };
    fetchDocument();
},[])
  return {document,loading,error};
}




export default useFetchDocumentType