import { useState, useEffect } from 'react';
import {ApiUrl} from "../../ApiUrl"
const useBookCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchCategories = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
            const token = sessionStorage.getItem("accessToken");
            if (!token) {
                console.error("Access token not found in sessionStorage.");
                setError("Unauthorized: Missing access token.");
                setLoading(false);
                return;
            }
            const response = await fetch(`${ApiUrl.apiurl}BookCategory/GetAllBookCategoryList/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (response.ok) {
                setCategories(result.data || []); // Set categories from API
            } else {
                setError(result.message); // Handle error message from API
            }
        } catch (err) {
            setError('Error fetching categories: ' + err.message);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);
    return { categories, loading, error, fetchCategories }; // Return fetchCategories
};
export default useBookCategories;