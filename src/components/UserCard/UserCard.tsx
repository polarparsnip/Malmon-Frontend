import { User } from '@/types'
import s from './UserCard.module.scss'

export default function UserCard(
    {value}: {value: User}
    ) {
    return (
      <div className={s.card__cardContent}>
        <h2>{value.username}</h2>
        <h3>{value.name}</h3>
        <p>{value.completedsentences}</p>
        <p>{value.completedverifications}</p>
        <p>Notandi búinn til þann: {value.created}</p>
      </div>
    )
}