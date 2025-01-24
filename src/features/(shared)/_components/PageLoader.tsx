
import { Loader } from "@mantine/core";
import styles from "../shared.module.css";
import variables from "../variables.module.scss";

/** Loader for pages or componenst */
export const PageLoader = () => {

    return (
        <aside className={`${styles.pageLoader}`}>
            <Loader color={variables.lightAccent50} />
        </aside>
    )
}

export default PageLoader