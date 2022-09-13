import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));

        const now = new Date();

        if (currentUser && currentUser.expiry < now.valueOf()) {
            localStorage.removeItem("user");
            setUser(null);
            router.push("/login");
        } else {
            router.push("/home")
        }
  }, [router])
  return (
    <></>
  )
}
