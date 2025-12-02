import logo from './logo.svg';
import './App.css';
import { Outlet, redirect, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import PendingPayment from './pages/PendingPayment';
import Enroll from './pages/Enroll';
import Navbar from './components/Navbar'
import QR from './pages/QR';
import EntryExitQR from './pages/EntryExitQR';
import QrScanner from "./pages/QR";
import QrAdminListener from './components/QrListner';
import EntryExitView from './components/EntryExitView';
import Login from './pages/Login';
import StudentView from './pages/StudentView';
import { useContext, useEffect } from 'react';
import { useStudentContext } from './context/StudentContext';
import VerifiedScan from './pages/VerifiedScan';
import PaymentOptions from './components/PaymentOptions';

function App() {

  const location = useLocation();
  const {loggedInUser} = useStudentContext();
  const redirect = useNavigate();

  useEffect(()=>{
    if(location.pathname.includes("/admin") || location.pathname.includes("/student")){
      if(!loggedInUser?.userId){
        redirect('/');
      }
    }
  },[location.pathname])


  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Outlet/>}>
         <Route index element={<Login/>}></Route>
         <Route path='/student' element={<Outlet/>}>
            <Route index element={<StudentView/>}></Route>
            <Route path='/student/QRScanner' element={<QrScanner/>}></Route>
            <Route path='/student/verifiedScan' element={<VerifiedScan/>}></Route>     
            <Route path='/student/payment' element={<PaymentOptions/>}></Route>     
         </Route>
         <Route path='/admin' element={<Outlet/>}>
            <Route index element={<Home/>}></Route>
            <Route path='/admin/pendingPayment' element={<PendingPayment/>}></Route>
            <Route path='/admin/enroll' element={<Enroll/>}></Route>
            <Route path='/admin/QRAdminListner' element={<QrAdminListener/>}></Route>
            <Route path='/admin/EntryExitView' element={<EntryExitView/>}></Route>
         </Route>
      </Route>
    </Routes>
    </>
  );
}

export default App;
