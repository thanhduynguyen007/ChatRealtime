import Logout from '@/components/auth/Logout'
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/useAuthStore'
import React from 'react'
import { toast } from 'sonner';

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);
  const handleOnClick = async()=> {
    try {
      await api.get('/users/test', {withCredentials: true});
      toast.success("OK");
    } catch (error) {
      toast.error("Thất bại");
      console.error(error);
      
    }
  }
  return (
    <div>
      {user?.username}
      <Logout/>
      <Button onClick={handleOnClick}>Test</Button>
    </div>
  )
}

export default ChatAppPage
