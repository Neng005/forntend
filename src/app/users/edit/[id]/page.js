'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/component/navbar';

export default function Page({ params }) {
  const { id } = params;
  const [items, setItems] = useState([]);
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassWord] = useState('');
  const [isCheckingToken, setIsCheckingToken] = useState(true); // ใช้ในการตรวจสอบ token
  const router = useRouter(); // ใช้สำหรับทำการ redirect

  // ตรวจสอบ token เพื่อป้องกันไม่ให้เข้าถึงหน้านี้ก่อนเข้าสู่ระบบ
  useEffect(() => {
    const token = localStorage.getItem('token'); // หรือใช้ sessionStorage

    if (!token) {
      router.push('/login'); // หากไม่มี token จะ redirect ไปที่หน้า login
    } else {
      setIsCheckingToken(false); // หยุดการตรวจสอบเมื่อเจอ token
    }
  }, [router]);

  // ดึงข้อมูลผู้ใช้เมื่อการตรวจสอบ token เสร็จสมบูรณ์
  useEffect(() => {
    if (!isCheckingToken) { // ทำงานดึงข้อมูลเมื่อการตรวจสอบ token เสร็จสมบูรณ์
      async function getUsers() {
        try {
          const res = await fetch(`http://localhost:3000/api/users/${id}`);
          if (!res.ok) {
            console.error('Failed to fetch data');
            return;
          }
          const data = await res.json();
          setItems(data);
          if (data.length > 0) {
            setFirstName(data[0].firstname);
            setLastName(data[0].lastname);
            setUserName(data[0].username);
            setPassWord(data[0].password);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }

      getUsers();
    }
  }, [isCheckingToken, id]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ id, firstname, lastname, username, password }),
    });

    const result = await res.json();
    console.log(result);
  };

  // ไม่แสดงเนื้อหาจนกว่าจะตรวจสอบ token เสร็จ
  if (isCheckingToken) {
    return null; // หรือคุณอาจจะแสดง loading spinner ที่นี่
  }

  return (
    <>
      <Navbar />
      <br /><br /><br />
      <div className="container">
        <div className="card">
          <div className="card-header bg-warning text-dark">
            Edit Form
          </div>
          <div className="card-body">
            {items.map((item) => (
              <form key={item.id} className="row g-3" onSubmit={handleUpdateSubmit}>
                <div className="col-md-6">
                  <label htmlFor="basic-url" className="form-label">FirstName</label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon3"><i className="bi bi-person-vcard"></i></span>
                    <input type="text" className="form-control" value={firstname} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="basic-url" className="form-label">LastName</label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon3"><i className="bi bi-person-vcard-fill"></i></span>
                    <input type="text" className="form-control" value={lastname} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="basic-url" className="form-label">Username</label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon3"><i className="bi bi-person-vcard"></i></span>
                    <input type="text" className="form-control" value={username} onChange={(e) => setUserName(e.target.value)} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="basic-url" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon3"><i className="bi bi-person-vcard-fill"></i></span>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassWord(e.target.value)} required />
                  </div>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-warning"><i className="bi bi-box-arrow-right"></i> UPDATE</button>
                </div>
              </form>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
