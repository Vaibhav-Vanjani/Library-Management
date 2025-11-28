import logo from './logo.svg';
import './App.css';
import { Outlet, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PendingPayment from './pages/PendingPayment';
import Enroll from './pages/Enroll';
import Navbar from './components/Navbar'
import QR from './pages/QR';
import EntryExitQR from './pages/EntryExitQR';

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Outlet/>}>
         <Route index element={<EntryExitQR/>}></Route>
         <Route path='/pendingPayment' element={<PendingPayment/>}></Route>
         <Route path='/enroll' element={<Enroll/>}></Route>
      </Route>
    </Routes>
    </>
  );
}

export default App;
