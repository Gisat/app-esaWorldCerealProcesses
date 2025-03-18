
import { Loader } from "@mantine/core";
import styles from "../shared.module.css";

/** Loader for pages or componenst */
export const PageLoader = () => {

    return (
        <aside className={`${styles.pageLoader}`}>
            <Loader color={'var(--iconAccentedColor)'} />
        </aside>
    )
}

export default PageLoader