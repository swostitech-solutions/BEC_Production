import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useFetchRoutes from "../../hooks/useFetchRoutes ";
import useFeeGroups from "../../hooks/useFeeGroups";
import useFetchPickupPoints from "../../hooks/useFetchPickupPoints ";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";

// const DesignComponent = ({ formData, setFormData }) => {
const DesignComponent = ({
  formData,
  setFormData,
  batch_id,
  course_id,
  department_id,
}) => {
  const { id } = useParams();

  // Force blank values on initial render
  const [semesters, setSemesters] = useState([]);
  const [isTransportAvailed, setIsTransportAvailed] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState({});
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedPickUpPoint, setSelectedPickUpPoint] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [periods, setPeriods] = useState([]);
  const [error, setError] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // 🔄 Reset local transport state when parent formData is cleared
  useEffect(() => {
    if (!formData.transport_availed) {
      setIsTransportAvailed(false);
      setSelectedMonths((prev) => {
        const resetMonths = {};
        Object.keys(prev).forEach((monthId) => {
          resetMonths[monthId] = false; // uncheck all
        });
        return resetMonths;
      });
      setSelectedRoute("");
      setSelectedPickUpPoint("");
    }
  }, [formData.transport_availed]);

  const {
    routes,
    loading: routeLoading,
    error: routeError,
  } = useFetchRoutes(isTransportAvailed);

  const {
    pickupPoints,
    loading: pickupLoading,
    error: pickupError,
  } = useFetchPickupPoints(selectedRoute);

  // FeeDetails.js
  const { feeGroups, loading: feeLoading, error: feeError } = useFeeGroups();

  useEffect(() => {
    const storedClassId = localStorage.getItem("selectedClassId");
    const storedCategoryId = localStorage.getItem("selectedCategoryId");

    if (storedClassId) setSelectedClassId(storedClassId);
    if (storedCategoryId) setSelectedCategoryId(storedCategoryId);
  }, []);

  // inside DesignComponent

  useEffect(() => {
    if (formData.addmitted_class) {
      setSelectedClassId(formData.addmitted_class);
      localStorage.setItem("selectedClassId", formData.addmitted_class); // keep in sync
    } else {
      setSelectedClassId(null);
      localStorage.removeItem("selectedClassId");
    }
  }, [formData.addmitted_class]);

  // 10282025
  useEffect(() => {
    if (id) {
      // ✅ Get organization & branch IDs from sessionStorage
      const organization_id = sessionStorage.getItem("organization_id") || 1;
      const branch_id = sessionStorage.getItem("branch_id") || 1;

      // ✅ Build the new API URL
      const apiUrl = `${ApiUrl.apiurl}StudentRegistrationApi/GetStudentDetailsBasedOnId/?organization_id=${organization_id}&branch_id=${branch_id}&student_id=${id}`;

      console.log("📡 Fetching Fee Details From:", apiUrl);

      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "success" && data.data?.fee_details) {
            const { feegroupId, periodId } = data.data.fee_details;

            // ✅ Update formData with API values
            setFormData((prevData) => ({
              ...prevData,
              feegroup: feegroupId || "",
              feeappfrom: periodId || "",
            }));

            setIsDisabled(true);

            console.log("✅ Fee Details Loaded:", {
              feegroupId,
              periodId,
            });
          } else {
            console.warn("⚠️ No fee details found for student ID:", id);
          }
        })
        .catch((err) => {
          console.error("❌ Error fetching student fee details:", err);
        });
    }
  }, [id]);

  // ✅ Fetch Semesters based on selected batch, course, and department
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const organization_id = sessionStorage.getItem("organization_id") || 1;
    const branch_id = sessionStorage.getItem("branch_id") || 1;

    if (!batch_id || !course_id || !department_id) {
      setPeriods([]);
      return;
    }

    const apiUrl = `${ApiUrl.apiurl}Semester/GetSemesterByDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`;

    console.log("📡 Fetching Semesters From:", apiUrl);

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) =>
        response.ok ? response.json() : Promise.reject(response.status)
      )
      .then((data) => {
        const allSemesters = Array.isArray(data) ? data : [];
        setPeriods(allSemesters);
      })
      .catch((err) => {
        console.error("❌ Failed to load semesters:", err);
        setError("Failed to load semesters.");
      });
  }, [batch_id, course_id, department_id]);

  const handleTransportAvailedChange = (e) => {
    if (isDisabled) return;

    const newValue = e.target.checked;
    setIsTransportAvailed(newValue);

    // Update selected months when transport is availed
    const updatedMonths = Object.keys(selectedMonths).reduce((acc, month) => {
      acc[month] = newValue;
      return acc;
    }, {});
    setSelectedMonths(updatedMonths);

    const selectedMonthIds = Object.keys(updatedMonths)
      .filter((month) => updatedMonths[month])
      .map((month) => parseInt(month));

    setFormData((prevData) => ({
      ...prevData,
      transport_availed: newValue, // ✅ updated here immediately
      choice_semester: selectedMonthIds.length > 0 ? selectedMonthIds : [],
      route_id: "",
      route_details: "",
    }));

    // Reset dependent states
    setSelectedRoute("");
    setSelectedPickUpPoint("");
  };

  const handleInputChange = (e) => {
    if (isDisabled) return;
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRouteChange = (e) => {
    if (isDisabled) return;
    const selectedRouteId = e.target.value;
    setSelectedRoute(selectedRouteId);
    setFormData((prevData) => ({
      ...prevData,
      route_id: selectedRouteId,
    }));
  };

  const handlePickUpPointChange = (e) => {
    if (isDisabled) return;
    const selectedPickupPointId = e.target.value;
    setSelectedPickUpPoint(selectedPickupPointId);
    setFormData((prevData) => ({
      ...prevData,
      route_details: selectedPickupPointId,
    }));
  };

  const handleMonthChange = (monthId) => {
    if (isDisabled) return;
    const updatedMonths = {
      ...selectedMonths,
      [monthId]: !selectedMonths[monthId],
    };
    setSelectedMonths(updatedMonths);

    const selectedMonthIds = Object.keys(updatedMonths)
      .filter((month) => updatedMonths[month])
      .map((month) => parseInt(month));

    setFormData((prevData) => ({
      ...prevData,
      choice_semester: selectedMonthIds.length > 0 ? selectedMonthIds : null,
    }));
  };

  // 🔄 Watch category changes
  useEffect(() => {
    if (formData.category) {
      setSelectedCategoryId(formData.category);
      localStorage.setItem("selectedCategoryId", formData.category); // keep in sync
    } else {
      setSelectedCategoryId(null);
      localStorage.removeItem("selectedCategoryId");
    }
  }, [formData.category]);

  return (
    <div className="container-fluid">
      <div className="row mt-3 mx-2">
        <div className="col-12 custom-section-box">
          <div className="row">
            <div className="col-12 border">
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                <div className="row flex-grow-1 mt-2">
                  <div className="col-12 col-md-6 mb-4">
                    <label htmlFor="fee-app-from" className="form-label">
                      Fee App From<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      id="fee-app-from"
                      name="feeappfrom"
                      className="detail"
                      classNamePrefix="semester-dropdown"
                      placeholder="Select Semester"
                      options={periods.map((sem) => ({
                        value: sem.id,
                        label: sem.semester_description,
                      }))}
                      value={
                        formData.feeappfrom
                          ? {
                              value: formData.feeappfrom,
                              label:
                                periods.find(
                                  (s) => s.id === formData.feeappfrom
                                )?.semester_description || formData.feeappfrom,
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: {
                            name: "feeappfrom",
                            value: selectedOption?.value || "",
                          },
                        })
                      }
                      isDisabled={isDisabled}
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="fee-group" className="form-label">
                      Fee Group<span style={{ color: "red" }}>*</span>
                    </label>

                    <Select
                      id="fee-group"
                      className="detail"
                      classNamePrefix="detail"
                      placeholder={
                        // !localStorage.getItem("selectedOrganizationId")
                        //   ? "Select Organization first"
                        //   :
                        !localStorage.getItem("selectedAcademicYearId")
                          ? "Select Academic Year first"
                          : !(
                              localStorage.getItem("selectedCourseId") ||
                              localStorage.getItem("selectedCategoryId")
                            )
                          ? "Select Course or Category first"
                          : feeLoading
                          ? "Loading Fee Groups..."
                          : "Select Fee Group"
                      }
                      isDisabled={
                        !localStorage.getItem("selectedOrganizationId") ||
                        !localStorage.getItem("selectedAcademicYearId") ||
                        !(
                          localStorage.getItem("selectedCourseId") ||
                          localStorage.getItem("selectedCategoryId")
                        ) ||
                        feeLoading
                      }
                      isLoading={feeLoading}
                      options={
                        Array.isArray(feeGroups)
                          ? feeGroups.map((fg) => ({
                              value: fg.id,
                              label: fg.fee_structure_description,
                            }))
                          : []
                      }
                      value={
                        formData.feegroup
                          ? {
                              value: formData.feegroup,
                              label:
                                feeGroups.find(
                                  (fg) =>
                                    Number(fg.id) === Number(formData.feegroup)
                                )?.fee_structure_description ||
                                "Select Fee Group",
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        setFormData((prev) => ({
                          ...prev,
                          feegroup: selectedOption?.value || "",
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Form.Check
            type="checkbox"
            label="Transport Availed"
            className="mb-3"
            style={{ fontWeight: "700" }}
            checked={isTransportAvailed}
            onChange={handleTransportAvailedChange}
            disabled={isDisabled}
          />

          {/* ✅ Show Semesters when Transport Availed */}
          <Row className="mt-3">
            {periods.map((sem) => (
              <Col xs={6} sm={4} md={3} lg={2} key={sem.id} className="mb-3">
                <Form.Check
                  type="checkbox"
                  id={`semester-checkbox-${sem.id}`}
                  label={sem.semester_description}
                  checked={!!selectedMonths[sem.id]}
                  onChange={() => handleMonthChange(sem.id)}
                  disabled={!isTransportAvailed || isDisabled}
                />
              </Col>
            ))}
          </Row>

          <Row className="mt-3">
            <Col md={6} className="mb-4">
              <Form.Group controlId="formRoute">
                <Form.Label>Route</Form.Label>
                <Form.Select
                  value={selectedRoute}
                  onChange={handleRouteChange}
                  className="detail"
                  disabled={!isTransportAvailed || isDisabled}
                >
                  <option value="">Select</option>
                  {routeLoading && <option>Loading...</option>}
                  {!routeLoading &&
                    !error &&
                    routes.length > 0 &&
                    routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.transport_name}
                      </option>
                    ))}
                  {!routeLoading && !error && routes.length === 0 && (
                    <option disabled>No routes found</option>
                  )}
                  {error && <option disabled>Error loading routes</option>}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-2">
              <Form.Group controlId="formPickUpPoint">
                <Form.Label>Pick Up Point</Form.Label>
                <Form.Select
                  value={selectedPickUpPoint}
                  onChange={handlePickUpPointChange}
                  className="detail"
                  disabled={!isTransportAvailed || !selectedRoute || isDisabled}
                >
                  <option value="">Select</option>
                  {pickupLoading && <option>Loading...</option>}
                  {pickupError && <option>Error loading pick-up points</option>}
                  {!pickupLoading && !pickupError && pickupPoints.length > 0 ? (
                    pickupPoints.map((pickupPoint) => (
                      <option
                        key={pickupPoint.routeDetailsId}
                        value={pickupPoint.routeDetailsId}
                      >
                        {pickupPoint.pickup_point_name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No pick-up points available
                    </option>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default DesignComponent;
