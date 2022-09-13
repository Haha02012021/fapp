import { useRouter } from "next/router"

export default function Logo() {
    const router = useRouter()
    return (
        <div
            style={{
                float: "left",
                width: "120px",
                fontSize: "32px",
                fontWeight: "800",
                cursor: "pointer",
            }}
            onClick={() => router.push('/home')}
        >
            DAPP
        </div>
    )
}