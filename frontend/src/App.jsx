import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import PatientDashboard from "./pages/patient/Dashboard";
import Exercise from "./pages/patient/Exercise";
import Progress from "./pages/patient/Progress";
import Profile from "./pages/patient/Profile";

import TherapistDashboard from "./pages/therapist/Dashboard";
import Patients from "./pages/therapist/Patients";
import PatientDetails from "./pages/therapist/PatientDetails";

import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import NotFound from "./pages/Common/NotFound";

import PatientLayout from "./components/patient/PatientLayout";

export default function App() {

    return (

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* PATIENT */}

                <Route
                    path="/patient"
                    element={
                        <ProtectedRoute role="patient">
                            <PatientLayout />
                        </ProtectedRoute>
                    }
                  >

                    <Route
                        path="dashboard"
                        element={<PatientDashboard />}
                    />

                    <Route
                        path="exercise"
                        element={<Exercise />}
                    />

                    <Route
                        path="progress"
                        element={<Progress />}
                    />

                    <Route
                        path="profile"
                        element={<Profile />}
                    />

                </Route>

                {/* Therapist */}

                <Route
                    path="/therapist/dashboard"
                    element={
                        <ProtectedRoute role="therapist">
                            <TherapistDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/therapist/patients"
                    element={
                        <ProtectedRoute role="therapist">
                            <Patients />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/therapist/patient/:id"
                    element={
                        <ProtectedRoute role="therapist">
                            <PatientDetails />
                        </ProtectedRoute>
                    }
                />

                {/* ADMIN */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute role="admin">
                            <Users />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

    )

}