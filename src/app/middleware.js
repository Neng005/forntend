import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token'); // ตรวจสอบ token หรือ session

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); // ให้ผ่านไปยังหน้าเพจที่ต้องการ
}

export const config = {
  matcher: ['/protected/:path*'] // กำหนด path ที่ต้องการป้องกัน
};
