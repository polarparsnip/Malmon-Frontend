import s from "./Button.module.scss"

export function Button({ children }: any) {
  return (
    <button className={s.button__button}>{children}</button>
  )
}