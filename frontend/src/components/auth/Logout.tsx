import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '../ui/button'
import React from 'react'
import { useNavigate } from 'react-router';

const Logout = () => {
    const {signOut} = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = async() => {
        try {
            await signOut();
            navigate("signin")
        } catch (error) {
            console.error(error);
            
        }
    }
  return (
    <Button onClick={handleLogout}>LogOut</Button>
  )
}

export default Logout
