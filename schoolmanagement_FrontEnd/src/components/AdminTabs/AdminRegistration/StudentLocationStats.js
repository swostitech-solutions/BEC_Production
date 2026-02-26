import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend } from 'recharts';
import { ApiUrl } from '../../../ApiUrl';
import './AdmRegistration.css';

const StudentLocationStats = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(location.state?.studentData || []);
  const [loading, setLoading] = useState(!location.state?.studentData);

  useEffect(() => {
    if (studentData.length === 0) {
      const fetchFullStudentData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) return;

          const organizationId = sessionStorage.getItem("organization_id");
          const branchId = sessionStorage.getItem("branch_id");

          if (!organizationId || !branchId) return;

          const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetAllSTUDENTList/?organization_id=${organizationId}&branch_id=${branchId}`;

          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.data && Array.isArray(data.data)) {
              setStudentData(data.data);
            }
          }
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchFullStudentData();
    }
  }, [studentData.length]);

  const stats = useMemo(() => {
    const cityMap = {};
    const stateMap = {};
    const genderMap = {};
    const courseMap = {};

    studentData.forEach(student => {
      // Location Stats
      const address = (student.addressDetails && student.addressDetails[0]) || {};
      const presentCity = address.present_city ? address.present_city.trim().toUpperCase() : null;
      const presentState = address.present_state ? address.present_state.trim().toUpperCase() : null;

      if (presentCity && presentCity !== "UNKNOWN/NOT PROVIDED" && presentCity !== "UNKNOWN" && presentCity !== "NOT PROVIDED") {
        cityMap[presentCity] = (cityMap[presentCity] || 0) + 1;
      }

      if (presentState && presentState !== "UNKNOWN/NOT PROVIDED" && presentState !== "UNKNOWN" && presentState !== "NOT PROVIDED") {
        stateMap[presentState] = (stateMap[presentState] || 0) + 1;
      }

      // Basic Details Stats (Gender, Course)
      const basic = student.studentBasicDetails || {};
      const gender = basic.gender_name ? basic.gender_name.trim().toUpperCase() : (basic.gender ? basic.gender.trim().toUpperCase() : null);
      const course = basic.course_name ? basic.course_name.trim().toUpperCase() : null;

      if (gender && gender !== "NOT SPECIFIED") {
        genderMap[gender] = (genderMap[gender] || 0) + 1;
      }

      if (course && course !== "NOT SPECIFIED") {
        courseMap[course] = (courseMap[course] || 0) + 1;
      }
    });

    // Formatting for charts
    let cityData = Object.keys(cityMap).map(key => ({ name: key, students: cityMap[key] }));
    let stateData = Object.keys(stateMap).map(key => ({ name: key, students: stateMap[key] }));
    let genderData = Object.keys(genderMap).map(key => ({ name: key, students: genderMap[key] }));
    let courseData = Object.keys(courseMap).map(key => ({ name: key, students: courseMap[key] }));

    // Sort descending
    cityData.sort((a, b) => b.students - a.students);
    stateData.sort((a, b) => b.students - a.students);
    genderData.sort((a, b) => b.students - a.students);
    courseData.sort((a, b) => b.students - a.students);

    return { cityData, stateData, genderData, courseData, totalLocations: cityData.length };
  }, [studentData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658', '#d0ed57', '#a4de6c', '#8dd1e1'];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body custom-section-box">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 style={{ fontWeight: '700', margin: 0 }}>📊 COMPREHENSIVE STUDENT STATISTICS</h4>
                  <small className="text-muted">
                    *Note: Students missing demographic data or specific field properties during registration have been excluded from statistical datasets visually shown below.
                  </small>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/admin/registration')}>🔙 Back to Registration</button>
              </div>

              {loading ? (
                <div className="text-center py-5"><h5>Loading Statistics Data...</h5></div>
              ) : (
                <>
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="card text-white bg-primary mb-3 shadow-sm border-0">
                        <div className="card-body">
                          <h6 className="card-title text-uppercase fw-bold text-white mb-2">Top City Origin</h6>
                          <h3 className="card-text text-white">{stats.cityData.length > 0 ? stats.cityData[0].name : 'N/A'}</h3>
                          <small className="text-light">{stats.cityData.length > 0 ? `${stats.cityData[0].students} Students` : ''}</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card text-white bg-success mb-3 shadow-sm border-0">
                        <div className="card-body">
                          <h6 className="card-title text-uppercase fw-bold text-white mb-2">Top State Origin</h6>
                          <h3 className="card-text text-white">{stats.stateData.length > 0 ? stats.stateData[0].name : 'N/A'}</h3>
                          <small className="text-light">{stats.stateData.length > 0 ? `${stats.stateData[0].students} Students` : ''}</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card text-white bg-warning mb-3 shadow-sm border-0">
                        <div className="card-body">
                          <h6 className="card-title text-uppercase fw-bold text-white mb-2">Total Unique Cities</h6>
                          <h3 className="card-text text-white">{stats.totalLocations}</h3>
                          <small className="text-light">Represented in system</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                          <h5 className="card-title fw-bold text-center mb-4">Top 10 Cities Array</h5>
                          <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                              <BarChart
                                data={stats.cityData.slice(0, 10)}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                                <BarTooltip />
                                <Legend />
                                <Bar dataKey="students" fill="#0088FE" name="Number of Students" radius={[0, 4, 4, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                          <h5 className="card-title fw-bold text-center mb-4">State/Region Distribution</h5>
                          <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                              <PieChart>
                                <Pie
                                  data={stats.stateData}
                                  dataKey="students"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={110}
                                  fill="#8884d8"
                                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                  {stats.stateData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <PieTooltip formatter={(value) => [value, 'Students']} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                          <h5 className="card-title fw-bold text-center mb-4">Gender Demographic Breakdown</h5>
                          <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                              <PieChart>
                                <Pie
                                  data={stats.genderData}
                                  dataKey="students"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={70}
                                  outerRadius={110}
                                  fill="#82ca9d"
                                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                  {stats.genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#0088FE', '#FFBB28', '#FF8042', '#00C49F'][index % 4]} />
                                  ))}
                                </Pie>
                                <PieTooltip formatter={(value) => [value, 'Students']} />
                                <Legend verticalAlign="bottom" height={36} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                          <h5 className="card-title fw-bold text-center mb-4">Course Enrolment Metrics</h5>
                          <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                              <BarChart
                                data={stats.courseData.slice(0, 10)}
                                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                                <YAxis />
                                <BarTooltip />
                                <Legend verticalAlign="top" />
                                <Bar dataKey="students" fill="#8884d8" name="Enrolled Students" radius={[4, 4, 0, 0]}>
                                  {stats.courseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLocationStats;
