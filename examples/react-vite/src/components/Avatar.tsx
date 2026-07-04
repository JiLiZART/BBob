import styles from "./avatar.module.css"

export default function Avatar(props: { children: React.ReactNode }) {

  return (
      <span className={styles.tag}><span className={styles.avatar}/>{props.children}</span>
  )
}
