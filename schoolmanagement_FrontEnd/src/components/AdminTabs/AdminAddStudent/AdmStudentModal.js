// // AdmPrincipalModal.js
// import React, { useState ,useEffect} from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';

// const AdmStudentModal = ({ show, handleClose }) => {
//   const [roles, setRoles] = useState([]);
//   useEffect(() => {
//     // Fetch roles from the API
//     fetch('http://52.66.66.205:9000/rolelist/')
//       .then(response => response.json())
//       .then(data => setRoles(data))
//       .catch(error => console.error('Error fetching roles:', error));
//   }, []);
//   return (
//     <Modal show={show} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>Add Student</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form>
//           <Form.Group controlId="formProfilePicture">
//             <Form.Label>Profile Picture</Form.Label>
//             <Form.Control type="file" />
//           </Form.Group>
//           <Form.Group controlId="formUserName">
//             <Form.Label>User Name</Form.Label>
//             <Form.Control type="text" placeholder="Enter user name" />
//           </Form.Group>
//           <Form.Group controlId="formFirstName">
//             <Form.Label>First Name</Form.Label>
//             <Form.Control type="text" placeholder="Enter first name" />
//           </Form.Group>
//           <Form.Group controlId="formLastName">
//             <Form.Label>Last Name</Form.Label>
//             <Form.Control type="text" placeholder="Enter last name" />
//           </Form.Group>
//           <Form.Group controlId="formEmail">
//             <Form.Label>Email</Form.Label>
//             <Form.Control type="email" placeholder="Enter email" />
//           </Form.Group>
//           <Form.Group controlId="formPhone">
//             <Form.Label>Parents Name</Form.Label>
//             <Form.Control type="text" placeholder="Parents Name" />
//           </Form.Group>
//           <Form.Group controlId="formUserType">
//             <Form.Label>User Type</Form.Label>
//             <Form.Select as="select"  defaultValue="">
//               <option value="" disabled>
//                 Select user type
//               </option>
//               {roles.map((role, index) => (
//                 <option key={index} value={role.id}>
//                   {role.name}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//           <Form.Group controlId="formBirthday">
//             <Form.Label>Birthday</Form.Label>
//             <Form.Control type="date" />
//           </Form.Group>
//           <Form.Group controlId="formGender">
//       <Form.Label>Gender</Form.Label>
//       <Form.Select as="select" defaultValue="">
//         <option value="" disabled>Select gender</option>
//         <option value="Male">Male</option>
//         <option value="Female">Female</option>
//         <option value="Other">Other</option>
//       </Form.Select>
//     </Form.Group>
//           <Form.Group controlId="formAlternativeNumber">
//             <Form.Label>Parents Contact Number</Form.Label>
//             <Form.Control type="text" placeholder="Parents Contact Number" />
//           </Form.Group>
//           <Form.Group controlId="formAddress">
//             <Form.Label>Address</Form.Label>
//             <Form.Control type="text" placeholder="Enter address"
//              as="textarea"
//              row={10}
//             />
//           </Form.Group>
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose}>
//           Close
//         </Button>
//         <Button variant="primary" onClick={handleClose}>
//           Save Changes
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default AdmStudentModal;





import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AdmStudentModal = ({ show, handleClose }) => {
  const [roles, setRoles] = useState([]);
  const [profilePicture, setProfilePicture] = useState('');
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [parentsName, setParentsName] = useState('');
  const [userType, setUserType] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [parentsContactNumber, setParentsContactNumber] = useState('');
  const [address, setAddress] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch roles from the API
    fetch('http://52.66.66.205:9000/rolelist/')
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error('Error fetching roles:', error));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!profilePicture) newErrors.profilePicture = 'Profile picture is required';
    if (!userName) newErrors.userName = 'User name is required';
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!parentsName) newErrors.parentsName = 'Parents name is required';
    if (!userType) newErrors.userType = 'User type is required';
    if (!birthday) newErrors.birthday = 'Birthday is required';
    if (!gender) newErrors.gender = 'Gender is required';
    if (!parentsContactNumber) newErrors.parentsContactNumber = 'Parents contact number is required';
    if (!address) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      // Submit the form
      console.log({
        profilePicture,
        userName,
        firstName,
        lastName,
        email,
        parentsName,
        userType,
        birthday,
        gender,
        parentsContactNumber,
        address
      });
      handleClose();
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formProfilePicture">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
            {errors.profilePicture && <small className="text-danger">{errors.profilePicture}</small>}
          </Form.Group>
          <Form.Group controlId="formUserName">
            <Form.Label>User Name</Form.Label>
            <Form.Control type="text" placeholder="Enter user name" value={userName} onChange={(e) => setUserName(e.target.value)} />
            {errors.userName && <small className="text-danger">{errors.userName}</small>}
          </Form.Group>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </Form.Group>
          <Form.Group controlId="formParentsName">
            <Form.Label>Parents Name</Form.Label>
            <Form.Control type="text" placeholder="Parents Name" value={parentsName} onChange={(e) => setParentsName(e.target.value)} />
            {errors.parentsName && <small className="text-danger">{errors.parentsName}</small>}
          </Form.Group>
          <Form.Group controlId="formUserType">
            <Form.Label>User Type</Form.Label>
            <Form.Select as="select" value={userType} onChange={(e) => setUserType(e.target.value)} defaultValue="">
              <option value="" disabled>
                Select user type
              </option>
              {roles.map((role, index) => (
                <option key={index} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Form.Select>
            {errors.userType && <small className="text-danger">{errors.userType}</small>}
          </Form.Group>
          <Form.Group controlId="formBirthday">
            <Form.Label>Birthday</Form.Label>
            <Form.Control type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
            {errors.birthday && <small className="text-danger">{errors.birthday}</small>}
          </Form.Group>
          <Form.Group controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Select as="select" value={gender} onChange={(e) => setGender(e.target.value)} defaultValue="">
              <option value="" disabled>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
            {errors.gender && <small className="text-danger">{errors.gender}</small>}
          </Form.Group>
          <Form.Group controlId="formAlternativeNumber">
            <Form.Label>Parents Contact Number</Form.Label>
            <Form.Control type="text" placeholder="Parents Contact Number" value={parentsContactNumber} onChange={(e) => setParentsContactNumber(e.target.value)} />
            {errors.parentsContactNumber && <small className="text-danger">{errors.parentsContactNumber}</small>}
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} as="textarea" rows={3} />
            {errors.address && <small className="text-danger">{errors.address}</small>}
          </Form.Group>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AdmStudentModal;

