
import { Loader } from "@mantine/core";
import styles from "../shared.module.css";

interface PageLoaderProps {
color: string
}

/** Loader for pages or componenst */
export const PageLoader = ({color}: PageLoaderProps) => {

    return (
        <aside className={`${styles.pageLoader}`}>
            <Loader color={color} />
        </aside>
    )
}

export default PageLoader