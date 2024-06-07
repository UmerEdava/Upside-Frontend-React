import { Button, Text } from '@chakra-ui/react'
import { useState } from 'react'
import useShowToast from '../hooks/useShowToast';
import useLogout from '../hooks/useLogout';

const SettingsPage = () => {

  const showToast = useShowToast();

  const logout = useLogout();

  const [loading, setLoading] = useState(false)

  const deactivateAccount = async () => {
    try {
      if (!window.confirm("Are you sure you want to deactivate your account?")) return;

      setLoading(true);

      // Calling deactivate API
      const res = await fetch(`/api/v1/user/deactivate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      showToast("Success", "Account deactivated successfully", "success", 3000, false);

      logout();

    } catch (error) {
      return showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setLoading(false);
    }
  } 

  return (
    <>
    <Text my={1} fontWeight={'bold'}>Deactivate Account</Text>
    <Text my={1}>You can activate your account anytime by logging in.</Text>
    <Button size={'sm'} colorScheme='red' onClick={deactivateAccount}>Deactivate</Button>
    </>
  )
}

export default SettingsPage