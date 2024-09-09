// frontend/src/components/Form.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Form.css'; // Optional: Stile für die Form-Komponente

const Form = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch('/api/form');
        const data = await response.json();
        setFormData(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading form data: {error.message}</p>;

  return (
    <div className="form-container">
      <h1>Form Data</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Season</th>
            <th>League</th>
            <th>Division</th>
            <th>Season Type</th>
            <th>Team</th>
            <th>Opponent</th>
            <th>Home</th>
            <th>PTS</th>
            <th>OPP_PTS</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((row, index) => (
            <tr key={index}>
              <td>{row.Date}</td>
              <td>{row.Season}</td>
              <td>{row.League}</td>
              <td>{row.Division}</td>
              <td>{row['Season Type']}</td>
              <td>{row.Team}</td>
              <td>{row.Opponent}</td>
              <td>{row.Home}</td>
              <td>{row.PTS}</td>
              <td>{row.OPP_PTS}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Form;
