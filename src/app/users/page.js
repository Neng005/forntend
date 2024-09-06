'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/component/navbar';

export default function Page() {
  const [items, setItems] = useState([]);
  const [isCheckingToken, setIsCheckingToken] = useState(true); // ใช้ในการตรวจสอบ token
  const router = useRouter(); // ใช้สำหรับทำการ redirect

  // ตรวจสอบ token ก่อนเข้าถึงหน้านี้
  useEffect(() => {
    const token = localStorage.getItem('token'); // หรือใช้ sessionStorage

    if (!token) {
      router.push('/login'); // หากไม่มี token จะ redirect ไปที่หน้า login
    } else {
      setIsCheckingToken(false); // หยุดการตรวจสอบเมื่อเจอ token
    }
  }, [router]); // จะทำงานเมื่อ component ถูก mount

  useEffect(() => {
    if (!isCheckingToken) { // ทำงานดึงข้อมูลเมื่อการตรวจสอบ token เสร็จสมบูรณ์
      async function getUsers() {
        try {
          const res = await fetch('http://localhost:3000/api/users');
          if (!res.ok) {
            console.error('Failed to fetch data');
            return;
          }
          const data = await res.json();
          setItems(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }

      getUsers();
      const interval = setInterval(getUsers, 1000);
      return () => clearInterval(interval);
    }
  }, [isCheckingToken]);

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
        console.log('User deleted successfully');
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (isCheckingToken) {
    return null; // ไม่แสดงอะไรจนกว่าจะตรวจสอบ token เสร็จ
  }

  return (
    <>
      <Navbar />
      <br /><br /><br /><br />
      <div className="container mb-1">
      <Link href='add' className="btn btn-success px-3 mb-3 ">Add</Link>
        <div className="card">
          <div className="card-header">
            Users List
          </div>
          <div className="card-body">
            <div className="row">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th className='col-md-2 text-center'>#</th>
                    <th className='col-md-4'>Firstname</th>
                    <th className='col-md-4'>Lastname</th>
                    <th className='col-md-1'>Edit</th>
                    <th className='col-md-1'>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className='text-center'>{item.id}</td>
                      <td>{item.firstname}</td>
                      <td>{item.lastname}</td>
                      <td><Link href={`/users/edit/${item.id}`} className="btn btn-warning">Edit</Link></td>
                      <td>
                        <button onClick={() => deleteUser(item.id)} className="btn btn-danger">Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <br /><br />
    </>
  );
}
