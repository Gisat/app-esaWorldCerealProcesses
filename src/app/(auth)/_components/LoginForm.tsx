"use client"

import { Button, Card } from "@mantine/core";
import styles from "../auth.module.css";
import { useRouter } from "next/navigation";

export default () => {

    const router = useRouter();

    return (
        <aside className={`${styles.loginBoxWrapper}`}>
            <Card shadow="sm" padding="lg" radius="md" withBorder className={`${styles.loginBox}`}>
                <h1>Account Access</h1>
                <Button onClick={() => router.push("/api/auth/iam")} className={`${styles.authButton}`} color="green">Login</Button>
                <Button className={`${styles.authButton}`} color="gray">Register</Button>
            </Card>
        </aside>
    )
}