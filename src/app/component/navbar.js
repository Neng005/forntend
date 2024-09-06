'use client';  // เพิ่มบรรทัดนี้เพื่อบอกว่าเป็น Client Component

import BootstrapClient from '@/app/component/BootstrapClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);  // ถ้าเจอ token จะตั้งค่า isLoggedIn เป็น true
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');  // ลบ token
        setIsLoggedIn(false);
        router.push('/login');  // Redirect ไปหน้า login
    };

    return (
        <>
            <BootstrapClient />
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand fw-5" href="#">Kopter</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="about">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="service">Service</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="contact">Contact</a>
                            </li>
                        </ul>

                        <div className="d-flex">
                            {isLoggedIn ? (
                                <button onClick={handleLogout} className="btn btn-outline-danger mx-1">Logout</button>
                            ) : (
                                <>
                                    <a href="signup" className="btn btn-outline-danger mx-1">Sign Up</a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
