import React, { useState } from 'react';
import { Upload, User, Phone, Mail, MapPin, Calendar, BookOpen, Users } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const StudentRegistrationForm = () => {
       const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        // Basic Info
        admissionNo: '',
        studentName: { first: '', middle: '', last: '' },
        session: '2021-2025',
        course: 'B TECH',
        branch: 'AERONAUTICAL',
        academicYear: '4th Year',
        semester: 'Semester 8',
        admittedSection: 'A',
        rollNo: '',
        barcode: '210136001',
        bputRegNo: '210136001',
        dateOfBirth: '03/11/2003',
        motherTongue: 'ODIA',
        bloodGroup: 'A+',
        religion: 'HINDU',
        nationality: 'INDIAN',
        gender: 'Boy',
        primaryGuardian: 'Father',
        admissionType: 'REGULAR',
        category: 'GENERAL',
        childrenInFamily: '0',

        // Contact Info
        studentEmail: 'onmabhishekrudra@gmail.com',
        studentContact: '7847905146',

        // Parent Details
        fatherName: 'MANAS RANJAN MOHANTY',
        fatherProfession: 'BUSINESS MAN',
        fatherContact: '9437032717',
        fatherEmail: '',
        motherName: 'SASMITA MOHANTY',
        motherProfession: 'SERVICE',
        motherContact: '9327704520',
        motherEmail: '',

        // Address
        residenceAddress: 'Sikshyakapada, Angul, Odisha',
        permanentAddress: 'Sikshyakapada, Angul, Odisha',
        city: 'BHUBNESHWAR',
        state: 'ODISHA',
        country: 'INDIA',
        pincode: '750017',
        phone: '',

        // Aadhar Numbers
        studentAadhar: '421840574850',
        fatherAadhar: '',
        motherAadhar: '',

        sameAddress: true
    });

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSave = () => {
        console.log('Form data saved:', formData);
        alert('Form saved successfully!');
    };

    const handleClear = () => {
        setFormData({
            ...formData,
            studentName: { first: '', middle: '', last: '' },
            studentEmail: '',
            studentContact: '',
            fatherName: '',
            motherName: '',
            residenceAddress: '',
            permanentAddress: ''
        });
    };

    const handleClose = () => {
        console.log('Form closed');
    };

    return (
        <div className="min-h-screen bg-blue-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md mb-6 p-6 border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-blue-800">Student Registration</h1>
                                <p className="text-blue-600">Educational & Institutional Management System</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-blue-500">Welcome</p>
                            <p className="font-semibold text-blue-800">MANAS RANJAN MOHANTY</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-xl shadow-md mb-6 p-4 border border-blue-100">
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleSave}
                            className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleClear}
                            className="px-8 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300 transition-colors font-medium shadow-sm"
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleClose}
                            className="px-8 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors font-medium shadow-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
                    {/* Basic Information */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Admission No*</label>
                                <input
                                    type="text"
                                    value={formData.admissionNo}
                                    onChange={(e) => handleInputChange('admissionNo', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                    placeholder="Enter admission number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">First Name*</label>
                                <input
                                    type="text"
                                    value={formData.studentName.first}
                                    onChange={(e) => handleInputChange('studentName.first', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                    placeholder="ABHISHEK"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Middle Name</label>
                                <input
                                    type="text"
                                    value={formData.studentName.middle}
                                    onChange={(e) => handleInputChange('studentName.middle', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                    placeholder="RUDRA"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Last Name*</label>
                                <input
                                    type="text"
                                    value={formData.studentName.last}
                                    onChange={(e) => handleInputChange('studentName.last', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                    placeholder="PRASAD"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Session</label>
                                <select
                                    value={formData.session}
                                    onChange={(e) => handleInputChange('session', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                >
                                    <option value="2021-2025">2021-2025</option>
                                    <option value="2022-2026">2022-2026</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Course*</label>
                                <select
                                    value={formData.course}
                                    onChange={(e) => handleInputChange('course', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                >
                                    <option value="B TECH">B TECH</option>
                                    <option value="M TECH">M TECH</option>
                                    <option value="MCA">MCA</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Branch*</label>
                                <select
                                    value={formData.branch}
                                    onChange={(e) => handleInputChange('branch', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                >
                                    <option value="AERONAUTICAL">AERONAUTICAL</option>
                                    <option value="COMPUTER SCIENCE">COMPUTER SCIENCE</option>
                                    <option value="MECHANICAL">MECHANICAL</option>
                                    <option value="ELECTRICAL">ELECTRICAL</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Academic Year</label>
                                <select
                                    value={formData.academicYear}
                                    onChange={(e) => handleInputChange('academicYear', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                >
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Semester</label>
                                <select
                                    value={formData.semester}
                                    onChange={(e) => handleInputChange('semester', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                >
                                    <option value="Semester 1">Semester 1</option>
                                    <option value="Semester 2">Semester 2</option>
                                    <option value="Semester 3">Semester 3</option>
                                    <option value="Semester 4">Semester 4</option>
                                    <option value="Semester 5">Semester 5</option>
                                    <option value="Semester 6">Semester 6</option>
                                    <option value="Semester 7">Semester 7</option>
                                    <option value="Semester 8">Semester 8</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Personal Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Roll No</label>
                                <input
                                    type="text"
                                    value={formData.rollNo}
                                    onChange={(e) => handleInputChange('rollNo', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Barcode</label>
                                <input
                                    type="text"
                                    value={formData.barcode}
                                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">BPUT Regn. No</label>
                                <input
                                    type="text"
                                    value={formData.bputRegNo}
                                    onChange={(e) => handleInputChange('bputRegNo', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Mother Tongue</label>
                                <select
                                    value={formData.motherTongue}
                                    onChange={(e) => handleInputChange('motherTongue', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                >
                                    <option value="ODIA">ODIA</option>
                                    <option value="HINDI">HINDI</option>
                                    <option value="ENGLISH">ENGLISH</option>
                                    <option value="BENGALI">BENGALI</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Blood Group</label>
                                <select
                                    value={formData.bloodGroup}
                                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                >
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Religion</label>
                                <select
                                    value={formData.religion}
                                    onChange={(e) => handleInputChange('religion', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                >
                                    <option value="HINDU">HINDU</option>
                                    <option value="MUSLIM">MUSLIM</option>
                                    <option value="CHRISTIAN">CHRISTIAN</option>
                                    <option value="SIKH">SIKH</option>
                                    <option value="OTHER">OTHER</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Nationality</label>
                                <select
                                    value={formData.nationality}
                                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                >
                                    <option value="INDIAN">INDIAN</option>
                                    <option value="OTHER">OTHER</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Gender*</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Boy"
                                            checked={formData.gender === 'Boy'}
                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                            className="mr-2 text-blue-600 focus:ring-blue-500"
                                        />
                                        Boy
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Girl"
                                            checked={formData.gender === 'Girl'}
                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                            className="mr-2 text-blue-600 focus:ring-blue-500"
                                        />
                                        Girl
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-blue-600" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Student Email</label>
                                <input
                                    type="email"
                                    value={formData.studentEmail}
                                    onChange={(e) => handleInputChange('studentEmail', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Student Contact No</label>
                                <input
                                    type="tel"
                                    value={formData.studentContact}
                                    onChange={(e) => handleInputChange('studentContact', e.target.value)}
                                    className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-blue-600" />
                            Photo Upload
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="w-32 h-32 border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center bg-blue-50">
                                <div className="text-center">
                                    <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                    <p className="text-sm text-blue-500">Add Photo</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                Choose File
                            </button>
                        </div>
                    </div>

                    {/* Parent Details */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            Parent Details
                        </h3>

                        {/* Father Details */}
                        <div className="mb-6">
                            <h4 className="font-medium text-blue-800 mb-3">Father Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">Title</label>
                                    <select className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50">
                                        <option value="Mr">Mr.</option>
                                        <option value="Dr">Dr.</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">Father's Name*</label>
                                    <input
                                        type="text"
                                        value={formData.fatherName}
                                        onChange={(e) => handleInputChange('fatherName', e.target.value)}
                                        className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">Profession</label>
                                    <select
                                        value={formData.fatherProfession}
                                        onChange={(e) => handleInputChange('fatherProfession', e.target.value)}
                                        className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                    >
                                        <option value="BUSINESS MAN">BUSINESS MAN</option>
                                        <option value="SERVICE">SERVICE</option>
                                        <option value="FARMER">FARMER</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">Contact Number</label>
                                    <input
                                        type="tel"
                                        value={formData.fatherContact}
                                        onChange={(e) => handleInputChange('fatherContact', e.target.value)}
                                        className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mother Details */}
                        <div>
                            <h4 className="font-medium text-blue-800 mb-3">Mother Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">Title</label>
                                    <select className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50">
                                        <option value="Mrs">Mrs.</option>
                                        <option value="Ms">Ms.</option>
                                        <option value="Dr">Dr.</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">Mother's Name*</label>
                                    <input
                                        type="text"
                                        value={formData.motherName}
                                        onChange={(e) => handleInputChange('motherName', e.target.value)}
                                        className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">Profession</label>
                                    <select
                                        value={formData.motherProfession}
                                        onChange={(e) => handleInputChange('motherProfession', e.target.value)}
                                        className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                    >
                                        <option value="SERVICE">SERVICE</option>
                                        <option value="HOUSEWIFE">HOUSEWIFE</option>
                                        <option value="BUSINESS">BUSINESS</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">Contact Number</label>
                                    <input
                                        type="tel"
                                        value={formData.motherContact}
                                        onChange={(e) => handleInputChange('motherContact', e.target.value)}
                                        className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            Address Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Residence Address */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-800 mb-3">Residence Address</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">Address*</label>
                                        <textarea
                                            value={formData.residenceAddress}
                                            onChange={(e) => handleInputChange('residenceAddress', e.target.value)}
                                            className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                            rows="3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">City/District*</label>
                                        <select
                                            value={formData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                        >
                                            <option value="BHUBNESHWAR">BHUBNESHWAR</option>
                                            <option value="CUTTACK">CUTTACK</option>
                                            <option value="ANGUL">ANGUL</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">State*</label>
                                        <select
                                            value={formData.state}
                                            onChange={(e) => handleInputChange('state', e.target.value)}
                                            className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                        >
                                            <option value="ODISHA">ODISHA</option>
                                            <option value="WEST BENGAL">WEST BENGAL</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">Country*</label>
                                        <select
                                            value={formData.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                        >
                                            <option value="INDIA">INDIA</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">Pincode*</label>
                                        <input
                                            type="text"
                                            value={formData.pincode}
                                            onChange={(e) => handleInputChange('pincode', e.target.value)}
                                            className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Permanent Address */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-800 mb-3">Permanent Address</h4>
                                <div className="mb-3">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.sameAddress}
                                            onChange={(e) => handleInputChange('sameAddress', e.target.checked)}
                                            className="mr-2 text-blue-600 focus:ring-blue-500"
                                        />
                                        Same as Residence Address
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default StudentRegistrationForm;